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

		var container = carouselEl;
		var prevBtn = container.querySelector('.carousel-btn-prev');
		var nextBtn = container.querySelector('.carousel-btn-next');

		// Dots container
		var dotsContainer = container.querySelector('.carousel-dots');
		if (dotsContainer) {
			dotsContainer.innerHTML = '';
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

		// Get the actual pixel width of one slide (= the visible container width)
		function getSlideWidth() {
			return container.offsetWidth;
		}

		function goToSlide(index) {
			if (isTransitioning) return;
			if (index < 0) index = totalSlides - 1;
			if (index >= totalSlides) index = 0;

			isTransitioning = true;
			currentIndex = index;

			var offset = currentIndex * getSlideWidth();
			track.style.transform = 'translateX(-' + offset + 'px)';

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

		// Recalculate position on window resize (orientation change, etc.)
		var resizeTimer;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				// Temporarily disable transition for instant repositioning
				track.style.transition = 'none';
				var offset = currentIndex * getSlideWidth();
				track.style.transform = 'translateX(-' + offset + 'px)';
				// Re-enable transition on next frame
				requestAnimationFrame(function () {
					requestAnimationFrame(function () {
						track.style.transition = '';
					});
				});
			}, 100);
		});

		// Button events
		if (prevBtn) {
			prevBtn.addEventListener('click', function () {
				prevSlide();
				startAutoplay();
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
		var touchStartY = 0;
		var isSwiping = false;

		track.addEventListener('touchstart', function (e) {
			touchStartX = e.changedTouches[0].clientX;
			touchStartY = e.changedTouches[0].clientY;
			isSwiping = false;
			stopAutoplay();
		}, { passive: true });

		track.addEventListener('touchmove', function (e) {
			if (!isSwiping) {
				var dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
				var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
				// Only treat as swipe if horizontal movement > vertical
				if (dx > dy && dx > 10) {
					isSwiping = true;
				}
			}
		}, { passive: true });

		track.addEventListener('touchend', function (e) {
			var touchEndX = e.changedTouches[0].clientX;
			var diff = touchStartX - touchEndX;
			if (isSwiping && Math.abs(diff) > 40) {
				if (diff > 0) {
					nextSlide();
				} else {
					prevSlide();
				}
			}
			startAutoplay();
		}, { passive: true });

		// Pause on hover (desktop only)
		container.addEventListener('mouseenter', stopAutoplay);
		container.addEventListener('mouseleave', startAutoplay);

		// Keyboard navigation when focused
		container.setAttribute('tabindex', '0');
		container.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				prevSlide();
				startAutoplay();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
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

		function handleScroll() {
			if (window.scrollY > 50) {
				nav.classList.add('scrolled');
			} else {
				nav.classList.remove('scrolled');
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		if (toggle && links) {
			toggle.addEventListener('click', function () {
				toggle.classList.toggle('active');
				links.classList.toggle('active');
			});

			var navLinks = links.querySelectorAll('a');
			for (var i = 0; i < navLinks.length; i++) {
				navLinks[i].addEventListener('click', function () {
					toggle.classList.remove('active');
					links.classList.remove('active');
				});
			}

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
			for (var m = 0; m < elements.length; m++) {
				elements[m].classList.add('visible');
			}
		}
	}

	/* ---------- Dynamic Footer Year ---------- */
	function initFooterYear() {
		var footers = document.querySelectorAll('.footer-copy');
		var year = new Date().getFullYear();
		for (var i = 0; i < footers.length; i++) {
			footers[i].innerHTML = footers[i].innerHTML.replace(/\d{4}/, year);
		}
	}

	/* ---------- Initialize Everything ---------- */
	function init() {
		initNavigation();
		initSmoothScroll();
		initScrollAnimations();
		initFooterYear();

		var carousels = document.querySelectorAll('.carousel, .testimonials-carousel');
		for (var i = 0; i < carousels.length; i++) {
			initCarousel(carousels[i]);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();
