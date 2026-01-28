document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const overlay = document.querySelector(".overlay");
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    nav.classList.toggle("active");
    overlay.classList.toggle("active");
  });
  overlay.addEventListener("click", () => {
    burger.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
  });

  const video = document.querySelector(".food-video");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");

  // Ensure touch/pointer releases clear active state on mobile
  function attachReleaseBlur(btn) {
    if (!btn) return;
    btn.addEventListener('pointerup', () => { try { btn.blur(); } catch (e) {} });
    btn.addEventListener('pointercancel', () => { try { btn.blur(); } catch (e) {} });
    btn.addEventListener('touchend', () => { try { btn.blur(); } catch (e) {} }, { passive: true });
  }
  attachReleaseBlur(leftBtn);
  attachReleaseBlur(rightBtn);

  // Intercept partnership and contact forms to provide immediate feedback
  const partnerForm = document.querySelector('.partner-form');
  const contactForm = document.querySelector('.contact-form');
  function handleFormStub(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = 'Thanks!';
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 1800);
    }, 900);
  }
  if (partnerForm) partnerForm.addEventListener('submit', handleFormStub);
  if (contactForm) contactForm.addEventListener('submit', handleFormStub);

  const videos = [
    "video/854105-hd_1920_1080_25fps.mp4",
    "video/1745532-hd_1920_1080_30fps.mp4",
    "video/3015488-hd_1920_1080_24fps.mp4",
    "video/7141501-uhd_2160_4096_30fps.mp4"
  ];

  let currentIndex = 0;

  // Helper: show/hide overlay sized to the actual <video> element
  function showOverlayForVideo(wrapper) {
    if (!wrapper) return;
    const vidEl = wrapper.querySelector('.food-video');
    const ov = wrapper.querySelector('.video-overlay');
    if (!vidEl || !ov) return;
    const rect = vidEl.getBoundingClientRect();
    const wrapRect = wrapper.getBoundingClientRect();
    ov.style.position = 'absolute';
    ov.style.width = rect.width + 'px';
    ov.style.height = rect.height + 'px';
    ov.style.left = (rect.left - wrapRect.left) + 'px';
    ov.style.top = (rect.top - wrapRect.top) + 'px';
    const br = window.getComputedStyle(vidEl).borderRadius;
    if (br) ov.style.borderRadius = br;
    wrapper.classList.add('overlay-visible');
  }

  function hideOverlayForVideo(wrapper) {
    if (!wrapper) return;
    const ov = wrapper.querySelector('.video-overlay');
    if (!ov) return;
    wrapper.classList.remove('overlay-visible');
    ov.style.width = '';
    ov.style.height = '';
    ov.style.left = '';
    ov.style.top = '';
    ov.style.position = '';
    ov.style.borderRadius = '';
  }

  function changeVideo(index) {
    currentIndex = (index + videos.length) % videos.length;
    video.src = videos[currentIndex];
    video.play();
    // hide any visible in-wrapper overlay when switching videos
    const wrapper = video.closest('.video-wrapper');
    if (wrapper) {
      // remove any explicit visible state
      wrapper.classList.remove('overlay-visible');
      const ov = wrapper.querySelector('.video-overlay');
      if (ov) {
        ov.style.width = '';
        ov.style.height = '';
        ov.style.left = '';
        ov.style.top = '';
        ov.style.position = '';
        ov.style.borderRadius = '';
      }
      // briefly suppress hover/click-driven overlay to avoid flash when switching
      wrapper.classList.add('suppress-overlay');
      setTimeout(() => {
        wrapper.classList.remove('suppress-overlay');
      }, 350);
      // remove focus from switch buttons so mobile doesn't keep the active/focused style
      try {
        if (leftBtn && leftBtn.blur) leftBtn.blur();
        if (rightBtn && rightBtn.blur) rightBtn.blur();
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      } catch (e) {}
    }
  }

  rightBtn.addEventListener("click", () => {
    changeVideo(currentIndex + 1);
  });

  leftBtn.addEventListener("click", () => {
    changeVideo(currentIndex - 1);
  });

  // Mobile: TikTok-like fullscreen toggle
  const body = document.body;
  const moreBtn = document.querySelector('.more-btn');

  function toggleMobileFullscreen() {
    if (window.innerWidth > 768) return; // only on small screens
    if (!body.classList.contains('video-fullscreen')) {
      body.classList.add('video-fullscreen');
      try {
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch (e) {
        // ignore
      }
    } else {
      body.classList.remove('video-fullscreen');
      try {
        if (document.exitFullscreen) document.exitFullscreen();
      } catch (e) {}
    }
  }

  // On mobile: toggle the local overlay (show 'More...') instead of fullscreen
  video.addEventListener('click', (e) => {
    e.stopPropagation();
    const wrapper = video.closest('.video-wrapper');
    if (!wrapper) return;
    if (window.innerWidth <= 768) {
      // if we just switched videos, suppress-overlay may be active
      // in that case ignore this click (prevents immediate overlay show)
      if (wrapper.classList.contains('suppress-overlay')) return;
      // toggle overlay-visible class to show in-wrapper More button
      const ov = wrapper.querySelector('.video-overlay');
      const vidEl = wrapper.querySelector('.food-video');
      if (ov && vidEl) {
        if (wrapper.classList.contains('overlay-visible')) {
          // hide
          wrapper.classList.remove('overlay-visible');
          ov.style.width = '';
          ov.style.height = '';
          ov.style.left = '';
          ov.style.top = '';
        } else {
          // compute size/position to match video container so only video is darkened
          const rect = vidEl.getBoundingClientRect();
          const wrapRect = wrapper.getBoundingClientRect();
          ov.style.position = 'absolute';
          ov.style.width = rect.width + 'px';
          ov.style.height = rect.height + 'px';
          ov.style.left = (rect.left - wrapRect.left) + 'px';
          ov.style.top = (rect.top - wrapRect.top) + 'px';
          // match video's border radius so overlay aligns with rounded corners
          const br = window.getComputedStyle(vidEl).borderRadius;
          if (br) ov.style.borderRadius = br;
          wrapper.classList.add('overlay-visible');
        }
      } else {
        wrapper.classList.toggle('overlay-visible');
      }
    } else {
      // desktop: toggle an overlay sized to the video (no fullscreen)
      if (wrapper.classList.contains('suppress-overlay')) return;
      if (wrapper.classList.contains('overlay-visible')) hideOverlayForVideo(wrapper);
      else showOverlayForVideo(wrapper);
    }
  });

  // Desktop: also show overlay on hover (mouseenter/mouseleave) so it behaves like hover-darken but only over the video
  const wrapperEl = document.querySelector('.video-wrapper');
  if (wrapperEl) {
    wrapperEl.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768 && !wrapperEl.classList.contains('suppress-overlay')) showOverlayForVideo(wrapperEl);
    });
    wrapperEl.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) hideOverlayForVideo(wrapperEl);
    });
  }

  // Hide any overlay when resizing to mobile or when leaving desktop
  window.addEventListener('resize', () => {
    const wrapper = document.querySelector('.video-wrapper');
    if (!wrapper) return;
    if (window.innerWidth <= 768) hideOverlayForVideo(wrapper);
  });

  if (moreBtn) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Do NOT trigger fullscreen/zoom on mobile when pressing More.
      // Instead toggle a local state class so you can implement a menu/panel later.
      const wrapper = moreBtn.closest('.video-wrapper');
      if (wrapper) wrapper.classList.toggle('more-open');
    });
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) body.classList.remove('video-fullscreen');
  });

  // Show 'OrderUz' near logo when user scrolls
  let lastKnownScrollY = 0;
  const scrollThreshold = 50;
  function onScroll() {
    lastKnownScrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (lastKnownScrollY > scrollThreshold) document.body.classList.add('scrolled');
    else document.body.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Also toggle/show site title when logo is tapped (mobile)
  const logoEl = document.querySelector('.logo');
  if (logoEl) {
    logoEl.addEventListener('click', (e) => {
      // always toggle visual rotation class on the logo
      logoEl.classList.toggle('rotated');
      // show site title briefly if not already visible (or keep if user scrolled)
      if (!document.body.classList.contains('scrolled')) {
        document.body.classList.add('scrolled');
        setTimeout(() => {
          // only remove if user hasn't scrolled past threshold
          const y = window.pageYOffset || document.documentElement.scrollTop;
          if (y <= scrollThreshold) document.body.classList.remove('scrolled');
        }, 3000);
      }
    });
  }

    // --- Section toggle logic: show only the selected section, hide others ---
    const navLinks = document.querySelectorAll('.nav-links a[data-target]');
    const sections = document.querySelectorAll('.content-section');
    const home = document.getElementById('home');

    function showSection(id) {
      if (id === 'home') {
        // show home, hide other sections
        if (home) home.classList.remove('hidden');
        sections.forEach((s) => s.classList.remove('active'));
      } else {
        // hide home, show only requested section
        if (home) home.classList.add('hidden');
        sections.forEach((s) => {
          if (s.id === id) s.classList.add('active');
          else s.classList.remove('active');
        });
      }
    }

    // Use event delegation on the nav list to handle clicks (more reliable across devices)
    nav.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-target]');
      if (!link) return;
      e.preventDefault();
      const target = link.dataset.target;
      if (!target) return;
      showSection(target);
      // Close mobile menu / overlay so sections don't get blocked
      burger.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
    });

    // initial state: show home (sections hidden)
    showSection('home');
});