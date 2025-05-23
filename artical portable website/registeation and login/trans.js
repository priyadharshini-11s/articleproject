const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      exchangeIcon = document.querySelector(".exchange"),
      selectTag = document.querySelectorAll("select"),
      icons = document.querySelectorAll(".row i"),
      translateBtn = document.querySelector("button");

// Populate the dropdowns with languages from countries.js
selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Swap languages when clicking the exchange icon
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

// Clear the translated text when the input field is cleared
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

// Translate text when the "Translate Text" button is clicked
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,  // From language (e.g., 'en-GB')
        translateTo = selectTag[1].value;    // To language (e.g., 'hi-IN')
    if (!text) return;

    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            toText.setAttribute("placeholder", "Translation");
        })
        .catch(err => {
            toText.value = "Error: Translation not available";
        });
});

// Handle the copy and speech icons
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
