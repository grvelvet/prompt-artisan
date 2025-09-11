(() => {
    'use strict';

    const config = {
        APP_VERSION: '0.12.2',
        LANG_KEY: 'promptArtisanLang_v1',
        THEME_KEY: 'promptArtisanTheme_v1',
        DATA_PATH: './data/',
        POSITIVE_QUALITY_TAGS: ['masterpiece', 'best quality', 'highres', 'ultra-detailed'],
        NEGATIVE_QUALITY_TAGS: ['worst quality', 'low quality', 'normal quality'],
        DEFAULT_NEGATIVE_PROMPT: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name, bad feet, deformed, disfigured"
    };

    const i18n = {
        ru: {
            appTitle: "Prompt Artisan", helpTitle: "Помощь",
            styleSection: "🎨 Стиль Изображения",
            stylePlaceholder: "Например: photograph, oil painting, anime style...",
            styleTooltip: "Опишите финальный вид работы. Это фотография (photograph), картина маслом (oil painting), аниме (anime style) или что-то еще?",
            subjectSection: "👤 Субъект и Персонаж",
            subjectActionHeader: "Основа и Действие",
            subjectActionPlaceholder: "Например: a knight riding a horse, 2 cats playing...",
            subjectActionTooltip: "Кто или что главное в сцене и что происходит? Например: a wizard casting a spell или a lonely robot sitting on a cliff.",
            appearanceHeader: "Внешность и Детали",
            appearancePlaceholder: "Например: long wavy red hair, intricate tattoos...",
            appearanceTooltip: "Опишите ключевые черты главного субъекта: green eyes, short messy hair, battle scars.",
            clothingHeader: "Одежда и Снаряжение",
            clothingPlaceholder: "Например: wearing heavy armor, elegant silk dress...",
            clothingTooltip: "Во что одет субъект и что держит в руках? Будьте конкретны в материалах и типах.",
            sceneSection: "🏞️ Сцена и Композиция",
            locationHeader: "Локация и окружение",
            locationPlaceholder: "Например: enchanted forest at night, on a spaceship bridge...",
            locationTooltip: "Где происходит действие? Добавьте детали, такие как погода и время суток.",
            lightingHeader: "Освещение и Атмосфера",
            lightingPlaceholder: "Например: cinematic lighting, moody, neon glow...",
            lightingTooltip: "Управляйте настроением с помощью света. Попробуйте: cinematic lighting для драмы, golden hour для тепла или neon glow для киберпанка.",
            cameraHeader: "Камера и Ракурс",
            cameraPlaceholder: "Например: full body shot, from below, close-up...",
            cameraTooltip: "С какой точки мы смотрим на сцену? Используйте: full body shot (в полный рост), close-up (крупный план), from below (вид снизу).",
            finalPromptHeader: "Итоговый промпт и Управление", copyBtn: "Копировать",
            rebuildBtn: "Пересобрать", clearBtn: "Очистить",
            presetsHeader: "Управление Пресетами", importBtn: "Импорт", exportBtn: "Экспорт",
            presetNamePlaceholder: "Имя нового пресета", savePresetBtn: "Сохранить", presetSelectDefault: "--- Выберите пресет ---",
            presetPreviewPlaceholder: "Выберите пресет для просмотра", deletePresetBtn: "Удалить",
            footerText: "© 2025 Created by grvelvet", closeBtnTitle: "Закрыть", copiedAlert: "Скопировано!",
            alertNoPresets: "Нет пресетов для экспорта.", alertImportError: "Ошибка: не удалось прочитать файл. Убедитесь, что это корректный JSON.",
            rebuildBtnTitle: "Сбросить ручные правки и сгенерировать промпт заново",
            tagBrowserSearchPlaceholder: "Поиск...",
            addSelectedBtn: "Добавить",
            resetSelectionBtn: "Сбросить",
            tagBrowserLoading: "Загрузка словаря...",
            tagBrowserError: "Ошибка загрузки словаря. Убедитесь, что файлы находятся в папке /data."
        },
        en: {
            appTitle: "Prompt Artisan", helpTitle: "Help",
            styleSection: "🎨 Image Style",
            stylePlaceholder: "E.g., photograph, oil painting, anime style...",
            styleTooltip: "Describe the final look. Is it a photograph, an oil painting, an anime style, or something else?",
            subjectSection: "👤 Subject & Character",
            subjectActionHeader: "Core & Action",
            subjectActionPlaceholder: "E.g., a knight riding a horse, 2 cats playing...",
            subjectActionTooltip: "Who or what is the main focus, and what is happening? E.g., a wizard casting a spell or a lonely robot sitting on a cliff.",
            appearanceHeader: "Appearance & Details",
            appearancePlaceholder: "E.g., long wavy red hair, intricate tattoos...",
            appearanceTooltip: "Describe the key features of the main subject: green eyes, short messy hair, battle scars.",
            clothingHeader: "Clothing & Gear",
            clothingPlaceholder: "E.g., wearing heavy armor, elegant silk dress...",
            clothingTooltip: "What is the subject wearing and holding? Be specific with materials and types.",
            sceneSection: "🏞️ Scene & Composition",
            locationHeader: "Location & Environment",
            locationPlaceholder: "E.g., enchanted forest at night, on a spaceship bridge...",
            locationTooltip: "Where is the action taking place? Add details like weather and time of day.",
            lightingHeader: "Lighting & Atmosphere",
            lightingPlaceholder: "E.g., cinematic lighting, moody, neon glow...",
            lightingTooltip: "Control the mood with light. Try: cinematic lighting for drama, golden hour for warmth, or neon glow for cyberpunk.",
            cameraHeader: "Camera & Angle",
            cameraPlaceholder: "E.g., full body shot, from below, close-up...",
            cameraTooltip: "From what point of view are we seeing the scene? Use: full body shot, close-up, from below.",
            finalPromptHeader: "Final Prompt & Controls", copyBtn: "Copy",
            rebuildBtn: "Rebuild", clearBtn: "Clear",
            presetsHeader: "Preset Management", importBtn: "Import", exportBtn: "Export",
            presetNamePlaceholder: "New preset name", savePresetBtn: "Save", presetSelectDefault: "--- Select a preset ---",
            presetPreviewPlaceholder: "Select a preset to preview", deletePresetBtn: "Delete",
            footerText: "© 2025 Created by grvelvet", closeBtnTitle: "Close", copiedAlert: "Copied!",
            alertNoPresets: "No presets to export.", alertImportError: "Error: Could not read the file. Ensure it's a valid JSON.",
            rebuildBtnTitle: "Discard manual edits and regenerate the prompt",
            tagBrowserSearchPlaceholder: "Search...",
            addSelectedBtn: "Add",
            resetSelectionBtn: "Reset",
            tagBrowserLoading: "Loading library...",
            tagBrowserError: "Error loading library. Ensure files are in the /data folder."
        }
    };

    const state = {
        isManualEditMode: false,
        isManualLoaded: false,
        savedPresets: {},
        currentLang: 'ru',
        history: [],
        historyIndex: -1,
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

    const dom = {
        form: document.getElementById('prompt-form'),
        allTextareas: document.querySelectorAll('textarea'),
        promptParts: document.querySelectorAll('.prompt-part'),
        savableFields: document.querySelectorAll('.savable-field'),
        positiveOutput: document.getElementById('output-positive'),
        negativeOutput: document.getElementById('output-negative'),
        rebuildBtn: document.getElementById('rebuild-prompt'),
        presetNameInput: document.getElementById('preset-name'),
        presetSelect: document.getElementById('preset-select'),
        savePresetBtn: document.getElementById('save-preset-btn'),
        deletePresetBtn: document.getElementById('delete-preset-btn'),
        presetPreview: document.getElementById('preset-preview'),
        showManualBtn: document.getElementById('show-manual-btn'),
        manualModal: document.getElementById('manual-modal'),
        closeManualBtn: document.getElementById('close-manual-btn'),
        manualBody: document.querySelector('.manual-body'),
        langToggleCheckbox: document.getElementById('lang-toggle-checkbox'),
        themeToggleCheckbox: document.getElementById('theme-toggle-checkbox'),
        importPresetsBtn: document.getElementById('import-presets-btn'),
        exportPresetsBtn: document.getElementById('export-presets-btn'),
        appTitle: document.getElementById('app-title'),
        copyPositiveBtn: document.getElementById('copy-positive'),
        copyNegativeBtn: document.getElementById('copy-negative'),
        clearFormBtn: document.getElementById('clear-form-btn'),
        tagBrowserModal: document.getElementById('tag-browser-modal'),
        closeTagBrowserBtn: document.getElementById('close-tag-browser-btn'),
        tagBrowserTitle: document.getElementById('tag-browser-title'),
        tagBrowserSubcategories: document.getElementById('tag-browser-subcategories'),
        tagBrowserSearch: document.getElementById('tag-browser-search'),
        tagBrowserSelectionPreview: document.getElementById('tag-browser-selection-preview'),
        addSelectedTagsBtn: document.getElementById('add-selected-tags-btn'),
        resetSelectedTagsBtn: document.getElementById('reset-selected-tags-btn')
    };

    function debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    const utils = {
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

    const debouncedAutoResize = debounce(utils.autoResizeTextarea, 150);

    const handlers = {
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
            dom.positiveOutput.value = utils.getUniqueTags(finalTags).join(', ');
            utils.autoResizeTextarea(dom.positiveOutput);
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
            const manualFile = state.currentLang === 'ru' ? 'assets/manual-content.html' : 'assets/manual-content-en.html';
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
                const response = await fetch(`${config.DATA_PATH}${libraryFile}`);
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

    function init() {
        // --- Optimised Event Listeners ---
        const debouncedGenerate = debounce(handlers.generatePositiveOutput, 300);
        const debouncedCaptureState = debounce(handlers.captureState, 1500);

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

    init();
})();