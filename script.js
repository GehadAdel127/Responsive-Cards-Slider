const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const pagination = document.querySelector('.pagination');

let autoScrollInterval;
let visibleItems = 3;  // Default: 3 items for larger screens
let scrollStep = 990;  // Default scroll step for large screens
let currentDot = 0;

// Function to update the number of visible items and scroll step based on screen width
function updateVisibleItemsAndScrollStep() {
    const totalItems = slider.children.length - 2; // Subtract 2 to ignore prev/next buttons

    if (window.innerWidth >= 1024) {
        visibleItems = 3;  // 3 items on larger screens
        scrollStep = 990;  // Adjust based on card width
    } else if (window.innerWidth >= 768) {
        visibleItems = 2;  // 2 items on medium screens
        scrollStep = 600;  // Adjust based on card width
    } else {
        visibleItems = 1;  // 1 item on smaller screens
        scrollStep = 320;  // Adjust based on card width
    }

    createPaginationDots(totalItems);
}

// Adjust the number of dots based on visible items
function createPaginationDots(totalItems) {
    const totalSteps = Math.floor(totalItems / visibleItems); // Correctly calculate total steps
    pagination.innerHTML = ''; // Clear existing dots

    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === currentDot) {
            dot.classList.add('active');
        }

        // Add click event listener to jump to the corresponding item set
        dot.addEventListener('click', () => {
            currentDot = i;
            slider.scrollLeft = i * scrollStep; // Scroll to the corresponding set
            updatePagination(totalSteps);
            stopAutoScroll();
            startAutoScroll();
        });

        pagination.appendChild(dot);
    }
}

// Update dot status as user scrolls
function updatePagination(totalSteps) {
    const maxScroll = totalSteps - 1;
    currentDot = Math.min(maxScroll, Math.floor(slider.scrollLeft / scrollStep)); // Update currentDot
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentDot);
    });
}

// Start auto-scroll with fixed intervals
function startAutoScroll() {
    stopAutoScroll(); // Ensure no duplicate intervals
    autoScrollInterval = setInterval(() => {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft >= maxScrollLeft) {
            slider.scrollLeft = 0;  // Reset to start
        } else {
            slider.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
    }, 4000);
}

// Stop auto-scroll
function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Add event listeners for prev/next buttons
prevBtn.addEventListener('click', function () {
    slider.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});

nextBtn.addEventListener('click', function () {
    slider.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

// Listen for scroll events to update pagination
slider.addEventListener('scroll', function () {
    const totalItems = slider.children.length - 2; // Subtract 2 for buttons
    const totalSteps = Math.ceil(totalItems / visibleItems);
    updatePagination(totalSteps);
});

// Handle mouse hover to stop auto-scroll
slider.addEventListener('mouseover', stopAutoScroll);
slider.addEventListener('mouseleave', startAutoScroll);

// Handle keyboard navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
        slider.scrollBy({ left: scrollStep, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
        slider.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    }
});

// Initialize slider settings on load
window.addEventListener('resize', updateVisibleItemsAndScrollStep);
updateVisibleItemsAndScrollStep();
startAutoScroll();
