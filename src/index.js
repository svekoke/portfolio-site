import "./styles/global.css";
import "./styles/style.css";

function loadHTML(filename, elementId) {
  fetch(filename)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => console.error("Ошибка загрузки HTML:", error));
}

loadHTML("./partials/header.html", "header-container");
loadHTML("./partials/footer.html", "footer-container");

async function loadNewsPreview() {
  try {
    const response = await fetch("/data/news.json"); // ← Абсолютный путь!
    const data = await response.json();
    const LatestNews = data.news.slice(0, 3);

    LatestNews.forEach((article, index) => {
      const preview = document.querySelectorAll(".news-list-item")[index];
      preview.querySelector(".news-data").textContent = article.preview.date; // ← preview!
      preview.querySelector(".news-name").textContent = article.preview.title;
      preview.querySelector(".news-info").textContent =
        article.preview.excerpt.substring(0, 100) + "...";
      preview.querySelector(
        ".news-main-photo",
      ).src = `./images/${article.preview.image.split("/").pop()}`;
      preview.querySelector(
        ".button-read-more a",
      ).href = `/news/news.html?id=${article.id}`;
    });
  } catch (error) {
    console.error("Ошибка загрузки новостей:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadNewsPreview);
