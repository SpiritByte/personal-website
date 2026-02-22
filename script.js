document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Path Drawing Logic ---
    const path = document.getElementById('route-path');
    
    if (path) {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;

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
        threshold: 0.5 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Get the target map element (allows CMH to trigger twice)
                const mapTarget = entry.target.getAttribute('data-map-target');
                
                entry.target.classList.add('visible');
                
                navLinks.forEach(link => link.classList.remove('active'));
                const activeNav = document.querySelector(`nav a[data-target="${id}"]`);
                if (activeNav) activeNav.classList.add('active');

                // Highlight Map Building & Dot using the mapTarget
                document.querySelectorAll('.building, .poi-dot').forEach(el => el.classList.remove('active'));
                const activeBuilding = document.getElementById(`poly-${mapTarget}`);
                const activeDot = document.getElementById(`dot-${mapTarget}`);
                
                if (activeBuilding) activeBuilding.classList.add('active');
                if (activeDot) activeDot.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});