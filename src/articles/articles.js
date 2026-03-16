import "../styles/global.css";
import "../styles/style.css";
import "./articles.css";

// хедер / футер
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

const PAGE_SIZE = 5; // по 5 статей на странице

function getCurrentPage() {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page") || "1", 10);
  return page > 0 ? page : 1;
}

function setPageInUrl(page) {
  const params = new URLSearchParams(window.location.search);
  params.set("page", page);
  window.location.search = params.toString();
}

// рендер статей
async function loadArticles() {
  try {
    const response = await fetch("/data/articles.json");
    const data = await response.json();
    const allArticles = data.articles; // [{ id, date, title, description, fileUrl }, ...]

    const currentPage = getCurrentPage();
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageArticles = allArticles.slice(start, end);

    const list = document.querySelector(".articles-list");
    const template = document.querySelector(".article-list-item");
    list.innerHTML = "";

    pageArticles.forEach((article) => {
      const li = template.cloneNode(true);

      // текстовые поля
      li.querySelector(".article-data").textContent = article.date;
      li.querySelector(".article-name").textContent = article.title;
      li.querySelector(".article-info").textContent = article.description;

      // ссылка на скачивание
      li.querySelector(".article-download").href = article.fileUrl;

      list.appendChild(li);
    });

    setupPagination(currentPage, Math.ceil(allArticles.length / PAGE_SIZE));
  } catch (e) {
    console.error("Ошибка загрузки статей:", e);
  }
}

// пагинация
function setupPagination(currentPage, totalPages) {
  const pageButtons = document.querySelectorAll(".page-btn");
  pageButtons.forEach((btn) => {
    const page = Number(btn.dataset.page);
    btn.classList.toggle("active", page === currentPage);
    btn.onclick = () => setPageInUrl(page);
    btn.disabled = page > totalPages;
  });

  const prev = document.querySelector(".page-prev");
  const next = document.querySelector(".page-next");

  prev.disabled = currentPage <= 1;
  next.disabled = currentPage >= totalPages;

  prev.onclick = () => {
    if (currentPage > 1) setPageInUrl(currentPage - 1);
  };

  next.onclick = () => {
    if (currentPage < totalPages) setPageInUrl(currentPage + 1);
  };
}

document.addEventListener("DOMContentLoaded", loadArticles);
