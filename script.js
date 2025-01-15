const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const pagination = document.querySelector('.pagination');

let autoScrollInterval;
let visibleItems = 3;
let scrollStep = 960;
let currentDot = 0;

function updateVisibleItemsAndScrollStep() {
    const totalItems = slider.children.length - 2;
    const itemWidth = document.querySelector('.item').offsetWidth;
    const sliderStyles = window.getComputedStyle(slider);
    const gap = parseInt(sliderStyles.gap) || 0;

    if (window.innerWidth >= 900) {
        visibleItems = 3;
        scrollStep = (itemWidth * 3) + (gap * 2);
    } else if (window.innerWidth >= 600) {
        visibleItems = 2;
        scrollStep = (itemWidth * 2) + (gap * 2) + 15;
    } else {
        visibleItems = 1;
        scrollStep = itemWidth + gap;
    }

    createPaginationDots(totalItems);
}

function createPaginationDots(totalItems) {
    const totalSteps = Math.ceil(totalItems / visibleItems);
    pagination.innerHTML = '';

    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === currentDot) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', () => {
            currentDot = i;
            slider.scrollLeft = i * scrollStep;
            updatePagination(totalSteps);
            stopAutoScroll();
            startAutoScroll();
        });

        pagination.appendChild(dot);
    }
}

function updatePagination(totalSteps) {
    const maxScroll = totalSteps - 1;
    currentDot = Math.min(maxScroll, Math.floor(slider.scrollLeft / scrollStep));
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentDot);
    });
}

function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft >= maxScrollLeft) {
            slider.scrollLeft = 0;
        } else {
            slider.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
    }, 4000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

slider.addEventListener('scroll', () => {
    const totalItems = slider.children.length - 2;
    const totalSteps = Math.ceil(totalItems / visibleItems);
    updatePagination(totalSteps);
});

slider.addEventListener('mouseover', stopAutoScroll);
slider.addEventListener('mouseleave', startAutoScroll);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        slider.scrollBy({ left: scrollStep, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
        slider.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    }
});

window.addEventListener('resize', updateVisibleItemsAndScrollStep);
updateVisibleItemsAndScrollStep();
startAutoScroll();
