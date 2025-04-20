document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let currentSlide = 0;
    
    // Показываем первый слайд
    showSlide(currentSlide);
    
    // Обработчики кнопок
    prevBtn.addEventListener('click', () => {
      currentSlide--;
      showSlide(currentSlide);
    });
    
    nextBtn.addEventListener('click', () => {
      currentSlide++;
      showSlide(currentSlide);
    });
    
    function showSlide(index) {
      // Скрываем/показываем кнопки в зависимости от текущего слайда
      if (index <= 0) {
        prevBtn.classList.add('hidden');
      } else {
        prevBtn.classList.remove('hidden');
      }
      
      if (index >= slides.length - 1) {
        nextBtn.classList.add('hidden');
      } else {
        nextBtn.classList.remove('hidden');
      }
      
      // Показываем текущий слайд
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navList.classList.toggle('active');
      
      // Блокировка прокрутки страницы при открытом меню
      if (navList.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav-itemlink');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  });
