// js/state.js
export const state = {
    isManualEditMode: false,
    isManualLoaded: false,
    savedPresets: {},
    currentLang: 'ru',
    history: [],
    historyIndex: -1,
    // --- ДОБАВЛЕНО ЭТО СВОЙСТВО ДЛЯ ИСПРАВЛЕНИЯ ОШИБКИ ---
    generationHistory: [], 
    // ---------------------------------------------------
    isUndoing: false,
    activeModal: null,
    lastFocusedElement: null,
    tagLibraryCache: new Map(),
    tagBrowserState: {
        isOpen: false,
        targetId: null,
        library: null,
        selectedTags: new Set()
    }
};