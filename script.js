document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Path Drawing Logic ---
    const path = document.getElementById('route-path');
    
    // Only execute if the path exists on the page
    if (path) {
        const pathLength = path.getTotalLength();

        // Initialize line as hidden
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;

        // Draw line on scroll
        window.addEventListener('scroll', () => {
            const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const drawLength = pathLength * scrollPercentage;
            path.style.strokeDashoffset = pathLength - drawLength;
        });
    }

    // --- 2. Intersection Observer Logic ---
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // 1. Make text visible
                entry.target.classList.add('visible');
                
                // 2. Highlight Nav
                navLinks.forEach(link => link.classList.remove('active'));
                const activeNav = document.querySelector(`nav a[data-target="${id}"]`);
                if (activeNav) activeNav.classList.add('active');

                // 3. Highlight Map Building & Dot
                document.querySelectorAll('.building, .poi-dot').forEach(el => el.classList.remove('active'));
                const activeBuilding = document.getElementById(`poly-${id}`);
                const activeDot = document.getElementById(`dot-${id}`);
                
                if (activeBuilding) activeBuilding.classList.add('active');
                if (activeDot) activeDot.classList.add('active');
            }
        });
    }, observerOptions);

    // Start observing all sections
    sections.forEach(section => {
        observer.observe(section);
    });
});