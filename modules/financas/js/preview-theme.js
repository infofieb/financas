const THEME_STORAGE_KEY = 'keeperhub-preview-theme';
const root = document.documentElement;
const preview = document.querySelector('.app-preview');
const themeButtons = document.querySelectorAll('.preview-theme-button, .finance-theme-button');

function setTheme(theme) {
    const isLight = theme === 'light';

    root.dataset.theme = theme;
    preview?.classList.toggle('preview-light', isLight);
    themeButtons.forEach((button) => {
        button.textContent = isLight ? '☀' : '☾';
        button.setAttribute('aria-pressed', String(isLight));
        button.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
    });
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
setTheme(savedTheme || preferredTheme);

themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
        setTheme(theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    });
});
