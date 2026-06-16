/**
 * Hover-to-Translate Utility for Huabaotang
 * Detects English text and shows Chinese translation on hover.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create Tooltip Element
    const tooltip = document.createElement('div');
    tooltip.id = 'hover-translator';
    Object.assign(tooltip.style, {
        position: 'fixed',
        display: 'none',
        padding: '10px 18px',
        backgroundColor: 'rgba(18, 18, 18, 0.98)',
        color: '#c5a059',
        fontSize: '0.85rem',
        borderRadius: '8px',
        pointerEvents: 'none',
        zIndex: '2000000',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        transition: 'opacity 0.15s ease, transform 0.15s ease',
        maxWidth: '320px',
        lineHeight: '1.5',
        fontFamily: "'Montserrat', sans-serif",
        border: '1px solid rgba(197, 160, 89, 0.3)'
    });
    document.body.appendChild(tooltip);

    let hoverTimer;

    // Delegate hover events to elements with data-zh
    document.addEventListener('mouseover', function(e) {
        const target = e.target.closest('[data-zh]');
        if (target) {
            const translation = target.getAttribute('data-zh');
            if (!translation) return;

            clearTimeout(hoverTimer);
            hoverTimer = setTimeout(() => {
                // Remove HTML tags if any (like <br>) for cleaner tooltip
                const cleanText = translation.replace(/<br\s*\/?>/gi, ' ');
                tooltip.innerText = cleanText;
                
                tooltip.style.display = 'block';
                tooltip.style.opacity = '1';
                
                // Position Tooltip
                const rect = target.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                let left = rect.left + (rect.width / 2);
                let top = rect.top - 12;

                // Edge cases: prevent overflow
                if (left < 160) left = 160;
                if (left > window.innerWidth - 160) left = window.innerWidth - 160;

                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.transform = 'translate(-50%, -100%)';
            }, 350); // Faster response: 350ms
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('[data-zh]')) {
            clearTimeout(hoverTimer);
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translate(-50%, -90%)'; // Subtle exit animation
            setTimeout(() => {
                if (tooltip.style.opacity === '0') tooltip.style.display = 'none';
            }, 150);
        }
    });

    // Hide on scroll to prevent floating artifacts
    window.addEventListener('scroll', () => {
        clearTimeout(hoverTimer);
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
    });
});
