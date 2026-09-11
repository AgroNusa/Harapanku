/**
 * Harapanku Clinic - Interactive UI & Lead Intake Controller
 * Handles WhatsApp Modal, Dashboard Interactive Tabs, FAQ Accordion, and Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. MODAL LEAD INTAKE (WHATSAPP FRICTIONLESS BOOKING)
  // ---------------------------------------------------------------------------
  const modal = document.getElementById('assessment-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalBox = document.getElementById('modal-box');
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('quick-assessment-form');
  const formContainer = document.getElementById('modal-form-container');
  const successState = document.getElementById('modal-success-state');
  const successDoneBtn = document.getElementById('success-done-btn');
  const directWaBtn = document.getElementById('direct-wa-btn');
  const selectedPackageBadge = document.getElementById('modal-selected-package');
  const packageBadgeText = document.getElementById('modal-package-name');

  let currentSelectedPackage = '';
  let generatedWaUrl = '';

  const openModal = (packageType = '', serviceFocus = '') => {
    if (!modal) return;

    currentSelectedPackage = packageType;
    if (packageBadgeText && selectedPackageBadge) {
      if (packageType) {
        packageBadgeText.textContent = packageType;
        selectedPackageBadge.classList.remove('hidden');
      } else {
        selectedPackageBadge.classList.add('hidden');
      }
    }

    // Auto-select concern focus if provided
    if (serviceFocus) {
      const concernSelect = document.getElementById('concern-focus');
      if (concernSelect) {
        for (let i = 0; i < concernSelect.options.length; i++) {
          if (concernSelect.options[i].value.toLowerCase().includes(serviceFocus.toLowerCase())) {
            concernSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    // Reset view to form
    if (formContainer) formContainer.classList.remove('hidden');
    if (successState) successState.classList.add('hidden');

    // Show modal with animation
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      if (modalBackdrop) modalBackdrop.classList.remove('opacity-0');
      if (modalBox) {
        modalBox.classList.remove('opacity-0', 'scale-95', 'translate-y-4');
        modalBox.classList.add('opacity-100', 'scale-100', 'translate-y-0');
      }
      const firstInput = document.getElementById('parent-name');
      if (firstInput) firstInput.focus();
    });
  };

  const closeModal = () => {
    if (!modal) return;

    if (modalBackdrop) modalBackdrop.classList.add('opacity-0');
    if (modalBox) {
      modalBox.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
      modalBox.classList.add('opacity-0', 'scale-95', 'translate-y-4');
    }

    setTimeout(() => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (form) form.reset();
      currentSelectedPackage = '';
    }, 250);
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg = btn.getAttribute('data-package') || '';
      const service = btn.getAttribute('data-service') || '';
      openModal(pkg, service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (successDoneBtn) successDoneBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const parentName = document.getElementById('parent-name')?.value.trim() || '';
      const childAge = document.getElementById('child-age')?.value.trim() || '';
      const concern = document.getElementById('concern-focus')?.value || '';
      let phone = document.getElementById('parent-phone')?.value.trim() || '';

      // Clean phone number format
      phone = phone.replace(/\D/g, '');
      if (phone.startsWith('0')) {
        phone = phone.substring(1);
      }

      // Format WhatsApp Message
      let message = `Halo Care Coordinator Klinik Harapanku Balikpapan,\n\nSaya ${parentName}. Ingin mendaftar konsultasi & Asesmen Awal untuk buah hati kami:\n• Usia Anak: ${childAge}\n• Fokus Kebutuhan: ${concern}`;

      if (currentSelectedPackage) {
        message += `\n• Paket Pilihan: ${currentSelectedPackage}`;
      }

      message += `\n• No. WhatsApp: +62${phone}\n\nMohon informasi ketersediaan jadwal terdekat dalam 1-3 hari kerja ini. Terima kasih!`;

      generatedWaUrl = `https://wa.me/628115400992?text=${encodeURIComponent(message)}`;

      // Switch to Success State
      if (formContainer) formContainer.classList.add('hidden');
      if (successState) successState.classList.remove('hidden');

      if (directWaBtn) {
        directWaBtn.href = generatedWaUrl;
      }

      // Automatically trigger WhatsApp opening after brief visual confirmation
      setTimeout(() => {
        window.open(generatedWaUrl, '_blank');
      }, 900);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. PARENT DASHBOARD INTERACTIVE TABS
  // ---------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.dashboard-tab-btn');
  const tabPanels = document.querySelectorAll('.dashboard-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button styles
      tabButtons.forEach(b => {
        b.classList.remove('bg-brand-blue', 'text-white', 'shadow-sm');
        b.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
      });
      btn.classList.add('bg-brand-blue', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');

      // Update panel visibility with smooth fade
      tabPanels.forEach(panel => {
        if (panel.id === `tab-panel-${targetTab}`) {
          panel.classList.remove('hidden');
          panel.classList.add('block');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('block');
        }
      });
    });
  });

  // Interactive Checklist in Goals Tab
  const goalCheckboxes = document.querySelectorAll('.goal-checkbox');
  const goalProgressText = document.getElementById('goals-progress-text');
  const goalProgressBar = document.getElementById('goals-progress-bar');

  const updateGoalProgress = () => {
    if (!goalCheckboxes.length || !goalProgressText || !goalProgressBar) return;
    const total = goalCheckboxes.length;
    let checkedCount = 0;

    goalCheckboxes.forEach(cb => {
      const label = cb.closest('label');
      if (cb.checked) {
        checkedCount++;
        if (label) {
          label.classList.add('bg-brand-sage-light/40', 'border-brand-sage/30');
          label.classList.remove('bg-slate-50', 'border-slate-100');
        }
      } else {
        if (label) {
          label.classList.remove('bg-brand-sage-light/40', 'border-brand-sage/30');
          label.classList.add('bg-slate-50', 'border-slate-100');
        }
      }
    });

    const percent = Math.round((checkedCount / total) * 100);
    goalProgressText.textContent = `${checkedCount} dari ${total} Target Tercapai (${percent}%)`;
    goalProgressBar.style.width = `${percent}%`;
  };

  goalCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateGoalProgress);
  });
  updateGoalProgress();

  // ---------------------------------------------------------------------------
  // 3. ACCORDION FAQ CONTROLLER
  // ---------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-summary');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (summary && content) {
      summary.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close other accordions
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherContent) otherContent.classList.add('hidden');
            if (otherIcon) otherIcon.classList.remove('rotate-180', 'text-brand-blue');
            otherItem.classList.remove('bg-white', 'shadow-sm', 'border-slate-200');
            otherItem.classList.add('bg-[#f8fafc]', 'border-slate-100');
          }
        });

        if (isOpen) {
          content.classList.add('hidden');
          if (icon) icon.classList.remove('rotate-180', 'text-brand-blue');
          item.classList.remove('bg-white', 'shadow-sm', 'border-slate-200');
          item.classList.add('bg-[#f8fafc]', 'border-slate-100');
        } else {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180', 'text-brand-blue');
          item.classList.add('bg-white', 'shadow-sm', 'border-slate-200');
          item.classList.remove('bg-[#f8fafc]', 'border-slate-100');
        }
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 4. MOBILE NAVIGATION DRAWER
  // ---------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (show) => {
    if (!mobileMenuDrawer) return;
    if (show) {
      mobileMenuDrawer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenuDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', () => toggleMobileMenu(false));
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // ---------------------------------------------------------------------------
  // 5. NAVBAR SCROLL SHADOW EFFECT
  // ---------------------------------------------------------------------------
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-white/95');
      navbar.classList.remove('bg-white/85');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/95');
      navbar.classList.add('bg-white/85');
    }
  });
});
