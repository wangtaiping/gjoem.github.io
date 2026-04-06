document.addEventListener('DOMContentLoaded', function() {
    // Inject Styles directly to ensure they load
    const styles = `
    .modal {
        display: none;
        position: fixed;
        z-index: 999999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.9);
        backdrop-filter: blur(5px);
        align-items: center;
        justify-content: center;
        overflow-y: auto;
        padding: 20px;
    }
    .modal-content {
        position: relative;
        background-color: #fff;
        width: 100%;
        max-width: 1000px;
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    @media (min-width: 768px) {
        .modal-content { flex-direction: row; height: 600px; }
    }
    .modal-img-container {
        flex: 1.5;
        background: #f5f5f5;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal-img-container img {
        max-width: 90%;
        max-height: 90%;
        transition: transform 0.3s ease;
        cursor: grab;
    }
    .modal-info {
        flex: 1;
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .modal-info h2 {
        font-family: 'Playfair Display', serif;
        color: #c5a059;
        margin-bottom: 20px;
    }
    .modal-info p {
        font-size: 1rem;
        color: #444;
        line-height: 1.6;
        margin-bottom: 30px;
    }
    .close-modal {
        position: absolute;
        top: 20px;
        right: 30px;
        color: #fff;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000000;
    }
    .zoom-controls {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        background: rgba(0,0,0,0.5);
        padding: 5px 15px;
        border-radius: 30px;
    }
    .zoom-controls button {
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        padding: 5px 10px;
        cursor: pointer;
    }
    .btn-modal-cta {
        display: inline-block;
        padding: 12px 30px;
        background: #c5a059;
        color: white;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: 600;
        text-align: center;
        border-radius: 4px;
    }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Modal HTML
    const modalHTML = `
    <div id="product-modal" class="modal" style="display:none;">
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
                <a href="#contact" class="btn-modal-cta" id="modal-cta">Inquire Now</a>
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
    if (lang === 'zh-CN' || lang === 'zh') {
        ctaBtn.innerText = '立即咨询';
    } else if (lang === 'es') {
        ctaBtn.innerText = 'Consultar Ahora';
    }

    // Function to open modal
    function openModal(imgSrc, title, desc) {
        modalImg.src = imgSrc;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
        currentScale = 1;
        modalImg.style.transform = `scale(${currentScale})`;
    }

    // Attach event listeners
    const selectors = '.product-card, .frag-item, .service-item, .cat-card';
    document.addEventListener('click', function(e) {
        const target = e.target.closest(selectors);
        if (target) {
            e.preventDefault();
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
    document.getElementById('zoom-in').onclick = (e) => {
        e.stopPropagation();
        currentScale += 0.2;
        modalImg.style.transform = `scale(${currentScale})`;
    };

    document.getElementById('zoom-out').onclick = (e) => {
        e.stopPropagation();
        if (currentScale > 0.4) {
            currentScale -= 0.2;
            modalImg.style.transform = `scale(${currentScale})`;
        }
    };

    document.getElementById('reset-zoom').onclick = (e) => {
        e.stopPropagation();
        currentScale = 1;
        modalImg.style.transform = `scale(${currentScale})`;
    };

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});
