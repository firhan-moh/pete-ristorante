document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Theme Toggle (Light / Dark Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const moonIcon = document.getElementById('themeToggleMoon');
  const sunIcon = document.getElementById('themeToggleSun');
  const rootElement = document.documentElement;

  // Retrieve saved preference or check system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = rootElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  }

  // ==========================================
  // 2. Mobile Drawer Navigation
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    mobileMenuBtn.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close drawer when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') && 
        !mobileDrawer.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // ==========================================
  // 3. Navigation Link Active State on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 160; // offset for floating nav

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      updateActiveLink(currentSectionId);
    }
  });

  function updateActiveLink(id) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ==========================================
  // 4. Interactive Menu Tab Filtering
  // ==========================================
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const menuGrid = document.getElementById('menuGrid');
  const menuCards = document.querySelectorAll('.menu-item-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-category');
      
      // Update active button state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Fade out grid, filter, and fade back in
      menuGrid.style.opacity = '0';
      
      setTimeout(() => {
        menuCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (targetCategory === 'all' || cardCategory === targetCategory) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
        menuGrid.style.opacity = '1';
      }, 200);
    });
  });

  // ==========================================
  // 5. Beach Booking System Interaction
  // ==========================================
  const bookType = document.getElementById('bookType');
  const beachFieldsWrapper = document.getElementById('beachFieldsWrapper');
  const bookBeachRow = document.getElementById('bookBeachRow');
  const bookBeachDays = document.getElementById('bookBeachDays');
  const beachTotalCost = document.getElementById('beachTotalCost');
  
  const bookGuests = document.getElementById('bookGuests');
  const bookTime = document.getElementById('bookTime');
  const timeRowWrapper = document.getElementById('timeRowWrapper');
  
  const guestsFormGroup = bookGuests.closest('.form-group');
  const timeFormGroup = bookTime.closest('.form-group');

  // Handle changes to booking type
  bookType.addEventListener('change', () => {
    const val = bookType.value;
    if (val === 'table') {
      beachFieldsWrapper.style.display = 'none';
      guestsFormGroup.style.display = 'flex';
      timeRowWrapper.style.display = 'grid';
      bookGuests.required = true;
      bookTime.required = true;
    } else if (val === 'beach') {
      beachFieldsWrapper.style.display = 'block';
      guestsFormGroup.style.display = 'none';
      timeRowWrapper.style.display = 'none';
      bookGuests.required = false;
      bookTime.required = false;
      calculateBeachPrice();
    } else if (val === 'both') {
      beachFieldsWrapper.style.display = 'block';
      guestsFormGroup.style.display = 'flex';
      timeRowWrapper.style.display = 'grid';
      bookGuests.required = true;
      bookTime.required = true;
      calculateBeachPrice();
    }
  });

  // Calculate beach umbrella prices dynamically
  function calculateBeachPrice() {
    const row = bookBeachRow.value;
    const days = parseInt(bookBeachDays.value) || 1;
    let rate = 25; // default rate
    
    if (row === 'first') rate = 35;
    else if (row === 'mid') rate = 30;
    
    const total = rate * days;
    beachTotalCost.textContent = `€${total}`;
    return { total, rowLabel: bookBeachRow.options[bookBeachRow.selectedIndex].text.split(' - ')[0], days };
  }

  bookBeachRow.addEventListener('change', calculateBeachPrice);
  bookBeachDays.addEventListener('input', calculateBeachPrice);

  // ==========================================
  // 6. Reservation Form Submit & Modal Dialog
  // ==========================================
  const reservationForm = document.getElementById('reservationForm');
  const reservationModal = document.getElementById('reservationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  
  const modalValName = document.getElementById('modalValName');
  const modalValType = document.getElementById('modalValType');
  const modalValGuests = document.getElementById('modalValGuests');
  const modalValDate = document.getElementById('modalValDate');
  const modalValTime = document.getElementById('modalValTime');
  const modalValBeachDetails = document.getElementById('modalValBeachDetails');
  const modalValBeachCost = document.getElementById('modalValBeachCost');
  
  const modalRowGuests = document.getElementById('modalRowGuests');
  const modalRowTime = document.getElementById('modalRowTime');
  const modalRowBeach = document.getElementById('modalRowBeach');
  const modalRowBeachCost = document.getElementById('modalRowBeachCost');

  // Restrict date picker to today and future dates
  const dateInput = document.getElementById('bookDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check HTML5 validation first
    if (!reservationForm.checkValidity()) {
      // Force trigger validation visuals
      const inputs = reservationForm.querySelectorAll('.form-input');
      inputs.forEach(input => {
        // Trigger :user-invalid matching
        input.dispatchEvent(new Event('blur'));
      });
      
      // Focus on the first invalid field
      const firstInvalid = reservationForm.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Extract values
    const name = document.getElementById('bookName').value;
    const type = bookType.value;
    const date = dateInput.value;
    const formattedDate = date.split('-').reverse().join('/');

    // Populate modal values
    modalValName.textContent = name;
    modalValDate.textContent = formattedDate;

    // Reset display rows
    modalRowGuests.style.display = 'none';
    modalRowTime.style.display = 'none';
    modalRowBeach.style.display = 'none';
    modalRowBeachCost.style.display = 'none';

    if (type === 'table') {
      modalValType.textContent = "Tavolo al Ristorante";
      modalRowGuests.style.display = 'flex';
      modalRowTime.style.display = 'flex';
      modalValGuests.textContent = bookGuests.value === '1' ? '1 Persona' : `${bookGuests.value} Persone`;
      modalValTime.textContent = bookTime.value;
    } else if (type === 'beach') {
      modalValType.textContent = "Posto Spiaggia (Chalet)";
      modalRowBeach.style.display = 'flex';
      modalRowBeachCost.style.display = 'flex';
      
      const beachData = calculateBeachPrice();
      modalValBeachDetails.textContent = `${beachData.rowLabel} (${beachData.days} giorn${beachData.days > 1 ? 'i' : 'o'})`;
      modalValBeachCost.textContent = `€${beachData.total}`;
    } else if (type === 'both') {
      modalValType.textContent = "Ristorante + Spiaggia";
      modalRowGuests.style.display = 'flex';
      modalRowTime.style.display = 'flex';
      modalRowBeach.style.display = 'flex';
      modalRowBeachCost.style.display = 'flex';
      
      modalValGuests.textContent = bookGuests.value === '1' ? '1 Persona' : `${bookGuests.value} Persone`;
      modalValTime.textContent = bookTime.value;
      
      const beachData = calculateBeachPrice();
      modalValBeachDetails.textContent = `${beachData.rowLabel} (${beachData.days} giorn${beachData.days > 1 ? 'i' : 'o'})`;
      modalValBeachCost.textContent = `€${beachData.total}`;
    }

    // Show native dialog modal
    if (typeof reservationModal.showModal === 'function') {
      reservationModal.showModal();
    } else {
      // Fallback in case browser does not support showModal
      alert(`Richiesta inviata con successo per ${name}! Ti ricontatteremo a breve per confermare.`);
      resetForm();
    }
  });

  // Reset form helper
  function resetForm() {
    reservationForm.reset();
    // Reset beach fields toggles
    beachFieldsWrapper.style.display = 'none';
    guestsFormGroup.style.display = 'flex';
    timeRowWrapper.style.display = 'grid';
    bookGuests.required = true;
    bookTime.required = true;
  }

  // Close reservation modal
  modalCloseBtn.addEventListener('click', () => {
    if (typeof reservationModal.close === 'function') {
      reservationModal.close();
    }
    resetForm();
  });
});
