(function () {
    /* Tutti gli elementi con id="button-cta" o class="button-cta" */
    const TARGET_SELECTOR = '#button-cta, .button-cta';
    const ANIMATION_CLASS = 'cta-pulse-shadow';

    function applyCtaPulse() {
        var elements = document.querySelectorAll(TARGET_SELECTOR);
        elements.forEach(function (el) {
            if (el && !el.classList.contains(ANIMATION_CLASS)) {
                el.classList.add(ANIMATION_CLASS);
            }
        });
    }

    function init() {
        applyCtaPulse();
        var body = document.body;
        if (body) {
            var observer = new MutationObserver(applyCtaPulse);
            observer.observe(body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
 
