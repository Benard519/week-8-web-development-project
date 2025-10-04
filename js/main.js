/**
 * Main JavaScript File
 * Handles all interactive elements across the website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initScrollAnimations();
    initStats();
    initGalleryFilter();
    initGallerySlider();
    initContactForm();
});

/**
 * Mobile Menu Toggle
 * Handles responsive navigation menu
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Scroll Animations
 * Add fade-in animation to elements as they come into view
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation class
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .gallery-item, .team-member, .process-step');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Animated Statistics Counter
 * Counts up to the target number when visible
 */
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Gallery Filter
 * Filter gallery items by category
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length === 0 || galleryItems.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';

                    // Add fade-in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';

                    setTimeout(() => {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Set initial styles for animation
    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
    });
}

/**
 * Gallery Slider Modal
 * Opens a modal slider when clicking on gallery items
 */
function initGallerySlider() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const sliderModal = document.getElementById('sliderModal');

    if (!sliderModal || galleryItems.length === 0) return;

    const sliderClose = sliderModal.querySelector('.slider-close');
    const sliderPrev = sliderModal.querySelector('.slider-prev');
    const sliderNext = sliderModal.querySelector('.slider-next');
    const currentSlide = sliderModal.querySelector('.current-slide');
    const sliderTitle = sliderModal.querySelector('.slider-title');
    const sliderCategory = sliderModal.querySelector('.slider-category');
    const sliderDescription = sliderModal.querySelector('.slider-description');
    const currentCounter = sliderModal.querySelector('.slider-counter .current');
    const totalCounter = sliderModal.querySelector('.slider-counter .total');

    let currentIndex = 0;
    const visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));

    // Update total counter
    if (totalCounter) {
        totalCounter.textContent = visibleItems.length;
    }

    // Open slider on gallery item click
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentIndex = Array.from(galleryItems).indexOf(item);
            openSlider();
            updateSlider();
        });
    });

    // Close slider
    if (sliderClose) {
        sliderClose.addEventListener('click', closeSlider);
    }

    // Close on background click
    sliderModal.addEventListener('click', function(e) {
        if (e.target === sliderModal) {
            closeSlider();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sliderModal.classList.contains('active')) {
            closeSlider();
        }
    });

    // Previous slide
    if (sliderPrev) {
        sliderPrev.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateSlider();
        });
    }

    // Next slide
    if (sliderNext) {
        sliderNext.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateSlider();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!sliderModal.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateSlider();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateSlider();
        }
    });

    function openSlider() {
        sliderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSlider() {
        sliderModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateSlider() {
        const currentItem = galleryItems[currentIndex];
        const imageContent = currentItem.querySelector('.gallery-image').innerHTML;
        const title = currentItem.querySelector('h3').textContent;
        const category = currentItem.querySelector('.category').textContent;
        const description = currentItem.querySelector('.description').textContent;

        if (currentSlide) currentSlide.innerHTML = imageContent;
        if (sliderTitle) sliderTitle.textContent = title;
        if (sliderCategory) sliderCategory.textContent = category;
        if (sliderDescription) sliderDescription.textContent = description;
        if (currentCounter) currentCounter.textContent = currentIndex + 1;
    }
}

/**
 * Contact Form Validation and Submission
 * Validates form fields and handles form submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const formStatus = document.getElementById('formStatus');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    phoneInput.addEventListener('blur', () => validatePhone());
    subjectInput.addEventListener('blur', () => validateSubject());
    messageInput.addEventListener('blur', () => validateMessage());

    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        // If all validations pass
        if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid) {
            submitForm();
        } else {
            showFormStatus('Please correct the errors before submitting.', 'error');
        }
    });

    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');

        if (name === '') {
            showError(nameInput, errorElement, 'Name is required');
            return false;
        } else if (name.length < 2) {
            showError(nameInput, errorElement, 'Name must be at least 2 characters');
            return false;
        } else {
            hideError(nameInput, errorElement);
            return true;
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            showError(emailInput, errorElement, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        } else {
            hideError(emailInput, errorElement);
            return true;
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const errorElement = document.getElementById('phoneError');

        // Phone is optional, but if provided, should be valid
        if (phone !== '') {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (!phoneRegex.test(phone) || phone.length < 10) {
                showError(phoneInput, errorElement, 'Please enter a valid phone number');
                return false;
            }
        }

        hideError(phoneInput, errorElement);
        return true;
    }

    function validateSubject() {
        const subject = subjectInput.value.trim();
        const errorElement = document.getElementById('subjectError');

        if (subject === '') {
            showError(subjectInput, errorElement, 'Subject is required');
            return false;
        } else if (subject.length < 3) {
            showError(subjectInput, errorElement, 'Subject must be at least 3 characters');
            return false;
        } else {
            hideError(subjectInput, errorElement);
            return true;
        }
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        const errorElement = document.getElementById('messageError');

        if (message === '') {
            showError(messageInput, errorElement, 'Message is required');
            return false;
        } else if (message.length < 10) {
            showError(messageInput, errorElement, 'Message must be at least 10 characters');
            return false;
        } else {
            hideError(messageInput, errorElement);
            return true;
        }
    }

    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    function hideError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status visible ' + type;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.classList.remove('visible');
        }, 5000);
    }

    function submitForm() {
        // In a real application, this would send data to a server
        // For this demo, we'll simulate a successful submission

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Reset form
            contactForm.reset();

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Show success message
            showFormStatus('Thank you for your message! We\'ll get back to you soon.', 'success');

            // Scroll to status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
    }
}

/**
 * Smooth Scroll for Anchor Links
 * Enhances internal navigation
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
