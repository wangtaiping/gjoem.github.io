document.addEventListener('DOMContentLoaded', function() {
    const styles = `
    .modal {
        display: none; position: fixed; z-index: 999999; left: 0; top: 0;
        width: 100%; height: 100%; background-color: rgba(0,0,0,0.9);
        backdrop-filter: blur(5px); align-items: center; justify-content: center; overflow-y: auto; padding: 20px;
    }
    .modal-content {
        position: relative; background-color: #fff; width: 100%; max-width: 1000px;
        display: flex; flex-direction: column; border-radius: 12px; overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    @media (min-width: 768px) { .modal-content { flex-direction: row; height: 600px; } }
    .modal-img-container {
        flex: 1.5; background: #f5f5f5; position: relative; overflow: hidden;
        display: flex; align-items: center; justify-content: center;
    }
    .modal-img-container img { max-width: 90%; max-height: 90%; transition: transform 0.3s ease; cursor: grab; }
    .modal-info {
        flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;
    }
    .modal-info h2 { font-family: 'Playfair Display', serif; color: #c5a059; margin-bottom: 20px; }
    .modal-info p { font-size: 1rem; color: #444; line-height: 1.6; margin-bottom: 30px; }
    .close-modal {
        position: absolute; top: 20px; right: 30px; color: #fff; font-size: 40px;
        font-weight: bold; cursor: pointer; z-index: 1000000;
    }
    .zoom-controls {
        position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
        display: flex; gap: 10px; background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 30px;
    }
    .zoom-controls button { background: transparent; border: none; color: white; font-size: 20px; padding: 5px 10px; cursor: pointer; }
    .btn-modal-cta {
        display: inline-block; padding: 14px 36px; background: #c5a059; color: #000;
        text-decoration: none; text-transform: uppercase; font-size: 0.85rem; font-weight: 700;
        text-align: center; border-radius: 6px; cursor: pointer; border: none; letter-spacing: 1px;
        font-family: 'Montserrat', sans-serif; transition: 0.3s;
    }
    .btn-modal-cta:hover { background: #d4b168; }

    /* Contact Dialog */
    #contact-dialog {
        display: none; position: fixed; z-index: 9999999; left: 0; top: 0;
        width: 100%; height: 100%; background-color: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
        align-items: center; justify-content: center;
    }
    .contact-card {
        background: #fff; border-radius: 16px; padding: 40px; max-width: 480px; width: 90%;
        text-align: center; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.4);
    }
    .contact-card h3 {
        font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #c5a059; margin-bottom: 8px;
    }
    .contact-card .contact-person { font-size: 0.9rem; color: #333; margin-bottom: 5px; }
    .contact-card .contact-phone { font-size: 0.85rem; color: #666; margin-bottom: 25px; }
    .contact-card .contact-phone a { color: #c5a059; text-decoration: none; font-weight: 600; }
    .qr-row { display: flex; justify-content: center; gap: 40px; margin-bottom: 25px; flex-wrap: wrap; }
    .qr-item { text-align: center; }
    .qr-item img { width: 130px; height: 130px; border-radius: 8px; border: 2px solid #eee; }
    .qr-item p { font-size: 0.75rem; color: #888; margin-top: 8px; font-weight: 600; }
    .contact-card .close-dialog {
        position: absolute; top: 15px; right: 20px; font-size: 28px; cursor: pointer; color: #999;
    }
    .contact-card .close-dialog:hover { color: #333; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Product Modal
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
                <button class="btn-modal-cta" id="modal-cta">Inquire Now</button>
            </div>
        </div>
    </div>`;

    // Contact Dialog
    var contactHTML = '';
    var lang = document.documentElement.lang || 'en';
    if (lang === 'zh-CN' || lang === 'zh') {
        contactHTML = '<div id="contact-dialog"><div class="contact-card"><span class="close-dialog" onclick="document.getElementById(\'contact-dialog\').style.display=\'none\'">&times;</span><h3>联系我们</h3><p class="contact-person">联系人：sige</p><p class="contact-phone">电话：<a href="tel:15622220825">15622220825</a></p><div class="qr-row"><div class="qr-item"><img src="/images/wechat-qr.jpg" alt="微信二维码"><p>微信：tp58886</p></div><div class="qr-item"><img src="/images/whatsapp-qr.jpg" alt="WhatsApp"><p>WhatsApp</p></div></div></div></div>';
    } else if (lang === 'es') {
        contactHTML = '<div id="contact-dialog"><div class="contact-card"><span class="close-dialog" onclick="document.getElementById(\'contact-dialog\').style.display=\'none\'">&times;</span><h3>Contáctenos</h3><p class="contact-person">Contacto: sige</p><p class="contact-phone">Tel: <a href="tel:15622220825">15622220825</a></p><div class="qr-row"><div class="qr-item"><img src="/images/wechat-qr.jpg" alt="WeChat QR"><p>WeChat: tp58886</p></div><div class="qr-item"><img src="/images/whatsapp-qr.jpg" alt="WhatsApp QR"><p>WhatsApp</p></div></div></div></div>';
    } else {
        contactHTML = '<div id="contact-dialog"><div class="contact-card"><span class="close-dialog" onclick="document.getElementById(\'contact-dialog\').style.display=\'none\'">&times;</span><h3>Contact Us</h3><p class="contact-person">Contact: sige</p><p class="contact-phone">Phone: <a href="tel:15622220825">15622220825</a></p><div class="qr-row"><div class="qr-item"><img src="/images/wechat-qr.jpg" alt="WeChat QR"><p>WeChat: tp58886</p></div><div class="qr-item"><img src="/images/whatsapp-qr.jpg" alt="WhatsApp QR"><p>WhatsApp</p></div></div></div></div>';
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', contactHTML);

    var modal = document.getElementById('product-modal');
    var modalImg = document.getElementById('modal-img');
    var modalTitle = document.getElementById('modal-title');
    var modalDesc = document.getElementById('modal-desc');
    var closeBtn = document.querySelector('.close-modal');
    var ctaBtn = document.getElementById('modal-cta');
    var contactDlg = document.getElementById('contact-dialog');
    var currentScale = 1;

    // Language-based CTA text
    if (lang === 'zh-CN' || lang === 'zh') { ctaBtn.innerText = '立即咨询'; }
    else if (lang === 'es') { ctaBtn.innerText = 'Consultar Ahora'; }
    else { ctaBtn.innerText = 'Inquire Now'; }

    // CTA: show contact dialog
    ctaBtn.onclick = function(e) {
        e.preventDefault();
        contactDlg.style.display = 'flex';
    };

    // Close contact dialog by clicking outside
    contactDlg.onclick = function(e) {
        if (e.target === contactDlg) { contactDlg.style.display = 'none'; }
    };

    function openModal(imgSrc, title, desc) {
        modalImg.src = imgSrc;
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        currentScale = 1;
        modalImg.style.transform = 'scale(' + currentScale + ')';
    }

    var selectors = '.product-card, .frag-item, .service-item, .cat-card';
    document.addEventListener('click', function(e) {
        var target = e.target.closest(selectors);
        if (target) {
            e.preventDefault();
            var img = target.querySelector('img');
            var title = target.querySelector('h3');
            var desc = target.querySelector('p');
            if (img && title && desc) {
                openModal(img.src, title.innerText, desc.innerText);
            }
        }
    });

    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    document.getElementById('zoom-in').onclick = function(e) {
        e.stopPropagation();
        currentScale += 0.2;
        modalImg.style.transform = 'scale(' + currentScale + ')';
    };
    document.getElementById('zoom-out').onclick = function(e) {
        e.stopPropagation();
        if (currentScale > 0.4) { currentScale -= 0.2; modalImg.style.transform = 'scale(' + currentScale + ')'; }
    };
    document.getElementById('reset-zoom').onclick = function(e) {
        e.stopPropagation();
        currentScale = 1; modalImg.style.transform = 'scale(1)';
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (contactDlg.style.display === 'flex') { contactDlg.style.display = 'none'; }
            else if (modal.style.display === 'flex') { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
        }
    });
});
