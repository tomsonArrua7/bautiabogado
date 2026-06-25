document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTS ---
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');

  // --- NAVBAR SCROLL & ACTIVE STATE ---
  window.addEventListener('scroll', () => {
    // 1. Shrink header on scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 2. Active nav link highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 120; // offset for nav header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- MOBILE NAVIGATION TOGGLE ---
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Toggle menu icon between burger and X
      const icon = navToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons(); // refresh icons
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      });
    });
  }
});
