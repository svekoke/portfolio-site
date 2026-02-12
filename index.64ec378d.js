/******/ (() => { // webpackBootstrap
/******/ 	"use strict";



// Функция для загрузки HTML-контента (например, хедера или футера)
function loadHTML(filename, elementId) {
  fetch(filename) // Загружаем файл с контентом
  .then(response => response.text()) // Преобразуем ответ в текст
  .then(data => {
    document.getElementById(elementId).innerHTML = data; // Вставляем загруженный контент в контейнер
  }).catch(error => console.error("Ошибка загрузки HTML:", error)); // Обрабатываем ошибки, если файл не был загружен
}

// Загрузка HTML-фрагментов из папки dist/partials
loadHTML("./partials/header.html", "header-container");
loadHTML("./partials/footer.html", "footer-container");
/******/ })()
;
//# sourceMappingURL=index.64ec378d.js.map