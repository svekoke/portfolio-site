import "./styles/global.css";
import "./styles/style.css";

function loadHTML(filename, elementId) {
  fetch(filename)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      if (elementId === "header-container") {
        setupMenuLinks();
      }
    })
    .catch((error) => console.error("Ошибка загрузки HTML:", error));
}

loadHTML("./partials/header.html", "header-container");
loadHTML("./partials/footer.html", "footer-container");

// Функция для  отображения даты: "2025-10-30" в "30.10.2025"
function formatDisplayDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

async function loadNewsPreview() {
  try {
    const response = await fetch("/data/news.json");
    const data = await response.json();

    // 🔥 СОРТИРУЕМ ПО ДАТЕ (новые сверху)
    const sortedNews = [...data.news].sort((a, b) => {
      return new Date(b.preview.date) - new Date(a.preview.date);
    });

    // Берём первые 3 ПОСЛЕ сортировки
    const latestNews = sortedNews.slice(0, 3);

    latestNews.forEach((article, index) => {
      const preview = document.querySelectorAll(".news-list-item")[index];
      if (!preview) return;

      // Преобразуем дату в красивый формат для показа
      const displayDate = formatDisplayDate(article.preview.date);

      preview.querySelector(".news-data").textContent = displayDate;
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

function setupArticlesLink() {
  const link = document.querySelector(".teaching-articles a");
  if (link) {
    link.href = "./articles/articles.html";
  }
}

function setupMenuLinks() {
  const buttons = document.querySelectorAll(".menu-list .list-item-button");
  console.log("Найдено кнопок меню:", buttons.length);

  buttons.forEach((btn, index) => {
    btn.style.cursor = "pointer";
    console.log(`Кнопка ${index}:`, btn.textContent);

    switch (index) {
      case 0: // "Новости"
        btn.onclick = () => {
          console.log("→ latest/latest.html");
          window.location.href = "./latest/latest.html";
        };
        break;
      case 1: // "Обо мне"
        btn.onclick = () => console.log("Обо мне");
        break;
      case 2: // "Отзывы"
        btn.onclick = () => console.log("Отзывы");
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadNewsPreview();
  setupArticlesLink();
});
