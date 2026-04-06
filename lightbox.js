document.addEventListener('DOMContentLoaded', function() {
    // Create Modal HTML
    const modalHTML = `
    <div id="product-modal" class="modal">
        <span class="close-modal">&times;</span>
        <div class="modal-content">
            <div class="modal-img-container">
                <img id="modal-img" src="" alt="Product Image">
                <div class="zoom-controls">
                    <button id="zoom-out">−</button>
                    <button id="reset-zoom">↺</button>
                    <button id="zoom-in">+</button>
                </div>
            </div>
            <div class="modal-info">
                <h2 id="modal-title"></h2>
                <p id="modal-desc"></p>
                <a href="#contact" class="btn-mail" id="modal-cta">Inquire Now</a>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeBtn = document.querySelector('.close-modal');
    const ctaBtn = document.getElementById('modal-cta');

    let currentScale = 1;

    // Detect Language for CTA
    const lang = document.documentElement.lang;
    if (lang === 'zh-CN') {
        ctaBtn.innerText = '立即咨询';
    } else if (lang === 'es') {
        ctaBtn.innerText = 'Consultar Ahora';
    }

    // Function to open modal
    function openModal(imgSrc, title, desc) {
        modalImg.src = imgSrc;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scroll
        currentScale = 1;
        modalImg.style.transform = `scale(${currentScale})`;
    }

    // Attach event listeners to all possible product elements
    const selectors = '.product-card, .frag-item, .service-item, .cat-card';
    document.addEventListener('click', function(e) {
        const target = e.target.closest(selectors);
        if (target) {
            const img = target.querySelector('img');
            const title = target.querySelector('h3');
            const desc = target.querySelector('p');
            
            if (img && title && desc) {
                openModal(img.src, title.innerText, desc.innerText);
            }
        }
    });

    // Close modal
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Zoom Controls
    document.getElementById('zoom-in').onclick = () => {
        currentScale += 0.2;
        modalImg.style.transform = `scale(${currentScale})`;
    };

    document.getElementById('zoom-out').onclick = () => {
        if (currentScale > 0.4) {
            currentScale -= 0.2;
            modalImg.style.transform = `scale(${currentScale})`;
        }
    };

    document.getElementById('reset-zoom').onclick = () => {
        currentScale = 1;
        modalImg.style.transform = `scale(${currentScale})`;
    };

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
