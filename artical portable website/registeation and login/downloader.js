const fileInput = document.querySelector("input[type='url']"),
      downloadBtn = document.querySelector("button");

downloadBtn.addEventListener("click", e => {
    e.preventDefault();
    const fileUrl = fileInput.value.trim();
    
    if (!fileUrl) {
        alert("Please enter a valid URL.");
        return;
    }

    downloadBtn.innerText = "Downloading file...";
    downloadFile(fileUrl);
});

function downloadFile(url) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('File download failed');
            }
            return res.blob();
        })
        .then(file => {
            let tempUrl = URL.createObjectURL(file);
            const aTag = document.createElement("a");
            aTag.href = tempUrl;
            aTag.download = url.split("/").pop();  // Extract the filename from URL
            document.body.appendChild(aTag);
            aTag.click();
            downloadBtn.innerText = "Download File";
            URL.revokeObjectURL(tempUrl);
            aTag.remove();
        })
        .catch(() => {
            alert("Failed to download file!");
            downloadBtn.innerText = "Download File";
        });
}
