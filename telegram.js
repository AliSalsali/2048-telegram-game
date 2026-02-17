// Telegram Mini-App Integration

document.addEventListener('DOMContentLoaded', () => {
    // Check if running in Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;

        // Initialize Telegram Web App
        tg.ready();

        // Expand to full viewport height
        tg.expand();

        // Apply Telegram theme colors
        applyTelegramTheme(tg.themeParams);

        // Listen for theme changes
        tg.onEvent('themeChanged', () => {
            applyTelegramTheme(tg.themeParams);
        });

        // Enable closing confirmation (optional)
        tg.enableClosingConfirmation();

        // Set header color
        if (tg.themeParams.bg_color) {
            tg.setHeaderColor(tg.themeParams.bg_color);
        }

        // Set background color
        if (tg.themeParams.bg_color) {
            tg.setBackgroundColor(tg.themeParams.bg_color);
        }

        console.log('Telegram Web App initialized', tg.initData);
    } else {
        console.log('Running outside Telegram environment');
    }
});

// Apply Telegram theme parameters to CSS variables
function applyTelegramTheme(themeParams) {
    if (!themeParams) return;

    const root = document.documentElement;

    // Background color
    if (themeParams.bg_color) {
        root.style.setProperty('--tg-bg-color', themeParams.bg_color);
        document.body.style.background = themeParams.bg_color;
    }

    // Text color
    if (themeParams.text_color) {
        root.style.setProperty('--tg-text-color', themeParams.text_color);
    }

    // Button color
    if (themeParams.button_color) {
        root.style.setProperty('--tg-button-color', themeParams.button_color);
    }

    // Hint/secondary color
    if (themeParams.hint_color) {
        root.style.setProperty('--tg-hint-color', themeParams.hint_color);
    }

    // Adjust grid colors based on theme (darker in dark mode)
    if (isDarkTheme(themeParams)) {
        // Dark mode adjustments
        root.style.setProperty('--grid-bg', '#4a4a4a');
        root.style.setProperty('--cell-bg', '#5a5a5a');
    } else {
        // Light mode (default)
        root.style.setProperty('--grid-bg', '#bbada0');
        root.style.setProperty('--cell-bg', '#cdc1b4');
    }

    console.log('Theme applied:', themeParams);
}

// Detect if theme is dark
function isDarkTheme(themeParams) {
    if (!themeParams.bg_color) return false;

    // Convert hex to RGB and calculate luminance
    const hex = themeParams.bg_color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance (ITU-R BT.709)
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    return luminance < 0.5;
}

// Get Telegram user data (if available)
function getTelegramUser() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        return window.Telegram.WebApp.initDataUnsafe.user;
    }
    return null;
}

// Send data back to Telegram bot (if needed for leaderboards, etc.)
function sendDataToBot(data) {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify(data));
    }
}
