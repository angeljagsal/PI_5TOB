import languages from "../Public/js/languages.js";

function initializeTranslator() {
  var selectFirst = document.querySelector(".first");
  var selectSecond = document.querySelector(".second");
  var translate = document.querySelector(".translate");
  var fromText = document.querySelector(".fromText");
  var toText = document.querySelector(".toText");
  var change = document.getElementById("change");
  var reades = document.querySelectorAll(".read");
  var listen = document.querySelector(".listen");

  var language1 = "en-GB";
  var language2 = "es-ES";

  // Populate language options
  for (var language of languages) {
    var key = Object.keys(language)[0];
    var value = Object.values(language)[0];
    selectFirst.innerHTML += `<option value="${key}">${value}</option>`;
    selectSecond.innerHTML += `<option value="${key}">${value}</option>`;
  }

  // Set default languages
  selectFirst.value = language1;
  selectSecond.value = language2;

  // Switch languages when change button is clicked
  change.addEventListener("click", () => {
    var selectFirstValue = selectFirst.value;
    var selectSecondValue = selectSecond.value;

    // Swap language selections
    selectFirst.value = selectSecondValue;
    selectSecond.value = selectFirstValue;
  });

  // Translate text when Translate button is clicked
  translate.addEventListener("click", async () => {
    if (!fromText.value) return;

    var res = await fetch(`https://api.mymemory.translated.net/get?q=${fromText.value}&langpair=${selectFirst.value}|${selectSecond.value}`);
    var data = await res.json();

    toText.value = data.responseData.translatedText;
  });

  // Read text aloud (text to speech)
  reades.forEach((read, index) => {
    read.addEventListener("click", () => {
      var textToRead = index === 0 ? fromText.value : toText.value;
      if (!textToRead) return;

      speechSynthesis.speak(new SpeechSynthesisUtterance(textToRead));
    });
  });

  // Speech recognition to input text
  var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = language1;

  recognition.onresult = (event) => {
    fromText.value = event.results[0][0].transcript;
  };

  listen.addEventListener("click", () => {
    recognition.start();
  });
}
