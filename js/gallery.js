document.addEventListener('DOMContentLoaded', function() {
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация галерей
    initAllGalleries();
});

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-itemlink').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

function initAllGalleries() {
    // Основная галерея
    initGallery({
        gallery: document.querySelector('.instruct-gallery'),
        prevButton: document.querySelector('.gallery-container .nav-button.prev'),
        nextButton: document.querySelector('.gallery-container .nav-button.next'),
        indicatorsContainer: document.getElementById('mainIndicators')
    });

    // Галерея для старой версии
    initGallery({
        gallery: document.querySelector('.instructToOldVersion'),
        prevButton: document.getElementById('oldPrev'),
        nextButton: document.getElementById('oldNext'),
        indicatorsContainer: document.getElementById('oldIndicators'),
        customItems: document.querySelectorAll('.instructToOldVersion > *')
    });
}

function initGallery({gallery, prevButton, nextButton, indicatorsContainer, customItems}) {
    if (!gallery) return;
    
    const items = customItems || gallery.querySelectorAll('.instruct-img');
    if (items.length === 0) return;
    
    // Очистка существующих индикаторов
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
    }
    
    // Создаем индикаторы
    if (indicatorsContainer) {
        items.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'gallery-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => scrollToImage(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    // Центрируем первый элемент при загрузке
    setTimeout(() => scrollToImage(0), 50);
    
    // Навигация по кнопкам
    if (prevButton) prevButton.addEventListener('click', () => navigate(-1));
    if (nextButton) nextButton.addEventListener('click', () => navigate(1));
    
    // Оптимизация: добавляем debounce для scroll и resize
    let scrollTimeout;
    gallery.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateUI, 50);
    }, {passive: true});
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });
    
    // Свайп для мобильных устройств
    setupTouchNavigation();
    
    function updateUI() {
        const {currentIndex} = getCurrentSlide();
        
        // Обновляем кнопки
        if (prevButton && nextButton) {
            prevButton.classList.toggle('hidden', currentIndex <= 0);
            nextButton.classList.toggle('hidden', currentIndex >= items.length - 1);
        }
        
        // Обновляем индикаторы
        if (indicatorsContainer) {
            indicatorsContainer.querySelectorAll('.gallery-indicator').forEach((ind, index) => {
                ind.classList.toggle('active', index === currentIndex);
            });
        }
    }
    
    function navigate(direction) {
        const {currentIndex} = getCurrentSlide();
        const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
        scrollToImage(newIndex);
    }
    
    function scrollToImage(index) {
        const itemWidth = items[0].clientWidth + 20;
        const galleryWidth = gallery.clientWidth;
        const scrollTo = index * itemWidth - (galleryWidth - itemWidth) / 2;
        
        gallery.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        });
    }
    
    function getCurrentSlide() {
        const scrollPosition = gallery.scrollLeft;
        const galleryWidth = gallery.clientWidth;
        const itemWidth = items[0].clientWidth + 20;
        const currentIndex = Math.round((scrollPosition + galleryWidth/2 - itemWidth/2) / itemWidth);
        
        return {
            currentIndex,
            scrollPosition,
            galleryWidth,
            itemWidth
        };
    }
    
    function handleResize() {
        const {currentIndex} = getCurrentSlide();
        scrollToImage(currentIndex);
    }
    
    function setupTouchNavigation() {
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
            
            if (diff > 0) navigate(1); // Свайп влево
            else navigate(-1); // Свайп вправо
        }
    }
}
