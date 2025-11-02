// === ОСНОВНОЙ МОДУЛЬ ===
class InstructionsApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupTabs();
    this.setupProgressBar();
    this.setupCopyButtons();
    this.setupLazyLoading();
    this.setupImageZoom();
  }

  // === ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ===
  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Обновляем состояние кнопок
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Обновляем содержимое вкладок
        tabContents.forEach(content => {
          content.classList.remove('active');
          content.hidden = true;
        });

        const activeContent = document.getElementById(targetTab);
        activeContent.classList.add('active');
        activeContent.hidden = false;

        // Прокрутка к началу контента на мобильных устройствах
        if (window.innerWidth < 768) {
          activeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // === ПРОГРЕСС-БАР ===
  setupProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    const updateProgress = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      
      progressBar.style.width = `${scrollPercent}%`;
    };

    // Оптимизация с помощью requestAnimationFrame
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // === КНОПКИ КОПИРОВАНИЯ ===
  setupCopyButtons() {
    document.querySelectorAll('code').forEach(code => {
      code.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          this.showCopyFeedback(code);
        } catch (err) {
          this.fallbackCopy(code);
        }
      });
    });
  }

  showCopyFeedback(element) {
    const originalText = element.textContent;
    element.textContent = 'Скопировано!';
    element.style.background = 'rgba(16, 185, 129, 0.3)';
    
    setTimeout(() => {
      element.textContent = originalText;
      element.style.background = '';
    }, 1500);
  }

  fallbackCopy(element) {
    const textArea = document.createElement('textarea');
    textArea.value = element.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback(element);
    } catch (err) {
      console.warn('Не удалось скопировать текст');
    }
    
    document.body.removeChild(textArea);
  }

  // === ЛЕНИВАЯ ЗАГРУЗКА ===
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // === УВЕЛИЧЕНИЕ ИЗОБРАЖЕНИЙ ===
  setupImageZoom() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');

    // Обработчики для изображений с классом zoomable
    document.querySelectorAll('.instruction-image.zoomable').forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
        captionText.textContent = img.alt || 'Изображение инструкции';
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
      });
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Восстанавливаем прокрутку
    });

    // Закрытие по клику вне изображения
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', () => {
  new InstructionsApp();
});

// === ОБРАБОТЧИК ОШИБОК ===
window.addEventListener('error', (e) => {
  console.error('Произошла ошибка:', e.error);
});