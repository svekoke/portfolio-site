/******/ (() => { // webpackBootstrap
/******/ 	"use strict";



function loadHTML(filename, elementId) {
  fetch(filename).then(response => response.text()).then(data => {
    document.getElementById(elementId).innerHTML = data;
  }).catch(error => console.error("Ошибка загрузки HTML:", error));
}
loadHTML("../partials/header.html", "header-container");
loadHTML("../partials/footer.html", "footer-container");
/******/ })()
;
//# sourceMappingURL=news.1faf4b92.js.map