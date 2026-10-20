(() => {
  const header = document.querySelector('.site-header');
  const setHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  };
  if (header) {
    setHeaderHeight();
    new ResizeObserver(setHeaderHeight).observe(header);
    // Re-align an initial deep link after the real header height is known.
    window.addEventListener('load', () => {
      if (!location.hash) return;
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - header.offsetHeight, behavior: 'instant' });
    }, { once: true });
  }

  const track = document.getElementById('project-track');
  if (!track) return;
  const carousel = track.closest('.project-showcase');
  const toolbar = carousel.querySelector('.showcase-toolbar');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const status = carousel.querySelector('.showcase-position');
  const cards = [...track.children];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  toolbar.hidden = false;
  track.dataset.draggable = '';
  let frame = 0;
  let drag = null;
  let suppressClick = false;

  function update() {
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maximum - 2;
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      return rect.right > bounds.left + 8 && rect.left < bounds.right - 8 ? index + 1 : null;
    }).filter(Boolean);
    status.textContent = visible.length === 1
      ? `Project ${visible[0]} of ${cards.length}`
      : `Projects ${visible[0]}–${visible.at(-1)} of ${cards.length}`;
  }
  function go(direction) {
    const step = cards[0].getBoundingClientRect().width + Number.parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  });
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, { passive: true });
  // Focused links must never stay outside the visible gallery.
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.showcase-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const bounds = track.getBoundingClientRect();
    if (rect.left < bounds.left || rect.right > bounds.right) {
      track.scrollBy({ left: rect.left - bounds.left, behavior: 'instant' });
    }
  });
  track.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a, button')) return;
    drag = { id: event.pointerId, startX: event.clientX, startScroll: track.scrollLeft };
    suppressClick = false;
  });
  track.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) < 6 && !suppressClick) return;
    suppressClick = true;
    track.setPointerCapture(event.pointerId);
    track.classList.add('is-dragging');
    track.scrollLeft = drag.startScroll - distance;
  });
  function endDrag() {
    drag = null;
    track.classList.remove('is-dragging');
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('lostpointercapture', endDrag);
  track.addEventListener('pointerleave', () => {
    if (!track.classList.contains('is-dragging')) endDrag();
  });
  track.addEventListener('click', event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
  new ResizeObserver(update).observe(track);
  update();
})();
