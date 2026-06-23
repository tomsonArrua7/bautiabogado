document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTS ---
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  
  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (val) => val.trim().length > 0
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('phoneError'),
      validate: (val) => val.replace(/\D/g, '').length >= 8
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (val) => val.trim().length > 0
    }
  };

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

  // --- REAL-TIME FORM VALIDATION ---
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    
    // Validate on input typing
    field.input.addEventListener('input', () => {
      validateField(key);
    });

    // Validate on blur (loss of focus)
    field.input.addEventListener('blur', () => {
      validateField(key);
    });
  });

  function validateField(key) {
    const field = fields[key];
    const isValid = field.validate(field.input.value);
    const formGroup = field.input.closest('.form-group');

    if (isValid) {
      formGroup.classList.remove('has-error');
      return true;
    } else {
      formGroup.classList.add('has-error');
      return false;
    }
  }

  function validateForm() {
    let isFormValid = true;
    Object.keys(fields).forEach(key => {
      const isFieldValid = validateField(key);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });
    return isFormValid;
  }

  // --- FORM SUBMISSION (AJAX) ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous status
      formStatus.style.display = 'none';
      formStatus.className = 'form-status';
      formStatus.innerHTML = '';

      // Run validation
      const isValid = validateForm();
      if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Prepare data
      const formData = {
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        phone: fields.phone.input.value.trim(),
        message: fields.message.input.value.trim()
      };

      // Show loading status
      submitBtn.disabled = true;
      formStatus.style.display = 'flex';
      formStatus.classList.add('loading');
      formStatus.innerHTML = '<div class="spinner"></div><span>Enviando consulta...</span>';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        // Clear loading
        formStatus.classList.remove('loading');
        submitBtn.disabled = false;

        if (response.ok && data.success) {
          // Success state
          formStatus.classList.add('success');
          formStatus.innerHTML = `<i data-lucide="check-circle-2" style="margin-right: 10px; flex-shrink:0;"></i><span>${data.message}</span>`;
          
          // Clear form fields
          contactForm.reset();
          
          // Remove active error/success styling from containers
          Object.keys(fields).forEach(key => {
            fields[key].input.closest('.form-group').classList.remove('has-error');
          });
          
          // Add a note if running in simulated mode
          if (data.simulated) {
            formStatus.innerHTML += '<br><small style="display:block;margin-top:4px;opacity:0.8;">(Nota: Se ha simulado el envío en la consola del servidor ya que no hay credenciales SMTP configuradas)</small>';
          }

        } else {
          // Server error state (e.g. 400 validation error)
          formStatus.classList.add('error');
          formStatus.innerHTML = `<i data-lucide="alert-circle" style="margin-right: 10px; flex-shrink:0;"></i><span>${data.message || 'Ocurrió un error. Por favor intenta de nuevo.'}</span>`;
        }

      } catch (error) {
        // Network/Connection error
        formStatus.classList.remove('loading');
        submitBtn.disabled = false;
        formStatus.classList.add('error');
        formStatus.innerHTML = '<i data-lucide="alert-circle" style="margin-right: 10px; flex-shrink:0;"></i><span>Error de conexión. Asegúrate de que el servidor esté corriendo o intenta contactar por WhatsApp.</span>';
        console.error('Submit error:', error);
      }

      lucide.createIcons(); // refresh status icons
    });
  }
});
