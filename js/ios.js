document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('navList');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Закрытие меню при клике на пункт (для мобильных)
    const navLinks = document.querySelectorAll('.nav-itemlink');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    });
    // Копирование текста (исправленная версия)
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const configBox = btn.closest('.config-box');
                const link = configBox.querySelector('.config-link')?.textContent?.trim();
                
                if (!link) throw new Error('Текст для копирования не найден');
                
                await navigator.clipboard.writeText(link);
                
                btn.classList.add('copied');
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Ошибка при копировании:', err);
                btn.classList.add('error');
                btn.querySelector('.copy-text::after').content = 'Ошибка';
                
                setTimeout(() => {
                    btn.classList.remove('error');
                    btn.querySelector('.copy-text::after').content = 'Копировать';
                }, 2000);
            }
        });
    });

    // Модалка с изображением
    const modalElements = () => {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modalImage = document.createElement('img');
        modalImage.className = 'modal-image';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Закрыть');

        modalOverlay.append(modalImage, closeBtn);
        document.body.appendChild(modalOverlay);

        return { modalOverlay, modalImage, closeBtn };
    };

    const { modalOverlay, modalImage, closeBtn } = modalElements();

    const handleImageClick = img => {
        modalImage.src = img.src;
        modalImage.alt = img.alt || 'Увеличенное изображение';
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => modalImage.classList.add('modal-visible'), 10);
    };

    const closeModal = () => {
        modalImage.classList.remove('modal-visible');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            modalImage.removeAttribute('src');
        }, 300);
    };

    document.querySelectorAll('.gallery-img-item').forEach(img => {
        img.addEventListener('click', () => handleImageClick(img));
    });

    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay || e.target === closeBtn) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') closeModal();
    });
});
