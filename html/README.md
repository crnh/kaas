# Cheese Slicer Demo

Static single-page demo: scroll to slice a block of cheese. The page itself never scrolls; each wheel (or key) action removes one slice until none remain.

## Features
- Centered cheese with simple stylized holes.
- CSS cheese slicer overlay.
- Wheel & keyboard (ArrowDown/Right, PageDown, Space) controls.
- Flying slice animation.
- No-page-scroll (overflow hidden + wheel preventDefault).

## Run
Just open `index.html` in a modern browser (no build step needed).

## Reset
Refresh the page to restore the cheese.

## Notes / Customization
Edit `CONFIG.sliceThickness` in `script.js` to change slice size.

## Accessibility
- ARIA labels on cheese & slicer.
- Status region announces when all cheese is sliced.
- Keyboard shortcuts mirror scroll interaction.

Enjoy your (virtual) cheese! 🧀
