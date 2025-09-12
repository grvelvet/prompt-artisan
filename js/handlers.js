// js/handlers.js
import { config } from './config.js';
import { i18n } from './i18n.js';
import { state } from './state.js';
import { dom } from './dom.js';
import { utils } from './utils.js';

export const handlers = {
    openModal: (modalElement) => {
        state.lastFocusedElement = document.activeElement;
        modalElement.setAttribute('aria-hidden', 'false');
        state.activeModal = modalElement;
        const focusTarget = modalElement.querySelector('.modal-close-btn');
        if (focusTarget) {
            setTimeout(() => focusTarget.focus(), 100);
        }
    },
    closeModal: () => {
        if (!state.activeModal) return;
        state.activeModal.setAttribute('aria-hidden', 'true');
        state.activeModal = null;
        if (state.lastFocusedElement) {
            state.lastFocusedElement.focus();
        }
    },
    generatePositiveOutput: () => {
        if (state.isManualEditMode) return;
        let userTags = [];
        dom.promptParts.forEach(el => { userTags = userTags.concat(utils.splitTags(el.value)); });
        const finalTags = [...config.POSITIVE_QUALITY_TAGS, ...userTags];
        const newPrompt = utils.getUniqueTags(finalTags).join(', ');
        
        dom.positiveOutput.value = newPrompt;
        utils.autoResizeTextarea(dom.positiveOutput);

        if (newPrompt.trim() && newPrompt !== state.generationHistory[0]) {
            state.generationHistory.unshift(newPrompt);
            if (state.generationHistory.length > 30) {
                state.generationHistory.pop();
            }
            handlers.renderHistory();
        }
    },
    renderHistory: () => {
        if (state.generationHistory.length === 0) {
            dom.historyList.innerHTML = `<p class="placeholder" data-i18n="historyPlaceholder">Здесь будет история ваших промптов.</p>`;
            return;
        }

        const historyItems = state.generationHistory.map((promptText, index) => {
            const shortText = promptText.length > 70 ? promptText.substring(0, 70) + '...' : promptText;
            return `<div class="history-item" data-index="${index}" title="${promptText}">${shortText}</div>`;
        }).join('');

        dom.historyList.innerHTML = historyItems;
    },
    updateNegativeOutput: () => {
        let userNegativeTags = utils.splitTags(dom.negativeOutput.value);
        userNegativeTags = userNegativeTags.filter(tag => !config.NEGATIVE_QUALITY_TAGS.includes(tag));
        const finalNegativeTags = [...config.NEGATIVE_QUALITY_TAGS, ...userNegativeTags];
        dom.negativeOutput.value = utils.getUniqueTags(finalNegativeTags).join(', ');
        utils.autoResizeTextarea(dom.negativeOutput);
    },
    resetToDefaultState: () => {
        handlers.setManualEditMode(false);
        dom.form.reset();
        dom.negativeOutput.value = config.DEFAULT_NEGATIVE_PROMPT;
        handlers.generatePositiveOutput();
        handlers.updateNegativeOutput();
        dom.allTextareas.forEach(utils.autoResizeTextarea);
        dom.presetSelect.value = '';
        handlers.renderPresetPreview();
        handlers.captureState();
    },
    captureState: () => {
        if (state.isUndoing) return;
        const currentState = {};
        dom.savableFields.forEach(el => {
            currentState[el.id] = el.value;
        });
        if (state.historyIndex < state.history.length - 1) {
            state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(currentState);
        state.historyIndex = state.history.length - 1;
        if (state.history.length > 50) {
            state.history.shift();
            state.historyIndex--;
        }
    },
    restoreState: (historyEntry) => {
        state.isUndoing = true;
        for (const [id, value] of Object.entries(historyEntry)) {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            }
        }
        dom.allTextareas.forEach(utils.autoResizeTextarea);
        handlers.generatePositiveOutput();
        handlers.updateNegativeOutput();
        setTimeout(() => { state.isUndoing = false; }, 0);
    },
    undo: () => {
        if (state.historyIndex > 0) {
            state.historyIndex--;
            handlers.restoreState(state.history[state.historyIndex]);
        }
    },
    redo: () => {
        if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            handlers.restoreState(state.history[state.historyIndex]);
        }
    },
    setManualEditMode: (isManual) => {
        state.isManualEditMode = isManual;
        dom.positiveOutput.classList.toggle('manual-edit', isManual);
    },
    handleWeightControl: (e) => {
        const button = e.target.closest('.weight-btn');
        if (!button) return;
        e.preventDefault();
        const textarea = button.closest('.input-group').querySelector('textarea');
        if (!textarea) return;
        const { selectionStart, selectionEnd } = textarea;
        const action = button.dataset.action;
        let textToModify, startIndex;
        if (selectionStart !== selectionEnd) {
            startIndex = selectionStart;
            textToModify = textarea.value.substring(selectionStart, selectionEnd);
        } else {
            const textBeforeCursor = textarea.value.substring(0, selectionEnd);
            const lastCommaIndex = textBeforeCursor.lastIndexOf(',');
            startIndex = lastCommaIndex === -1 ? 0 : lastCommaIndex + 1;
            textToModify = textarea.value.substring(startIndex, selectionEnd);
        }
        if (!textToModify.trim()) return;
        const weightRegex = /^\s*\((.+?):([\d.]+)\)\s*$/;
        const match = textToModify.trim().match(weightRegex);
        const cleanText = match ? match[1].trim() : textToModify.trim();
        const currentWeight = match ? parseFloat(match[2]) : 1.0;
        let newWeight = parseFloat((action === 'increase' ? currentWeight + 0.1 : currentWeight - 0.1).toFixed(1));
        newWeight = Math.max(0, newWeight);
        const newText = (newWeight === 1.0) ? cleanText : `(${cleanText}:${newWeight})`;
        const replacementStartIndex = textarea.value.indexOf(textToModify, startIndex);
        const replacementEndIndex = replacementStartIndex + textToModify.length;
        textarea.setRangeText(newText, replacementStartIndex, replacementEndIndex, 'select');
        textarea.focus();
        handlers.generatePositiveOutput();
        handlers.captureState();
    },
    handleSavePreset: () => {
        const name = dom.presetNameInput.value.trim();
        if (!name) { alert(i18n[state.currentLang].presetNamePlaceholder); return; }
        const presetData = {};
        dom.savableFields.forEach(el => { presetData[el.id] = el.value; });
        state.savedPresets[name] = presetData;
        handlers.populatePresetDropdown();
        dom.presetSelect.value = name;
        handlers.renderPresetPreview();
        dom.presetNameInput.value = '';
    },
    handleLoadPreset: () => {
        const name = dom.presetSelect.value;
        if (!name || !state.savedPresets[name]) {
            handlers.resetToDefaultState();
            return;
        }
        const presetData = state.savedPresets[name];
        dom.savableFields.forEach(el => {
            el.value = presetData[el.id] || (el.id === 'output-negative' ? config.DEFAULT_NEGATIVE_PROMPT : '');
        });
        dom.allTextareas.forEach(utils.autoResizeTextarea);
        handlers.setManualEditMode(false);
        handlers.generatePositiveOutput();
        handlers.updateNegativeOutput();
        handlers.captureState();
    },
    handleDeletePreset: () => {
        const name = dom.presetSelect.value;
        if (!name || !state.savedPresets[name]) return;
        if (confirm(`Delete preset "${name}" from this session?`)) {
            delete state.savedPresets[name];
            handlers.populatePresetDropdown();
        }
    },
    populatePresetDropdown: () => {
        const defaultOptionText = i18n[state.currentLang].presetSelectDefault;
        dom.presetSelect.innerHTML = `<option value="">${defaultOptionText}</option>`;
        Object.keys(state.savedPresets).sort().forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dom.presetSelect.appendChild(option);
        });
        handlers.renderPresetPreview();
    },
    renderPresetPreview: () => {
        const name = dom.presetSelect.value;
        const presetData = state.savedPresets[name];
        if (!name || !presetData) {
            dom.presetPreview.dataset.hidden = 'true';
            dom.presetPreview.innerHTML = '';
            return;
        }
        dom.presetPreview.dataset.hidden = 'false';
        dom.presetPreview.innerHTML = '';
        const ul = document.createDocumentFragment();
        for (const [key, value] of Object.entries(presetData)) {
            if (value.trim()) {
                const labelEl = document.querySelector(`#${key}`)?.closest('.prompt-card')?.querySelector('[data-i18n]');
                const label = labelEl ? labelEl.textContent.replace(/🎨|👤|🏞️|🔞/g, '').trim() : key;
                const li = document.createElement('li');
                li.innerHTML = `<strong>${label}:</strong> `;
                li.appendChild(document.createTextNode(value));
                ul.appendChild(li);
            }
        }
        dom.presetPreview.appendChild(ul);
    },
    handleExportPresets: () => {
        if (Object.keys(state.savedPresets).length === 0) {
            alert(i18n[state.currentLang].alertNoPresets);
            return;
        }
        const dataStr = JSON.stringify(state.savedPresets, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `prompt-artisan-presets.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    handleImportPresets: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const importedPresets = JSON.parse(event.target.result);
                    if (typeof importedPresets === 'object' && importedPresets !== null) {
                        state.savedPresets = importedPresets;
                        handlers.populatePresetDropdown();
                    } else { throw new Error('Invalid JSON structure'); }
                } catch (error) {
                    alert(i18n[state.currentLang].alertImportError);
                    console.error("Import error:", error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },
    showManual: async () => {
        handlers.openModal(dom.manualModal);
        if (state.isManualLoaded) return;
        dom.manualBody.innerHTML = '<div class="spinner"></div>';
        
        // ИЗМЕНЕНИЕ: Используем абсолютный путь
        const manualFile = state.currentLang === 'ru' ? '/assets/manual-content.html' : '/assets/manual-content-en.html';

        try {
            const response = await fetch(manualFile);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const contentHTML = await response.text();
            dom.manualBody.innerHTML = contentHTML;
            state.isManualLoaded = true;
        } catch (error) {
            console.error("Failed to load manual:", error);
            dom.manualBody.innerHTML = i18n[state.currentLang].alertImportError;
        }
    },
    setLanguage: (lang) => {
        state.currentLang = lang;
        if (utils.isLocalStorageAvailable()) localStorage.setItem(config.LANG_KEY, lang);
        document.documentElement.lang = lang;
        dom.langToggleCheckbox.checked = lang === 'en';
        const translations = i18n[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            if (translations[el.dataset.i18n]) el.textContent = translations[el.dataset.i18n];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            if (translations[el.dataset.i18nPlaceholder]) el.placeholder = translations[el.dataset.i18nPlaceholder];
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            if (translations[el.dataset.i18nTitle]) el.title = translations[el.dataset.i18nTitle];
        });
        const footerTextElement = document.querySelector('footer span[data-i18n="footerText"]');
        if (footerTextElement) footerTextElement.textContent = `${translations.footerText} | v${config.APP_VERSION}`;
        handlers.populatePresetDropdown();
        state.isManualLoaded = false;
    },
    setTheme: (theme) => {
        document.body.dataset.theme = theme;
        if (utils.isLocalStorageAvailable()) localStorage.setItem(config.THEME_KEY, theme);
        dom.themeToggleCheckbox.checked = theme === 'light';
    },
    toggleTheme: () => {
        handlers.setTheme(dom.themeToggleCheckbox.checked ? 'light' : 'dark');
    },
    openTagBrowser: async (targetId, libraryFile) => {
        if (state.tagBrowserState.targetId !== targetId) {
            state.tagBrowserState.selectedTags.clear();
        }
        state.tagBrowserState.isOpen = true;
        state.tagBrowserState.targetId = targetId;
        dom.tagBrowserSearch.value = '';
        handlers.openModal(dom.tagBrowserModal);
        dom.tagBrowserSubcategories.innerHTML = '<div class="spinner"></div>';
        dom.tagBrowserTitle.textContent = i18n[state.currentLang].tagBrowserLoading;

        if (state.tagLibraryCache.has(libraryFile)) {
            state.tagBrowserState.library = state.tagLibraryCache.get(libraryFile);
            handlers.renderTagBrowser();
            return;
        }

        try {
            // ИЗМЕНЕНИЕ: Используем абсолютный путь
            const response = await fetch(`/data/${libraryFile}`);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const libraryData = await response.json();

            state.tagLibraryCache.set(libraryFile, libraryData);
            state.tagBrowserState.library = libraryData;
            handlers.renderTagBrowser();
        } catch (error) {
            console.error('Failed to load tag library:', error);
            dom.tagBrowserSubcategories.innerHTML = `<p style="text-align: center; padding: 20px;">${i18n[state.currentLang].tagBrowserError}</p>`;
        }
    },
    handleResetSelection: () => {
        state.tagBrowserState.selectedTags.clear();
        handlers.updateTagBrowserFooter();
        dom.tagBrowserSubcategories.querySelectorAll('.tag-item-new.selected').forEach(el => {
            el.classList.remove('selected');
        });
    },
    renderTagBrowser: () => {
        const { library } = state.tagBrowserState;
        if (!library) return;
        const lang = state.currentLang;
        dom.tagBrowserTitle.textContent = library[`name_${lang}`] || library.name_ru;
        dom.tagBrowserSearch.placeholder = i18n[lang].tagBrowserSearchPlaceholder;
        dom.tagBrowserSubcategories.innerHTML = '';
        const accordionContainer = document.createElement('div');
        accordionContainer.className = 'subcategory-accordion';
        library.subcategories.forEach(subcat => {
            const details = document.createElement('details');
            details.innerHTML = `
                <summary>
                    <span class="category-name">
                        <span>${subcat[`name_${lang}`] || subcat.name_ru}</span>
                        <span class="tag-count">(${subcat.tags.length})</span>
                    </span>
                </summary>
                <div class="tag-browser-tags-list-new" data-subcat-id="${subcat.id}"></div>
            `;
            accordionContainer.appendChild(details);
            details.addEventListener('toggle', () => {
                const container = details.querySelector('.tag-browser-tags-list-new');
                if (details.open && !container.hasChildNodes()) {
                    handlers.renderTagsForSubcategory(subcat, container);
                }
            });
        });
        dom.tagBrowserSubcategories.appendChild(accordionContainer);
        handlers.updateTagBrowserFooter();
    },
    renderTagsForSubcategory: (subcategory, container) => {
        const { selectedTags } = state.tagBrowserState;
        const lang = state.currentLang;
        const fragment = document.createDocumentFragment();
        subcategory.tags.forEach(tag => {
            const item = document.createElement('div');
            item.className = 'tag-item-new';
            item.dataset.tag = tag.tag;
            if (subcategory.id.includes('_nsfw')) item.classList.add('nsfw');
            if (selectedTags.has(tag.tag)) item.classList.add('selected');

            const searchableContent = [
                tag[`name_${lang}`] || tag.name_ru,
                tag.tag,
                tag[`desc_${lang}`] || ''
            ].join(' ').toLowerCase();
            item.dataset.search = searchableContent;
            
            const descHtml = (tag[`desc_${lang}`] || '').trim() ? `<div class="tag-desc">${tag[`desc_${lang}`]}</div>` : '';
            
            item.innerHTML = `
                <div class="tag-info">
                    <span class="tag-name">${tag[`name_${lang}`] || tag.name_ru}</span>
                    <span class="tag-code">${tag.tag}</span>
                    ${descHtml}
                </div>
                <button type="button" class="quick-add-btn" title="Quick add '${tag.tag}'" aria-label="Quick add '${tag.tag}'">&#43;</button>
            `;

            item.addEventListener('click', () => handlers.handleTagClick(tag.tag, item));
            item.querySelector('.quick-add-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                handlers.handleQuickAdd(tag.tag);
            });
            fragment.appendChild(item);
        });
        container.innerHTML = '';
        container.appendChild(fragment);
    },
    handleTagClick: (tag, itemElement) => {
        const { selectedTags } = state.tagBrowserState;
        if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
        } else {
            selectedTags.add(tag);
        }
        itemElement.classList.toggle('selected');
        handlers.updateTagBrowserFooter();
    },
    handleQuickAdd: (tag) => {
        const { targetId } = state.tagBrowserState;
        const textarea = document.getElementById(targetId);
        if (!textarea) return;
        const existingTags = new Set(utils.splitTags(textarea.value));
        existingTags.add(tag);
        textarea.value = Array.from(existingTags).join(', ');
        utils.autoResizeTextarea(textarea);
        handlers.generatePositiveOutput();
        handlers.captureState();
        handlers.closeModal();
    },
    updateTagBrowserFooter: () => {
        const { selectedTags } = state.tagBrowserState;
        dom.addSelectedTagsBtn.disabled = selectedTags.size === 0;
        dom.addSelectedTagsBtn.textContent = `${i18n[state.currentLang].addSelectedBtn} (${selectedTags.size})`;
        dom.tagBrowserSelectionPreview.textContent = Array.from(selectedTags).join(', ');
    },
    addSelectedTagsToTextarea: () => {
        const { targetId, selectedTags } = state.tagBrowserState;
        const textarea = document.getElementById(targetId);
        if (!textarea) return;
        const existingTags = new Set(utils.splitTags(textarea.value));
        selectedTags.forEach(tag => existingTags.add(tag));
        textarea.value = Array.from(existingTags).join(', ');
        utils.autoResizeTextarea(textarea);
        handlers.generatePositiveOutput();
        handlers.captureState();
        selectedTags.clear();
        handlers.closeModal();
    },
    filterTagsBySearch: () => {
        const searchTerm = dom.tagBrowserSearch.value.toLowerCase();
        dom.tagBrowserSubcategories.querySelectorAll('.tag-item-new').forEach(item => {
            const isVisible = item.dataset.search.includes(searchTerm);
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }
};