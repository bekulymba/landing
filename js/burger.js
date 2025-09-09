// Burger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');
  const body = document.body;

  // Guard: проверим обязательные элементы
  if (!burgerBtn) {
    console.error('Burger button not found');
    return;
  }
  if (!mobileNav) {
    console.error('Mobile nav (#mobileNav) not found');
    return;
  }
  if (!overlay) {
    console.error('Overlay (#overlay) not found');
    return;
  }

  // Новая выборка ссылок/кнопок: левые пункты и правые иконки + label-иконка темы
  const navLinks = mobileNav.querySelectorAll('a.menu-link, a.menu-icon, label.theme-btn');

  let isMenuOpen = false;

  // Toggle mobile menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    burgerBtn.classList.toggle('active', isMenuOpen);
    mobileNav.classList.toggle('open', isMenuOpen);
    overlay.classList.toggle('show', isMenuOpen);
    body.style.overflow = isMenuOpen ? 'hidden' : '';
  }

  // Close mobile menu
  function closeMenu() {
    if (isMenuOpen) {
      isMenuOpen = false;
      burgerBtn.classList.remove('active');
      mobileNav.classList.remove('open');
      overlay.classList.remove('show');
      body.style.overflow = '';
    }
  }

  // Get current page info
  function getCurrentPageInfo() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    const pageName = currentPath.split('/').pop().replace('.html', '') || 'index';

    return {
      path: currentPath,
      hash: currentHash,
      pageName: pageName === 'index' ? 'home' : pageName
    };
  }

  // Update active menu item based on current page and hash
  function updateActiveMenuItem() {
    const currentPage = getCurrentPageInfo();

    navLinks.forEach(link => {
      // Мы используем класс .active только для текстовых пунктов (a.menu-link)
      link.classList.remove('active');

      // Только у <a> есть href; label.theme-btn не имеет href — пропустим
      const href = link.getAttribute && link.getAttribute('href');
      if (!href) return;

      // Anchor-only (starts with '#') - works only on home page
      if (href.startsWith('#')) {
        if (currentPage.pageName === 'home') {
          if (href === currentPage.hash || (href === '#hero' && !currentPage.hash)) {
            link.classList.add('active');
          }
        }
      } else if (href.includes('.html')) {
        // Links that include page + optional hash (index.html#about)
        const [pagePart, hashPart] = href.split('#');
        const linkPageName = pagePart.split('/').pop().replace('.html', '') || 'index';
        const normalizedLinkPage = linkPageName === 'index' ? 'home' : linkPageName;

        if (normalizedLinkPage === currentPage.pageName) {
          if (hashPart) {
            if ('#' + hashPart === currentPage.hash) {
              link.classList.add('active');
            }
          } else {
            link.classList.add('active');
          }
        }
      } else if (href === '/' || href === 'index.html') {
        if (currentPage.pageName === 'home') {
          link.classList.add('active');
        }
      }
    });
  }

  // Handle navigation clicks
  function handleNavClick(e, link) {
    // If this is the theme toggle (label.theme-btn), do nothing here
    if (link.classList.contains('theme-btn') || link.closest('.theme-btn')) {
      return; // don't close menu for theme toggle
    }

    // Always close menu when clicking navigation (external links included)
    closeMenu();

    const href = link.getAttribute && link.getAttribute('href');

    // Handle anchor-only links (e.g., "#about")
    if (href && href.startsWith('#')) {
      const currentPage = getCurrentPageInfo();
      if (currentPage.pageName === 'home') {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          history.pushState(null, null, href);
          // Update active state quickly
          setTimeout(updateActiveMenuItem, 50);
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      } else {
        // Not on home — navigate to index with hash
        window.location.href = 'index.html' + href;
      }
      return;
    }

    // Links with page + hash (e.g., index.html#about)
    if (href && href.includes('#')) {
      const [pagePart, hashPart] = href.split('#');
      const linkPageName = pagePart.split('/').pop().replace('.html', '') || 'index';
      const currentPage = getCurrentPageInfo();

      if ((linkPageName === 'index' && (currentPage.pageName === 'home' || currentPage.pageName === 'index')) ||
          linkPageName === currentPage.pageName) {
        e.preventDefault();
        const targetSection = document.querySelector('#' + hashPart);
        if (targetSection) {
          history.pushState(null, null, '#' + hashPart);
          setTimeout(updateActiveMenuItem, 50);
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
      // otherwise let the browser navigate to another page with hash
      return;
    }

    // For pure .html links or external links we let the browser navigate normally (menu already closed)
  }

  // Event listeners
  burgerBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Handle nav link clicks
  navLinks.forEach(link => {
    // if the clicked element contains an <img> and user clicks the img, we still get event on the <a>/<label>
    link.addEventListener('click', (e) => {
      handleNavClick(e, link);
    });
  });

  // Close menu on window resize (mobile -> desktop)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 599 && isMenuOpen) {
        closeMenu();
      }
    }, 250);
  });

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });

  // Set initial active state
  function setInitialActiveState() {
    updateActiveMenuItem();
  }

  // Initialize
  setInitialActiveState();

  // Update active state on scroll (only for home page with sections)
  let scrollTimer;
  window.addEventListener('scroll', () => {
    const currentPage = getCurrentPageInfo();

    if (currentPage.pageName !== 'home' && currentPage.pageName !== 'index') {
      return;
    }

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (isMenuOpen) return; // don't change while menu is open

      const sections = document.querySelectorAll('section[id]');
      if (sections.length === 0) return;

      const scrollPos = window.scrollY + 100;
      let activeSection = null;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          activeSection = '#' + section.getAttribute('id');
        }
      });

      if (activeSection) {
        const currentHash = window.location.hash;
        if (currentHash !== activeSection) {
          history.replaceState(null, null, activeSection);
          updateActiveMenuItem();
        }
      }
    }, 100);
  });

  // Handle browser back/forward navigation
  window.addEventListener('popstate', () => {
    updateActiveMenuItem();
  });
});
