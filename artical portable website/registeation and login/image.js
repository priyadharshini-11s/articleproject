// DOM elements
const imageWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search input");
const loadMoreBtn = document.querySelector(".gallery .load-more");
const lightbox = document.querySelector(".lightbox");
const downloadImgBtn = lightbox.querySelector(".uil-import");
const closeImgBtn = lightbox.querySelector(".close-icon");

// API key, paginations, searchTerm variables
const apiKey = "7O0R6Ul5J9YvGNlQYyt2wrxfnQI8HRmqqIRTtAAixok64Pz17Nv3FswM"; // Replace with your actual API key
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

// Function to download image
const downloadImg = (imgUrl) => {
    fetch(imgUrl)
        .then(res => res.blob())
        .then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = new Date().getTime(); // Uses timestamp for filename
            a.click();
        })
        .catch(() => alert("Failed to download image!"));
}

// Function to show lightbox with the clicked image
const showLightbox = (name, img) => {
    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img); // Set the image source for download
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden"; // Disable body scroll when lightbox is open
}

// Function to hide the lightbox
const hideLightbox = () => {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto"; // Enable body scroll after closing lightbox
}

// Function to generate HTML for images
const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img => `
        <li class="card">
            <img 
                onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" 
                src="${img.src.large2x}" 
                alt="img"
            >
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');">
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>
    `).join("");
}

// Function to fetch images from the Pexels API
const getImages = (apiURL) => {
    searchInput.blur(); // Remove focus from search input
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, {
        headers: { Authorization: apiKey }
    })
        .then(res => res.json())
        .then(data => {
            generateHTML(data.photos);
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        })
        .catch(() => alert("Failed to load images!"));
}

// Function to load more images
const loadMoreImages = () => {
    currentPage++; // Increment currentPage by 1
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? 
        `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : 
        apiUrl;
    
    getImages(apiUrl);
}

// Function to load images based on search term
const loadSearchImages = (e) => {
    if (e.target.value === "") {
        searchTerm = null; // Reset search term if input is empty
        return;
    }

    if (e.key === "Enter") {
        currentPage = 1; // Reset to first page when new search term is entered
        searchTerm = e.target.value;
        imageWrapper.innerHTML = ""; // Clear previous results
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
    }
}

// Initial API call to load curated images
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

// Event Listeners
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
