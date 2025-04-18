document.addEventListener('DOMContentLoaded', function() {
    // Инициализация основной галереи
    initGallery({
        gallery: document.querySelector('.instruct-gallery'),
        prevButton: document.querySelector('.nav-button.prev'),
        nextButton: document.querySelector('.nav-button.next'),
        indicatorsContainer: document.getElementById('mainIndicators')
    });

    // Инициализация галереи для старой версии
    initGallery({
        gallery: document.querySelector('.instructToOldVersion'),
        prevButton: document.getElementById('oldPrev'),
        nextButton: document.getElementById('oldNext'),
        indicatorsContainer: document.getElementById('oldIndicators'),
        customItems: document.querySelectorAll('.instructToOldVersion > *')
    });
});

function initGallery({gallery, prevButton, nextButton, indicatorsContainer, customItems}) {
    if (!gallery) return;
    
    const items = customItems || gallery.querySelectorAll('.instruct-img');
    
    // Создаем индикаторы
    items.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'gallery-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            scrollToImage(index);
        });
        indicatorsContainer.appendChild(indicator);
    });
    
    // Центрируем первый элемент при загрузке
    setTimeout(() => {
        scrollToImage(0);
    }, 50);
    
    // Навигация по кнопкам
    prevButton.addEventListener('click', () => navigate(-1));
    nextButton.addEventListener('click', () => navigate(1));
    
    // Обработчики событий
    gallery.addEventListener('scroll', updateUI);
    
    function updateUI() {
        const scrollPosition = gallery.scrollLeft;
        const galleryWidth = gallery.clientWidth;
        const itemWidth = items[0].clientWidth + 20;
        const currentIndex = Math.round((scrollPosition + galleryWidth/2 - itemWidth/2) / itemWidth);
        
        // Обновляем кнопки
        if (currentIndex <= 0) {
            prevButton.classList.add('hidden');
            nextButton.classList.remove('hidden');
        } else if (currentIndex >= items.length - 1) {
            prevButton.classList.remove('hidden');
            nextButton.classList.add('hidden');
        } else {
            prevButton.classList.remove('hidden');
            nextButton.classList.remove('hidden');
        }
        
        // Обновляем индикаторы
        indicatorsContainer.querySelectorAll('.gallery-indicator').forEach((ind, index) => {
            ind.classList.toggle('active', index === currentIndex);
        });
    }
    
    function navigate(direction) {
        const currentScroll = gallery.scrollLeft;
        const galleryWidth = gallery.clientWidth;
        const itemWidth = items[0].clientWidth + 20;
        const currentIndex = Math.round((currentScroll + galleryWidth/2 - itemWidth/2) / itemWidth);
        const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
        
        scrollToImage(newIndex);
    }
    
    function scrollToImage(index) {
        const galleryWidth = gallery.clientWidth;
        const itemWidth = items[0].clientWidth + 20;
        const scrollTo = index * itemWidth - (galleryWidth - itemWidth) / 2;
        
        gallery.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        });
    }
    
    // Свайп для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallery.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    gallery.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) < 50) return;
        
        if (diff > 0) {
            navigate(1); // Свайп влево - следующий слайд
        } else {
            navigate(-1); // Свайп вправо - предыдущий слайд
        }
    }
    
    // Ресайз окна
    window.addEventListener('resize', () => {
        const currentIndex = Math.round((gallery.scrollLeft + gallery.clientWidth/2 - (items[0].clientWidth + 20)/2) / (items[0].clientWidth + 20));
        scrollToImage(currentIndex);
    });
}