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
        padding: '8px 15px',
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        color: '#c5a059',
        fontSize: '0.85rem',
        borderRadius: '6px',
        pointerEvents: 'none',
        zIndex: '1000001',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        transition: 'opacity 0.2s ease',
        maxWidth: '300px',
        lineHeight: '1.4',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    });
    document.body.appendChild(tooltip);

    let hoverTimer;

    // Delegate hover events to elements with data-zh
    document.addEventListener('mouseover', function(e) {
        const target = e.target.closest('[data-zh]');
        if (target) {
            clearTimeout(hoverTimer);
            hoverTimer = setTimeout(() => {
                const translation = target.getAttribute('data-zh');
                if (translation) {
                    tooltip.innerText = translation;
                    tooltip.style.display = 'block';
                    tooltip.style.opacity = '1';
                    
                    // Position Tooltip
                    const rect = target.getBoundingClientRect();
                    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
                    tooltip.style.top = `${rect.top - 10}px`;
                    tooltip.style.transform = 'translate(-50%, -100%)';
                }
            }, 600); // 600ms delay for "stay a while"
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('[data-zh]')) {
            clearTimeout(hoverTimer);
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.style.opacity === '0') tooltip.style.display = 'none';
            }, 200);
        }
    });

    // Update position on scroll
    window.addEventListener('scroll', () => {
        tooltip.style.display = 'none';
    });
});
