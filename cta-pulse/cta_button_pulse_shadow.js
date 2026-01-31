(function () {
    const TARGET_SELECTOR = '#button-cta';
    const ANIMATION_CLASS = 'cta-pulse-shadow';

    function applyCtaPulse() {
        var el = document.querySelector(TARGET_SELECTOR);
        if (el && !el.classList.contains(ANIMATION_CLASS)) {
            el.classList.add(ANIMATION_CLASS);
        }
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
