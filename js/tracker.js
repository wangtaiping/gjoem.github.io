/**
 * GJOEM Data Center Tracker - OEM factory conversion tracking
 * 追踪询盘、点击、浏览等核心业务数据
 */
(function() {
    var KEY = 'gjoem_dc_';
    var today = new Date().toISOString().split('T')[0];
    var now = Date.now();

    // --- 1. Page Views ---
    var pv = JSON.parse(localStorage.getItem(KEY + 'pv') || '{}');
    pv[today] = (pv[today] || 0) + 1;
    // keep last 90 days
    var days = Object.keys(pv).sort(); if (days.length > 90) { delete pv[days[0]]; }
    localStorage.setItem(KEY + 'pv', JSON.stringify(pv));

    // --- 2. Page-specific views ---
    var page = window.location.pathname.replace(/^\//,'').replace(/\/$/,'') || 'home';
    var ppv = JSON.parse(localStorage.getItem(KEY + 'ppv') || '{}');
    if (!ppv[page]) ppv[page] = {};
    ppv[page][today] = (ppv[page][today] || 0) + 1;
    localStorage.setItem(KEY + 'ppv', JSON.stringify(ppv));

    // --- 3. Session tracking ---
    var sess = JSON.parse(localStorage.getItem(KEY + 'session') || '{}');
    var lastDate = sess.lastDate || '';
    if (lastDate !== today) { sess[today] = (sess[today] || 0) + 1; sess.lastDate = today; }
    localStorage.setItem(KEY + 'session', JSON.stringify(sess));

    // --- 4. Time on page ---
    var entryTime = now;
    window.addEventListener('beforeunload', function() {
        var spent = Math.round((Date.now() - entryTime) / 1000);
        var timeData = JSON.parse(localStorage.getItem(KEY + 'time') || '{}');
        if (!timeData[page]) timeData[page] = { total: 0, count: 0 };
        timeData[page].total += spent;
        timeData[page].count += 1;
        localStorage.setItem(KEY + 'time', JSON.stringify(timeData));
    });

    // --- 5. Scroll depth ---
    var maxScroll = 0;
    window.addEventListener('scroll', function() {
        var pct = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
        if (pct > maxScroll) maxScroll = Math.min(pct, 100);
    });
    window.addEventListener('beforeunload', function() {
        var scr = JSON.parse(localStorage.getItem(KEY + 'scroll') || '{}');
        if (!scr[page]) scr[page] = { total: 0, count: 0 };
        scr[page].total += maxScroll;
        scr[page].count += 1;
        localStorage.setItem(KEY + 'scroll', JSON.stringify(scr));
    });

    // --- 6. Conversion: Email clicks ---
    document.addEventListener('click', function(e) {
        var el = e.target.closest('a[href^="mailto:"]');
        if (el) {
            var conv = JSON.parse(localStorage.getItem(KEY + 'conv') || '{}');
            if (!conv.email) conv.email = {};
            conv.email[today] = (conv.email[today] || 0) + 1;
            localStorage.setItem(KEY + 'conv', JSON.stringify(conv));
        }
    });

    // --- 7. Conversion: WhatsApp clicks ---
    document.addEventListener('click', function(e) {
        var el = e.target.closest('a[href*="wa.me"]');
        if (el) {
            var conv = JSON.parse(localStorage.getItem(KEY + 'conv') || '{}');
            if (!conv.whatsapp) conv.whatsapp = {};
            conv.whatsapp[today] = (conv.whatsapp[today] || 0) + 1;
            localStorage.setItem(KEY + 'conv', JSON.stringify(conv));
        }
    });

    // --- 8. Conversion: Form submissions ---
    document.addEventListener('submit', function(e) {
        var form = e.target.closest('form');
        if (form && form.action && form.action.includes('formspree')) {
            var conv = JSON.parse(localStorage.getItem(KEY + 'conv') || '{}');
            if (!conv.form) conv.form = {};
            conv.form[today] = (conv.form[today] || 0) + 1;
            localStorage.setItem(KEY + 'conv', JSON.stringify(conv));
        }
    });

    // --- 9. Product category interest ---
    if (page === 'skincare' || page === 'bodycare' || page === 'haircare' || page === 'fragrance') {
        var cat = JSON.parse(localStorage.getItem(KEY + 'category') || '{}');
        cat[page] = (cat[page] || 0) + 1;
        localStorage.setItem(KEY + 'category', JSON.stringify(cat));
    }

    // --- 10. Device detection ---
    var ua = navigator.userAgent;
    var device = 'desktop';
    if (/Mobi|Android|iPhone|iPod|BlackBerry|Opera Mini|IEMobile/i.test(ua)) device = 'mobile';
    else if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))) device = 'tablet';
    var devData = JSON.parse(localStorage.getItem(KEY + 'device') || '{}');
    devData[today] = devData[today] || {};
    devData[today][device] = (devData[today][device] || 0) + 1;
    var devKeys = Object.keys(devData).sort(); if (devKeys.length > 90) { delete devData[devKeys[0]]; }
    localStorage.setItem(KEY + 'device', JSON.stringify(devData));

    // --- 11. Country detection via IP geolocation ---
    var geoKey = KEY + 'geo_' + today;
    if (!localStorage.getItem(geoKey)) {
        fetch('https://ipapi.co/json/')
            .then(function(r) { return r.json(); })
            .then(function(d) {
                if (d.country_code) {
                    localStorage.setItem(geoKey, d.country_code);
                    var geo = JSON.parse(localStorage.getItem(KEY + 'geo') || '{}');
                    geo[d.country_code] = (geo[d.country_code] || 0) + 1;
                    localStorage.setItem(KEY + 'geo', JSON.stringify(geo));
                }
            })
            .catch(function() {});
    }

    // --- 12. Traffic source ---
    var ref = document.referrer;
    if (ref && ref !== '') {
        var src = JSON.parse(localStorage.getItem(KEY + 'source') || '{}');
        var domain = 'direct';
        try { domain = new URL(ref).hostname; } catch(e) {}
        if (!src[domain]) src[domain] = {};
        src[domain][today] = (src[domain][today] || 0) + 1;
        localStorage.setItem(KEY + 'source', JSON.stringify(src));
    }
})();
