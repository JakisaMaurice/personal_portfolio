(function () {
    const storageKey = 'portfolio-theme';
    const root = document.documentElement;
    const body = document.body;

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        body.setAttribute('data-theme', theme);

        document.querySelectorAll('.theme-toggle').forEach((button) => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        });
    }

    function getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme || getPreferredTheme();
    applyTheme(initialTheme);

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.theme-toggle').forEach((button) => {
            button.addEventListener('click', () => {
                const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(nextTheme);
                localStorage.setItem(storageKey, nextTheme);
            });
        });
    });
})();
