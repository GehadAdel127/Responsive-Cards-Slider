const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const pagination = document.querySelector('.pagination');

let autoScrollInterval, visibleItems = 3, scrollStep = 960, currentDot = 0;

function updateVisibleItemsAndScrollStep() {
    const totalItems = slider.children.length - 2;
    const itemWidth = document.querySelector('.item').offsetWidth;
    const gap = parseInt(window.getComputedStyle(slider).gap) || 0;

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
    createPaginationDots(Math.ceil(totalItems / visibleItems));
}

function createPaginationDots(totalSteps) {
    pagination.innerHTML = '';
    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('span');
        dot.className = `dot${i === currentDot ? ' active' : ''}`;
        dot.addEventListener('click', () => {
            currentDot = i;
            slider.scrollLeft = i * scrollStep;
            updatePagination(totalSteps);
            restartAutoScroll();
        });
        pagination.appendChild(dot);
    }
}

function updatePagination(totalSteps) {
    currentDot = Math.min(totalSteps - 1, Math.floor(slider.scrollLeft / scrollStep));
    document.querySelectorAll('.dot').forEach((dot, i) =>
        dot.classList.toggle('active', i === currentDot)
    );
}

function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
        slider.scrollBy({ left: slider.scrollLeft >= slider.scrollWidth - slider.clientWidth ? -slider.scrollLeft : scrollStep, behavior: 'smooth' });
    }, 4000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

function restartAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
}

prevBtn.addEventListener('click', () => slider.scrollBy({ left: -scrollStep, behavior: 'smooth' }));
nextBtn.addEventListener('click', () => slider.scrollBy({ left: scrollStep, behavior: 'smooth' }));
slider.addEventListener('scroll', () => updatePagination(Math.ceil((slider.children.length - 2) / visibleItems)));
slider.addEventListener('mouseover', stopAutoScroll);
slider.addEventListener('mouseleave', startAutoScroll);

document.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowRight' || key === 'ArrowLeft') {
        slider.scrollBy({ left: key === 'ArrowRight' ? scrollStep : -scrollStep, behavior: 'smooth' });
    }
});

window.addEventListener('resize', updateVisibleItemsAndScrollStep);
updateVisibleItemsAndScrollStep();
startAutoScroll();
