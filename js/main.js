// js/main.js
import { dom } from './dom.js';
import { handlers } from './handlers.js';
import { utils, debounce } from './utils.js';
import { config } from './config.js';

function init() {
    // --- Optimised Event Listeners ---
    const debouncedGenerate = debounce(handlers.generatePositiveOutput, 300);
    const debouncedCaptureState = debounce(handlers.captureState, 1500);
    const debouncedAutoResize = debounce(utils.autoResizeTextarea, 150);

    dom.promptParts.forEach(el => {
        el.addEventListener('input', () => {
            debouncedGenerate();
            debouncedCaptureState();
        });
    });
    
    dom.negativeOutput.addEventListener('input', debouncedCaptureState);

    dom.allTextareas.forEach(textarea => {
        textarea.addEventListener('input', () => debouncedAutoResize(textarea));
    });

    // --- Standard Event Listeners ---
    dom.form.addEventListener('mousedown', handlers.handleWeightControl);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') handlers.closeModal();
        if (e.ctrlKey && e.key === 'z') { e.preventDefault(); handlers.undo(); }
        if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) { e.preventDefault(); handlers.redo(); }
    });

    dom.positiveOutput.addEventListener('input', () => handlers.setManualEditMode(true));

    dom.rebuildBtn.addEventListener('click', () => {
        handlers.setManualEditMode(false);
        handlers.generatePositiveOutput();
        handlers.captureState();
    });
    dom.clearFormBtn.addEventListener('click', handlers.resetToDefaultState);
    dom.themeToggleCheckbox.addEventListener('change', handlers.toggleTheme);
    dom.langToggleCheckbox.addEventListener('change', () => handlers.setLanguage(dom.langToggleCheckbox.checked ? 'en' : 'ru'));
    
    dom.importPresetsBtn.addEventListener('click', handlers.handleImportPresets);
    dom.exportPresetsBtn.addEventListener('click', handlers.handleExportPresets);
    dom.copyPositiveBtn.addEventListener('click', (e) => utils.copyText(dom.positiveOutput, e.target));
    dom.copyNegativeBtn.addEventListener('click', (e) => utils.copyText(dom.negativeOutput, e.target));
    
    dom.savePresetBtn.addEventListener('click', handlers.handleSavePreset);
    dom.presetSelect.addEventListener('change', () => {
        handlers.handleLoadPreset();
        handlers.renderPresetPreview();
    });
    dom.deletePresetBtn.addEventListener('click', handlers.handleDeletePreset);

    // Modals
    dom.showManualBtn.addEventListener('click', handlers.showManual);
    dom.closeManualBtn.addEventListener('click', handlers.closeModal);
    dom.manualModal.addEventListener('click', (e) => { if (e.target === dom.manualModal) handlers.closeModal(); });

    document.querySelectorAll('.tag-browser-btn').forEach(btn => {
        btn.addEventListener('click', () => handlers.openTagBrowser(btn.dataset.targetId, btn.dataset.library));
    });
    dom.closeTagBrowserBtn.addEventListener('click', handlers.closeModal);
    dom.tagBrowserModal.addEventListener('click', (e) => { if (e.target === dom.tagBrowserModal) handlers.closeModal(); });
    
    dom.resetSelectedTagsBtn.addEventListener('click', handlers.handleResetSelection);
    dom.tagBrowserSearch.addEventListener('input', debounce(handlers.filterTagsBySearch, 200));
    dom.addSelectedTagsBtn.addEventListener('click', handlers.addSelectedTagsToTextarea);

    // --- Initial State ---
    const savedLang = utils.isLocalStorageAvailable() ? localStorage.getItem(config.LANG_KEY) : 'ru';
    handlers.setLanguage(savedLang || 'ru');
    const savedTheme = utils.isLocalStorageAvailable() ? localStorage.getItem(config.THEME_KEY) : null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    handlers.setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));
    
    handlers.captureState();
    setTimeout(handlers.resetToDefaultState, 0);
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', init);