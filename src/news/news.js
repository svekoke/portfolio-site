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

async function loadFullNews() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id") || "1";
    const response = await fetch("/data/news.json");
    const data = await response.json();
    const article = data.news.find((item) => item.id === articleId);

    if (!article) {
      console.error("Статья не найдена");
      return;
    }

    document.querySelector(".new-name").textContent = article.full.title;
    document.querySelector(".new-name-data").textContent = article.full.date;
    document.querySelector(".new-text-begin").textContent = article.full.intro;
    document.querySelector(".new-text-main").textContent = article.full.content;

    const img = document.querySelector(".new-photo-change");
    const imageName = article.full.image.split("/").pop();
    img.src = `/images/${imageName}`;
  } catch (error) {
    console.error("Ошибка загрузки статьи:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFullNews();
});
