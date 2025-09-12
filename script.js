document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const googleFormLink = document.getElementById('googleFormLink');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = 'none';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    const animateOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.overview-card, .status-item, .opportunity-card, .benefit-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(el);
    });


    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const mediaSrc = this.getAttribute('data-media');
            const mediaType = this.getAttribute('data-type');
            
            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                cursor: pointer;
                padding: 2rem;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                max-width: 90vw;
                max-height: 90vh;
                position: relative;
            `;
            
            const mediaElement = document.createElement('img');
            mediaElement.src = mediaSrc;
            mediaElement.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: absolute;
                top: -10px;
                right: -10px;
                background: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            content.appendChild(mediaElement);
            content.appendChild(closeBtn);
            overlay.appendChild(content);
            document.body.appendChild(overlay);
            
            const closeOverlay = () => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            };
            
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeOverlay();
            });
            
            closeBtn.addEventListener('click', closeOverlay);
            
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeOverlay();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });

    const heroText = document.querySelector('.hero h1');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    document.querySelectorAll('.status-badge').forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    const counters = document.querySelectorAll('.positions');
    counters.forEach(counter => {
        const updateCounter = () => {
            const target = parseInt(counter.textContent.match(/\d+/)[0]);
            const count = +counter.getAttribute('data-count') || 0;
            const increment = target / 100;
            
            if (count < target) {
                counter.setAttribute('data-count', Math.ceil(count + increment));
                counter.textContent = counter.textContent.replace(/\d+/, Math.ceil(count + increment));
                setTimeout(updateCounter, 20);
            }
        };
        
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });
});

// Auto-focus Gallery functionality
function initGallery() {
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    const featuredMedia = document.getElementById('featured-media');
    const featuredTitle = document.getElementById('featured-title');
    const featuredDescription = document.getElementById('featured-description');
    const featuredCategory = document.getElementById('featured-category');
    const currentIndex = document.getElementById('current-index');
    const totalCount = document.getElementById('total-count');
    const progressFill = document.querySelector('.progress-fill');
    
    if (!thumbnailItems.length || !featuredMedia) return;
    
    let currentMediaIndex = 0;
    let autoRotateInterval;
    let isHovering = false;
    
    // Media data array from thumbnails
    const mediaData = Array.from(thumbnailItems).map(item => ({
        src: item.dataset.media,
        title: item.dataset.title,
        description: item.dataset.description,
        category: item.dataset.category
    }));
    
    // Update featured display
    function updateFeaturedMedia(index) {
        const media = mediaData[index];
        
        // Fade out current image
        featuredMedia.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            featuredMedia.src = media.src;
            featuredTitle.textContent = media.title;
            featuredDescription.textContent = media.description;
            featuredCategory.textContent = media.category.replace('-', ' ');
            featuredCategory.className = `media-category ${media.category}`;
            
            // Update progress and counter
            currentIndex.textContent = index + 1;
            totalCount.textContent = mediaData.length;
            const progressPercent = ((index + 1) / mediaData.length) * 100;
            progressFill.style.width = `${progressPercent}%`;
            
            // Update thumbnail active states
            thumbnailItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
            
            // Fade in new image
            featuredMedia.style.opacity = '1';
        }, 300);
        
        currentMediaIndex = index;
    }
    
    // Auto-rotate function
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        
        autoRotateInterval = setInterval(() => {
            if (!isHovering) {
                const nextIndex = (currentMediaIndex + 1) % mediaData.length;
                updateFeaturedMedia(nextIndex);
            }
        }, 6000); // 6 seconds per item
    }
    
    // Stop auto-rotate
    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }
    
    // Thumbnail click handlers
    thumbnailItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateFeaturedMedia(index);
            stopAutoRotate();
            setTimeout(startAutoRotate, 3000); // Restart after 3 seconds
        });
    });
    
    // Pause auto-rotate on gallery hover
    const gallery = document.querySelector('.auto-focus-gallery');
    if (gallery) {
        gallery.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        gallery.addEventListener('mouseleave', () => {
            isHovering = false;
        });
    }
    
    // Initialize with first media item
    updateFeaturedMedia(0);
    
    // Start auto-rotation after initial load
    setTimeout(startAutoRotate, 2000);
    
    // Pause/resume on page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoRotate();
        } else {
            startAutoRotate();
        }
    });
}

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Initialize gallery after page load
    initGallery();
});