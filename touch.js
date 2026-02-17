// Touch and Swipe Controls for Mobile

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const minSwipeDistance = 30; // Minimum distance for a swipe to register

// Handle touch start
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

// Handle touch end
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

// Determine swipe direction and move
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if swipe is long enough
    if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
        return;
    }

    // Determine primary direction
    if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
            game.move('right');
        } else {
            game.move('left');
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            game.move('down');
        } else {
            game.move('up');
        }
    }
}

// Add touch event listeners
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Prevent default touch behavior on the game grid to avoid scrolling
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });

    gridContainer.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
});
