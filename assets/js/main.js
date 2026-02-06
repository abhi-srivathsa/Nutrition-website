/* ==========================================================================
   Dr. Usha Harish - Diet & Obesity Clinic
   Main JavaScript - Carousel, Navigation, Scroll Animations
   ========================================================================== */

(function () {
	'use strict';

	/* ---------- Carousel System ---------- */
	function initCarousel(carouselEl) {
		var track = carouselEl.querySelector('.carousel-track, .testimonials-track');
		if (!track) return;

		var slides = track.children;
		var totalSlides = slides.length;
		if (totalSlides === 0) return;

		var currentIndex = 0;
		var autoplayInterval = null;
		var isTransitioning = false;

		// Find buttons within or adjacent to carousel
		var container = carouselEl;
		var prevBtn = container.querySelector('.carousel-btn-prev');
		var nextBtn = container.querySelector('.carousel-btn-next');

		// Dots container
		var dotsContainer = container.querySelector('.carousel-dots');
		if (dotsContainer) {
			dotsContainer.innerHTML = '';
			// Only show dots if reasonable number of slides
			if (totalSlides <= 20) {
				for (var i = 0; i < totalSlides; i++) {
					var dot = document.createElement('button');
					dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
					dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
					dot.dataset.index = i;
					dotsContainer.appendChild(dot);
				}
			}
		}

		function goToSlide(index) {
			if (isTransitioning) return;
			if (index < 0) index = totalSlides - 1;
			if (index >= totalSlides) index = 0;

			isTransitioning = true;
			currentIndex = index;
			track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

			// Update dots
			if (dotsContainer) {
				var dots = dotsContainer.querySelectorAll('.carousel-dot');
				for (var j = 0; j < dots.length; j++) {
					dots[j].classList.toggle('active', j === currentIndex);
				}
			}

			setTimeout(function () {
				isTransitioning = false;
			}, 500);
		}

		function nextSlide() {
			goToSlide(currentIndex + 1);
		}

		function prevSlide() {
			goToSlide(currentIndex - 1);
		}

		function startAutoplay() {
			stopAutoplay();
			autoplayInterval = setInterval(nextSlide, 5000);
		}

		function stopAutoplay() {
			if (autoplayInterval) {
				clearInterval(autoplayInterval);
				autoplayInterval = null;
			}
		}

		// Button events
		if (prevBtn) {
			prevBtn.addEventListener('click', function () {
				prevSlide();
				startAutoplay(); // Reset autoplay timer
			});
		}
		if (nextBtn) {
			nextBtn.addEventListener('click', function () {
				nextSlide();
				startAutoplay();
			});
		}

		// Dot click events
		if (dotsContainer) {
			dotsContainer.addEventListener('click', function (e) {
				var dot = e.target.closest('.carousel-dot');
				if (dot && dot.dataset.index !== undefined) {
					goToSlide(parseInt(dot.dataset.index, 10));
					startAutoplay();
				}
			});
		}

		// Touch/swipe support
		var touchStartX = 0;
		var touchEndX = 0;

		track.addEventListener('touchstart', function (e) {
			touchStartX = e.changedTouches[0].screenX;
			stopAutoplay();
		}, { passive: true });

		track.addEventListener('touchend', function (e) {
			touchEndX = e.changedTouches[0].screenX;
			var diff = touchStartX - touchEndX;
			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					nextSlide();
				} else {
					prevSlide();
				}
			}
			startAutoplay();
		}, { passive: true });

		// Pause on hover
		container.addEventListener('mouseenter', stopAutoplay);
		container.addEventListener('mouseleave', startAutoplay);

		// Keyboard navigation when focused
		container.setAttribute('tabindex', '0');
		container.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') {
				prevSlide();
				startAutoplay();
			} else if (e.key === 'ArrowRight') {
				nextSlide();
				startAutoplay();
			}
		});

		// Start autoplay
		startAutoplay();
	}

	/* ---------- Navigation ---------- */
	function initNavigation() {
		var nav = document.getElementById('nav');
		var toggle = document.getElementById('navToggle');
		var links = document.getElementById('navLinks');

		if (!nav) return;

		// Scroll effect - add 'scrolled' class when scrolling down
		function handleScroll() {
			if (window.scrollY > 50) {
				nav.classList.add('scrolled');
			} else {
				nav.classList.remove('scrolled');
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); // Run on init

		// Mobile toggle
		if (toggle && links) {
			toggle.addEventListener('click', function () {
				toggle.classList.toggle('active');
				links.classList.toggle('active');
			});

			// Close menu on link click
			var navLinks = links.querySelectorAll('a');
			for (var i = 0; i < navLinks.length; i++) {
				navLinks[i].addEventListener('click', function () {
					toggle.classList.remove('active');
					links.classList.remove('active');
				});
			}

			// Close menu on outside click
			document.addEventListener('click', function (e) {
				if (!nav.contains(e.target)) {
					toggle.classList.remove('active');
					links.classList.remove('active');
				}
			});
		}
	}

	/* ---------- Smooth Scroll ---------- */
	function initSmoothScroll() {
		var anchors = document.querySelectorAll('a[href^="#"]');
		for (var i = 0; i < anchors.length; i++) {
			anchors[i].addEventListener('click', function (e) {
				var href = this.getAttribute('href');
				if (href === '#') return;

				var target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					var navHeight = document.getElementById('nav')
						? document.getElementById('nav').offsetHeight
						: 0;
					var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

					window.scrollTo({
						top: targetPosition,
						behavior: 'smooth'
					});
				}
			});
		}
	}

	/* ---------- Scroll Animations ---------- */
	function initScrollAnimations() {
		var elements = document.querySelectorAll(
			'.service-card, .media-highlight-item, .stat-block, .about-grid, .testimonial-full-card, .video-section, .carousel-section, .contact-grid'
		);

		if (!elements.length) return;

		// Add fade-in class
		for (var i = 0; i < elements.length; i++) {
			elements[i].classList.add('fade-in');
		}

		if ('IntersectionObserver' in window) {
			var observer = new IntersectionObserver(function (entries) {
				for (var j = 0; j < entries.length; j++) {
					if (entries[j].isIntersecting) {
						entries[j].target.classList.add('visible');
						observer.unobserve(entries[j].target);
					}
				}
			}, {
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px'
			});

			for (var k = 0; k < elements.length; k++) {
				observer.observe(elements[k]);
			}
		} else {
			// Fallback: show all immediately
			for (var m = 0; m < elements.length; m++) {
				elements[m].classList.add('visible');
			}
		}
	}

	/* ---------- Initialize Everything ---------- */
	function init() {
		initNavigation();
		initSmoothScroll();
		initScrollAnimations();

		// Init all carousels
		var carousels = document.querySelectorAll('.carousel, .testimonials-carousel');
		for (var i = 0; i < carousels.length; i++) {
			initCarousel(carousels[i]);
		}
	}

	// Run when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();
