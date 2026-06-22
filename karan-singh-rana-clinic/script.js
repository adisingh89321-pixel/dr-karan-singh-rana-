/**
 * Dr. Karan Singh Rana's Clinic
 * JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll State ---
  const header = document.getElementById('header');
  
  function checkScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check on load

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    mobileNavOverlay.classList.toggle('open');
    menuToggle.classList.toggle('active');
    
    // Toggle body scroll lock
    if (mobileNavOverlay.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  menuToggle.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavOverlay.classList.remove('open');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Booking Modal State ---
  const bookingModal = document.getElementById('bookingModal');
  const bookingModalBackdrop = document.getElementById('bookingModalBackdrop');
  const bookingModalClose = document.getElementById('bookingModalClose');
  const openModalButtons = document.querySelectorAll('.open-booking-modal');
  const bookingForm = document.getElementById('bookingModalForm');
  const bookServiceSelect = document.getElementById('bookService');
  const bookDateInput = document.getElementById('bookDate');

  // Set min date of form to today
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
  }

  function openBookingModal(preselectedService = '') {
    // If we have a preselected service, update the dropdown
    if (preselectedService && bookServiceSelect) {
      let found = false;
      for (let i = 0; i < bookServiceSelect.options.length; i++) {
        if (bookServiceSelect.options[i].value === preselectedService) {
          bookServiceSelect.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        for (let i = 0; i < bookServiceSelect.options.length; i++) {
          if (bookServiceSelect.options[i].text.toLowerCase().includes(preselectedService.toLowerCase())) {
            bookServiceSelect.selectedIndex = i;
            break;
          }
        }
      }
    } else if (bookServiceSelect) {
      bookServiceSelect.selectedIndex = 0;
    }

    // Display modal elements
    bookingModalBackdrop.style.display = 'block';
    bookingModal.style.display = 'flex';

    // Micro-delay to allow CSS transitions to trigger
    setTimeout(() => {
      bookingModal.classList.add('open');
      bookingModalBackdrop.classList.add('open');
    }, 10);

    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    bookingModal.classList.remove('open');
    bookingModalBackdrop.classList.remove('open');

    // Wait for transition to complete before display: none
    setTimeout(() => {
      bookingModal.style.display = 'none';
      bookingModalBackdrop.style.display = 'none';
    }, 400);

    // Only restore body overflow if mobile menu is also closed
    if (!mobileNavOverlay.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  // Bind click events to all buttons requesting a booking
  openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const serviceName = button.getAttribute('data-service') || '';
      openBookingModal(serviceName);
    });
  });

  if (bookingModalClose) {
    bookingModalClose.addEventListener('click', closeBookingModal);
  }
  if (bookingModalBackdrop) {
    bookingModalBackdrop.addEventListener('click', closeBookingModal);
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('open')) {
      closeBookingModal();
    }
  });

  // --- WhatsApp Booking Form Formatter ---
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const email = document.getElementById('bookEmail').value.trim();
      const service = document.getElementById('bookService').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      const notes = document.getElementById('bookNotes').value.trim();

      // Format date for better readability (e.g., DD-MM-YYYY)
      let formattedDate = date;
      try {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        formattedDate = `${day}-${month}-${year}`;
      } catch (err) {
        // Keep fallback date format
      }

      // Compile WhatsApp text template
      let messageText = `*New Appointment Request - Dr. Karan Singh Rana*\n`;
      messageText += `------------------------------------\n`;
      messageText += `👤 *Patient Name:* ${name}\n`;
      messageText += `📞 *Contact Number:* ${phone}\n`;
      if (email) {
        messageText += `📧 *Email Address:* ${email}\n`;
      }
      messageText += `🦷 *Treatment/Service:* ${service}\n`;
      messageText += `📅 *Preferred Date:* ${formattedDate}\n`;
      messageText += `⏰ *Preferred Slot:* ${time}\n`;
      if (notes) {
        messageText += `📝 *Symptoms/Notes:* ${notes}\n`;
      }
      messageText += `------------------------------------\n`;
      messageText += `🟢 _Please confirm this clinic slot request._`;

      // Encode for WhatsApp URI
      const encodedMsg = encodeURIComponent(messageText);
      const whatsappEndpoint = `https://api.whatsapp.com/send?phone=919555731737&text=${encodedMsg}`;

      // Reset form and close modal
      bookingForm.reset();
      closeBookingModal();

      // Redirect user to WhatsApp chat
      window.open(whatsappEndpoint, '_blank');
    });
  }

  // --- FAQ Accordions ---
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const currentItem = trigger.parentElement;
      const otherItems = document.querySelectorAll('.accordion-item');
      
      // Close other accordion panels
      otherItems.forEach(item => {
        if (item !== currentItem && item.classList.contains('active')) {
          item.classList.remove('active');
          const itemIcon = item.querySelector('.acc-icon');
          if (itemIcon) itemIcon.textContent = '+';
        }
      });

      // Toggle current panel
      currentItem.classList.toggle('active');
      const currentIcon = currentItem.querySelector('.acc-icon');
      
      if (currentItem.classList.contains('active')) {
        if (currentIcon) currentIcon.textContent = '−';
      } else {
        if (currentIcon) currentIcon.textContent = '+';
      }
    });
  });

  // --- Active Navigation Link on Scroll ---
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY || window.pageYOffset;
    
    // Check if at the very top of the page (Hero/Home)
    if (scrollPos < 100) {
      navLinks.forEach(link => link.classList.remove('active'));
      const homeLink = document.querySelector('.nav-link[href="#home"]');
      if (homeLink) homeLink.classList.add('active');
      return;
    }

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Offset for sticky header
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Run once on startup
});
