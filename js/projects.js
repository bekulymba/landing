async function loadProjects() {
  const res = await fetch("assets/projects.json");
  return res.json();
}

function formatDuration(days) {
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.round(days / 7)} weeks`;
  return `${Math.round(days / 30)} months`;
}

// --- список картинок ---
const randomImages = [
  "images/blog/pause.jpg",
  "images/blog/SF.jpg",
  "images/blog/zxc-cat.gif",
  "images/blog/muted.jpg",
  "images/blog/mertv.jpg",
  "images/blog/amulet.jpg",
  "images/blog/ff.jpg",
  "images/blog/gameroom.jpg",
  "images/blog/list.jpg",
  "images/blog/slova.jpg",
  "images/blog/troll.jpg",
  "images/blog/we.jpg",

];

function getRandomImage() {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}

// --- BLOG CARD (главная) ---
function renderBlogCard(project) {
  const duration = project.meta?.duration_days || 0;
  const tech = project.meta?.technologies || [];
  const works = project.meta?.works || [];

  return `
    <article class="blog__card">
      <img src="${getRandomImage()}" alt="${project.title}" class="blog__image">
      <div class="blog__card-content">
        <p class="blog__topic">${project.tag}</p>
        <h3 class="blog__card-title">${project.title}</h3>
        <p class="blog__card-desc">${project.description}</p>
        <div class="blog__meta">
          <span>${formatDuration(duration)}</span>
          ${tech.map(t => `<span>|</span> <span>${t}</span>`).join(" ")}
          ${works.length ? ` <span>|</span> ${works.map(w => `<span>${w}</span>`).join(" ")}` : ""}
        </div>
        <div class="blog__data"><span>${project.created_at}</span></div>
      </div>
    </article>
  `;
}

// --- PROJECT CARD (страница projects) ---
function renderProjectCard(project) {
  const duration = project.meta?.duration_days || 0;
  const tech = project.meta?.technologies || [];
  const works = project.meta?.works || [];

  return `
    <article class="projects__card">
      <img src="${getRandomImage()}" alt="${project.title}" class="projects__image">
      <div class="projects__card-content">
        <p class="projects__topic">${project.tag}</p>
        <h3 class="projects__card-title">${project.title}</h3>
        <p class="projects__card-desc">${project.description}</p>
        <div class="projects__meta">
          <span>${formatDuration(duration)}</span>
          ${tech.map(t => `<span>|</span> <span>${t}</span>`).join(" ")}
          ${works.length ? ` <span>|</span> ${works.map(w => `<span>${w}</span>`).join(" ")}` : ""}
        </div>
        <div class="projects__data"><span>${project.created_at}</span></div>
      </div>
    </article>
  `;
}

// --- BLOG (3 случайных проекта) ---
async function renderRandomProjects() {
  const container = document.getElementById("random-projects");
  if (!container) return;

  const projects = await loadProjects();
  const shuffled = projects.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  container.innerHTML = selected.map(renderBlogCard).join("");
}

// --- PROJECTS (все + фильтр) ---
async function renderProjectsPage() {
  const container = document.getElementById("projects-list");
  if (!container) return;

  const projects = await loadProjects();
  const tabs = document.querySelectorAll(".projects__tab");
  const indicator = document.querySelector(".projects__tab-indicator");

  function updateIndicator(tab) {
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.left = `${tab.offsetLeft}px`;
  }

  function render(filter) {
    const filtered = filter === "All" ? projects : projects.filter(p => p.tag === filter);
    container.innerHTML = filtered.map(renderProjectCard).join("");
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      render(tab.dataset.filter);
      updateIndicator(tab);
    });
  });

  // показать All при загрузке
  render("All");
  updateIndicator(document.querySelector(".projects__tab.active"));
}

// --- init ---
renderRandomProjects();
renderProjectsPage();
