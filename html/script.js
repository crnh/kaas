(function() {
  const cheese = document.getElementById('cheese');
  const message = document.getElementById('message');
  const app = document.getElementById('app');
  const slicer = document.getElementById('slicer');
  const restartBtn = document.getElementById('restart');

  // Add hint once
  const hint = document.createElement('div');
  hint.className = 'hint';
  const isCoarse = matchMedia('(pointer: coarse)').matches;
  hint.textContent = isCoarse ? 'Tap to slice the cheese' : 'Scroll to slice the cheese';
  app.appendChild(hint);

  const CONFIG = {
    sliceThickness: 14,
    animationGap: 260
  };

  const maxHeight = parseInt(getComputedStyle(cheese).getPropertyValue('--cheese-max-height'), 10);
  let cutAmount = 0;
  let locked = false;

  const BASE_SLICER_OFFSET = -(maxHeight / 2) + 4 + 48; // lowered ~half blade height for better top alignment
  function updateSlicerOffset() {
    const offset = BASE_SLICER_OFFSET + cutAmount;
    slicer.style.setProperty('--slicer-offset', offset.toFixed(2) + 'px');
  }

  function sliceCheese() {
    if (locked) return;
  if (cutAmount >= maxHeight) return;
    locked = true;

  const sliceHeight = Math.min(CONFIG.sliceThickness, maxHeight - cutAmount);
  // Trigger slicer bounce
  slicer.classList.remove('slice-move');
  // Force reflow to allow retriggering the animation
  void slicer.offsetWidth;
  slicer.classList.add('slice-move');
    const slice = document.createElement('div');
    slice.className = 'slice';
    slice.style.height = sliceHeight + 'px';
    // Internal fill to align holes to original cheese vertical position
    const fill = document.createElement('div');
    fill.className = 'slice-fill';
    fill.style.setProperty('--slice-offset', cutAmount + 'px');
    slice.appendChild(fill);

    const cheeseRect = cheese.getBoundingClientRect();
    const yOffset = 0; // always from top for notch removal
    slice.style.top = (cheeseRect.top + window.scrollY) + 'px';
    slice.style.position = 'fixed';
  // No clip-path here; slice has its own height. We just align internal fill.
  // Slight horizontal randomness for variety
  const dx = (Math.random()*40) - 20; // -20..20 px
  slice.style.setProperty('--dx', dx.toFixed(1) + 'px');

    document.body.appendChild(slice);
    slice.addEventListener('animationend', () => slice.remove());

  cutAmount += sliceHeight;
  cheese.querySelector('.cheese-fill').style.setProperty('--cheese-cut', cutAmount + 'px');
  updateSlicerOffset();
    if (cutAmount >= maxHeight) {
      setTimeout(() => { cheese.style.visibility = 'hidden'; message.classList.remove('hidden'); }, 320);
    }

    setTimeout(() => locked = false, CONFIG.animationGap);
  }

  function restart() {
    // Remove any remaining flying slices
    document.querySelectorAll('.slice').forEach(s => s.remove());
    cutAmount = 0;
    cheese.style.visibility = 'visible';
    cheese.querySelector('.cheese-fill').style.setProperty('--cheese-cut', '0px');
    message.classList.add('hidden');
  updateSlicerOffset();
  }

  function handleWheel(e) {
    e.preventDefault();
  const dir = e.deltaY > 0 ? 1 : -1;
  if (dir > 0) sliceCheese();
  }

  function handleKey(e) {
    if (['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)) {
      e.preventDefault();
  sliceCheese();
    }
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKey, { passive: false });

  function handlePointer(e) {
    // Only consider touch / coarse pointers
    if (e.pointerType === 'touch' || isCoarse) {
      // Ignore taps on restart button
      if (e.target.closest('#restart')) return;
      e.preventDefault();
      sliceCheese();
    }
  }

  window.addEventListener('pointerdown', handlePointer, { passive: false });

  // Avoid text selection issues on drag
  window.addEventListener('dragstart', e => e.preventDefault());
  // Initial alignment
  updateSlicerOffset();

  slicer.addEventListener('animationend', (e) => {
    if (e.animationName === 'slicerBounce') slicer.classList.remove('slice-move');
  });

  restartBtn.addEventListener('click', restart);
})();
