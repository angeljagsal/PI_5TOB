import languages from "../Public/js/languages.js";

const selectFirst = document.querySelector(".first");
const selectSecond = document.querySelector(".second");
const translate = document.querySelector(".translate");
const fromText = document.querySelector(".fromText");
const toText = document.querySelector(".toText");
const change = document.getElementById("change");
const reades = document.querySelectorAll(".read");
const listen = document.querySelector(".listen");

const language1 = "en-GB";
const language2 = "es-ES";

// Populate language options
for (const language of languages) {
  const key = Object.keys(language)[0];
  const value = Object.values(language)[0];
  selectFirst.innerHTML += `<option value="${key}">${value}</option>`;
  selectSecond.innerHTML += `<option value="${key}">${value}</option>`;
}

// Set default languages
selectFirst.value = language1;
selectSecond.value = language2;

// Switch languages when change button is clicked
change.addEventListener("click", () => {
    const selectFirstValue = selectFirst.value;
    const selectSecondValue = selectSecond.value;
  
    // Swap language selections
    selectFirst.value = selectSecondValue;
    selectSecond.value = selectFirstValue;
  });
  
// Translate text when Translate button is clicked
translate.addEventListener("click", async () => {
  if (!fromText.value) return;

  const res = await fetch(`https://api.mymemory.translated.net/get?q=${fromText.value}&langpair=${selectFirst.value}|${selectSecond.value}`);
  const data = await res.json();

  toText.value = data.responseData.translatedText;
});

// Read text aloud (text to speech)
reades.forEach((read, index) => {
  read.addEventListener("click", () => {
    const textToRead = index === 0 ? fromText.value : toText.value;
    if (!textToRead) return;

    speechSynthesis.speak(new SpeechSynthesisUtterance(textToRead));
  });
});

// Speech recognition to input text
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = language1;

recognition.onresult = (event) => {
  fromText.value = event.results[0][0].transcript;
};

listen.addEventListener("click", () => {
  recognition.start();
});
