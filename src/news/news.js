import "../styles/global.css";
import "../styles/style.css";
import "./news.css";

function loadHTML(filename, elementId) {
  fetch(filename)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => console.error("Ошибка загрузки HTML:", error));
}

loadHTML("../partials/header.html", "header-container");
loadHTML("../partials/footer.html", "footer-container");
