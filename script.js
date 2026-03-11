// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- 0. CUSTOM CURSOR LOGIC ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    document.querySelectorAll('a, button, .magnetic-btn, .tilt-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
            if (el.hasAttribute('data-cursor-text')) {
                follower.textContent = el.getAttribute('data-cursor-text');
            }
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
            follower.textContent = '';
        });
    });

    // --- 1. LENIS SMOOTH SCROLLING ---
    const lenis = new Lenis({
        duration: 1.5, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
        wheelMultiplier: 1.1,
    });

    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // --- 2. 3D MOUSE TILT FOR HERO CARDS ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        tiltCards.forEach(card => {
            gsap.to(card, {
                rotationY: -xAxis,
                rotationX: yAxis,
                ease: "power1.out",
                transformPerspective: 1000,
                transformOrigin: "center"
            });
        });
    });

    // --- 3. MOBILE MENU & NAVBAR ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.replace('ph-list', 'ph-x');
        } else {
            icon.classList.replace('ph-x', 'ph-list');
        }
    });

    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileToggle.querySelector('i').classList.replace('ph-x', 'ph-list');
        });
    });

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 4. EXTREME GSAP CINEMATIC ANIMATIONS ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.set(".hero-headline, .hero-subtext, .hero-buttons, .badge", { opacity: 0, y: 30 });
        gsap.set(".bento-item, .step-card, .startup-card", { opacity: 0 });

        // Hero Section Load Sequence
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl.to(".badge", { opacity: 1, y: 0, duration: 0.8 }, 0.2)
              .to(".hero-headline", { opacity: 1, y: 0, duration: 1 }, 0.4)
              .to(".hero-subtext", { opacity: 1, y: 0, duration: 1 }, 0.6)
              .to(".hero-buttons", { opacity: 1, y: 0, duration: 0.8 }, 0.8)
              .fromTo(".hero-visual", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }, 0.6);

        // --- SPIDERMAN 3D EXTREME PINNING & Z-AXIS PARALLAX ---
        // Instead of scrubbing downwards, we pin the hero and pull the user "through" it.
        const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "+=1500", // Pin for 1500px of scrolling
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });

        masterTl.to(".hero-bg", { scale: 1.5, opacity: 0.2, filter: "blur(10px)", duration: 1 })
                .to(".hero-grid", { scale: 4, opacity: 0, rotationX: 15, duration: 1 }, 0)
                .to(".circle-1", { scale: 5, x: 500, y: -500, duration: 1 }, 0)
                .to(".circle-2", { scale: 3, x: -300, y: 500, duration: 1 }, 0);

        // Global section fade-in-up logic
        const sections = document.querySelectorAll('.section:not(.hero)');
        sections.forEach(section => {
            gsap.fromTo(section, 
                { opacity: 0, y: 100 }, 
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1.5, 
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 90%",
                    }
                }
            );
        });

        // Staggered reveals for Bento Grid (3D Pop)
        gsap.fromTo(".bento-item", 
            { opacity: 0, y: 100, scale: 0.8, rotationX: 30, rotationY: 20 }, 
            { 
                opacity: 1, y: 0, scale: 1, rotationX: 0, rotationY: 0,
                duration: 1.5, 
                stagger: 0.15, 
                ease: "expo.out",
                scrollTrigger: {
                    trigger: ".bento-grid",
                    start: "top 80%",
                }
            }
        );

        // Steps Grid Timeline 
        const stepTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".how-it-works-section",
                start: "top 70%",
            }
        });
        stepTl.fromTo(".step-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" })
              .fromTo(".step-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=1.0");

        // Startups Grid (Skew Pop)
        gsap.fromTo(".startup-card", 
            { opacity: 0, y: 120, rotationY: -15, skewY: 5 }, 
            { 
                opacity: 1, y: 0, rotationY: 0, skewY: 0,
                duration: 1.4, 
                stagger: 0.2, 
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".startup-cards-grid",
                    start: "top 85%",
                }
            }
        );

        // Investor Avatars
        gsap.fromTo(".avatar-wrap", 
            { opacity: 0, scale: 0, x: -30 }, 
            { 
                opacity: 1, scale: 1, x: 0, 
                duration: 1, 
                stagger: 0.15, 
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: ".investor-avatars",
                    start: "top 85%",
                }
            }
        );

        // Background Image Parallax 
        gsap.fromTo(".about-image-wrapper img", 
            { scale: 1.3, y: -40 },
            { 
                scale: 1, y: 40, ease: "none",
                scrollTrigger: {
                    trigger: ".about-split-grid",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            }
        );

        gsap.fromTo(".ks-image-bg img", 
            { y: -80, scale: 1.2 },
            { 
                y: 80, scale: 1, ease: "none",
                scrollTrigger: {
                    trigger: ".ks-banner",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            }
        );
    }

    // --- 5. SMOOTH SCROLL FOR ANCHOR LINKS USING LENIS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#apply' || targetId === '#partner') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, { offset: -80 });
            }
        });
    });
});
