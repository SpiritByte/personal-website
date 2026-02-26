document.addEventListener('DOMContentLoaded', () => {
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

    const triggers = document.querySelectorAll('.scroll-trigger');
    const navLinks = document.querySelectorAll('.nav-link');
    const popupTickets = document.querySelectorAll('.popup-ticket');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id'); 
                const mapTarget = entry.target.getAttribute('data-map-target');

                // Update Nav
                navLinks.forEach(link => link.classList.remove('active'));
                const activeNav = document.querySelector(`nav a[data-target="${id}"]`);
                if (activeNav) activeNav.classList.add('active');

                // Highlight Map Building & Dot
                document.querySelectorAll('.building, .poi-dot').forEach(el => el.classList.remove('active'));
                const activeBuilding = document.getElementById(`poly-${mapTarget}`);
                const activeDot = document.getElementById(`dot-${mapTarget}`);
                
                if (activeBuilding) activeBuilding.classList.add('active');
                if (activeDot) activeDot.classList.add('active');

                // Hide all tickets
                popupTickets.forEach(ticket => ticket.classList.remove('active', 'flip-left'));
                
                // Show and Position the Target Ticket
                const activeTicket = document.getElementById(`card-${id}`);
                
                if (activeTicket && activeDot) {
                    // Get exact screen position of the map dot
                    const dotRect = activeDot.getBoundingClientRect();
                    
                    // Default position: 40px to the right of the dot, aligned vertically
                    let leftPos = dotRect.right + 40; 
                    let topPos = dotRect.top - 40; // Shift up slightly so the line aligns nicely
                    
                    // Screen boundaries check: If it overflows the right side, flip it to the left
                    if (leftPos + 320 > window.innerWidth) {
                        leftPos = dotRect.left - 320 - 40; 
                        activeTicket.classList.add('flip-left');
                    }
                    
                    // Apply coordinates and activate
                    activeTicket.style.left = `${leftPos}px`;
                    activeTicket.style.top = `${topPos}px`;
                    activeTicket.classList.add('active');
                }
            }
        });
    }, observerOptions);

    triggers.forEach(trigger => {
        observer.observe(trigger);
    });
});