(function () {
    const TARGET_SELECTOR = '#button-cta';
    const ANIMATION_CLASS = 'cta-pulse-shadow';

    function applyCtaPulse() {
        const el = document.querySelector(TARGET_SELECTOR);
        if (el && !el.classList.contains(ANIMATION_CLASS)) {
            el.classList.add(ANIMATION_CLASS);
        }
    }

    applyCtaPulse();
    document.addEventListener('DOMContentLoaded', applyCtaPulse);

    var observer = new MutationObserver(function () {
        applyCtaPulse();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
