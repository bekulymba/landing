// Testimonial Slider Functionality
class TestimonialSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.testimonial-slide');
    this.images = document.querySelectorAll('.testimonial-image');
    this.dots = document.querySelectorAll('.pagination-dots .dot');
    this.container = document.querySelector('.testimonial-container');
    
    this.autoplayInterval = null;
    this.autoplayDelay = 3000; // 3 секунды
    this.isPaused = false;
    this.isTransitioning = false;
    
    this.init();
  }

  init() {
    // Добавляем обработчики событий для точек навигации
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Добавляем обработчики для паузы автоплея
    this.addInteractionListeners();

    // Добавляем поддержку клавиатуры
    this.addKeyboardSupport();

    // Добавляем поддержку свайпов на мобильных
    this.addTouchSupport();

    // Запускаем автоплей
    this.startAutoplay();

    console.log('Testimonial slider initialized');
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;
    
    this.isTransitioning = true;
    
    // Убираем активные классы
    this.slides[this.currentSlide].classList.remove('active');
    this.images[this.currentSlide].classList.remove('active');
    this.dots[this.currentSlide].classList.remove('active');
    
    // Добавляем класс направления для анимации
    const direction = index > this.currentSlide ? 'next' : 'prev';
    this.slides[this.currentSlide].classList.add(direction === 'next' ? 'prev' : 'next');
    this.images[this.currentSlide].classList.add(direction === 'next' ? 'prev' : 'next');
    
    // Обновляем текущий слайд
    this.currentSlide = index;
    
    // Активируем новый слайд
    this.slides[this.currentSlide].classList.add('active');
    this.images[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');
    
    // Убираем классы направления после анимации
    setTimeout(() => {
      this.slides.forEach(slide => {
        slide.classList.remove('prev', 'next');
      });
      this.images.forEach(image => {
        image.classList.remove('prev', 'next');
      });
      this.isTransitioning = false;
    }, 600);
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    if (this.autoplayInterval) return;
    
    this.autoplayInterval = setInterval(() => {
      if (!this.isPaused && !this.isTransitioning) {
        this.nextSlide();
      }
    }, this.autoplayDelay);
  }

  pauseAutoplay() {
    this.isPaused = true;
    this.container.classList.add('paused');
  }

  resumeAutoplay() {
    this.isPaused = false;
    this.container.classList.remove('paused');
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  addInteractionListeners() {
    // Пауза при наведении мыши
    this.container.addEventListener('mouseenter', () => {
      this.pauseAutoplay();
    });

    this.container.addEventListener('mouseleave', () => {
      this.resumeAutoplay();
    });

    // Пауза при фокусе на элементах
    this.dots.forEach(dot => {
      dot.addEventListener('focus', () => this.pauseAutoplay());
      dot.addEventListener('blur', () => this.resumeAutoplay());
    });

    // Пауза когда вкладка неактивна
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.resumeAutoplay();
      }
    });
  }

  addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      // Проверяем, что слайдер в фокусе
      if (!this.container.matches(':hover') && !this.container.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.pauseAutoplay();
          this.prevSlide();
          setTimeout(() => this.resumeAutoplay(), 1000);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.pauseAutoplay();
          this.nextSlide();
          setTimeout(() => this.resumeAutoplay(), 1000);
          break;
        case ' ':
          e.preventDefault();
          if (this.isPaused) {
            this.resumeAutoplay();
          } else {
            this.pauseAutoplay();
          }
          break;
      }
    });
  }

  addTouchSupport() {
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping = true;
      this.pauseAutoplay();
    });

    this.container.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      
      // Если горизонтальный свайп больше вертикального
      if (diffX > diffY && diffX > 50) {
        e.preventDefault();
      }
    });

    this.container.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      
      isSwiping = false;
      setTimeout(() => this.resumeAutoplay(), 1000);
    });
  }

  // Метод для программного управления (может пригодиться)
  destroy() {
    this.stopAutoplay();
    this.container.classList.remove('paused');
  }
}

// Инициализация слайдера после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, что элементы слайдера существуют
  const testimonialContainer = document.querySelector('.testimonial-container');
  if (testimonialContainer) {
    window.testimonialSlider = new TestimonialSlider();
  }
});

// Добавляем глобальную поддержку для остановки слайдера при закрытии страницы
window.addEventListener('beforeunload', () => {
  if (window.testimonialSlider) {
    window.testimonialSlider.destroy();
  }
});