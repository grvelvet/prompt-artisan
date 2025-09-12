// js/utils.js
import { i18n } from './I18n.js';
import { state } from './state.js';

export function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export const utils = {
    splitTags: (value) => value.split(',').map(s => s.trim()).filter(Boolean),
    
    getUniqueTags: (tags) => [...new Set(tags)],
    
    autoResizeTextarea: (element) => {
        if (!element || !element.style || !element.scrollHeight) return;
        requestAnimationFrame(() => {
            element.style.height = 'auto';
            element.style.height = `${element.scrollHeight}px`;
        });
    },

    copyText: async (element, button) => {
        if (!element || !button) return;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(element.value);
            } else {
                element.select();
                document.execCommand('copy');
            }
            const originalText = button.textContent;
            button.textContent = i18n[state.currentLang].copiedAlert;
            button.disabled = true;
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    },

    isLocalStorageAvailable: () => {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) { return false; }
    }
};
