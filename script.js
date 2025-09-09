(() => {
    'use strict';

    const config = {
        APP_VERSION: '0.12.2', // This will be updated by update-version.js
        LANG_KEY: 'promptArtisanLang_v1',
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
            locationHeader: "Локация и Окружение",
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
            resetSelectionBtn: "Сбросить"
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
            resetSelectionBtn: "Reset"
        }
    };

    const DEBOUNCE_DELAY = 300;

    const state = {
        isManualEditMode: false,
        isManualLoaded: false,
        savedPresets: {},
        currentLang: 'ru',
        history: [],
        historyIndex: -1,
        isUndoing: false,
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

    const handlers = {
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
                const prevState = state.history[state.historyIndex];
                handlers.restoreState(prevState);
            }
        },
        redo: () => {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                const nextState = state.history[state.historyIndex];
                handlers.restoreState(nextState);
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
                    const strong = document.createElement('strong');
                    strong.textContent = `${label}: `;
                    li.appendChild(strong);
                    li.append(document.createTextNode(value));
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
            dom.manualModal.dataset.visible = 'true';
            if (state.isManualLoaded) return;
            dom.manualBody.innerHTML = '<div class="spinner"></div>';
            const manualFile = state.currentLang === 'ru' ? 'manual-content.html' : 'manual-content-en.html';
            try {
                const response = await fetch(manualFile);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const contentHTML = await response.text();
                setTimeout(() => {
                    dom.manualBody.innerHTML = contentHTML;
                    state.isManualLoaded = true;
                }, 300);
            } catch (error) {
                console.error("Failed to load manual:", error);
                dom.manualBody.innerHTML = i18n[state.currentLang].alertImportError;
            }
        },
        hideManual: () => { dom.manualModal.dataset.visible = 'false'; },
        setLanguage: (lang) => {
            state.currentLang = lang;
            if (utils.isLocalStorageAvailable()) { localStorage.setItem(config.LANG_KEY, lang); }
            document.documentElement.lang = lang;
            if (dom.langToggleCheckbox) dom.langToggleCheckbox.checked = lang === 'en';
            const translations = i18n[lang];
            if (dom.appTitle) dom.appTitle.textContent = translations.appTitle;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                if (el.id !== 'app-title' && translations[el.dataset.i18n]) { el.textContent = translations[el.dataset.i18n]; }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                if (translations[el.dataset.i18nPlaceholder]) { el.placeholder = translations[el.dataset.i18nPlaceholder]; }
            });
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                if (translations[el.dataset.i18nTitle]) { el.title = translations[el.dataset.i18nTitle]; }
            });
            const footerTextElement = document.querySelector('footer span[data-i18n="footerText"]');
            if (footerTextElement) {
                footerTextElement.textContent = `${translations.footerText} | v${config.APP_VERSION}`;
            }
            handlers.populatePresetDropdown();
            state.isManualLoaded = false;
        },
        openTagBrowser: async (targetId, libraryFile) => {
            if (state.tagBrowserState.targetId !== targetId) {
                state.tagBrowserState.selectedTags.clear();
            }
            state.tagBrowserState.isOpen = true;
            state.tagBrowserState.targetId = targetId;
            dom.tagBrowserSearch.value = '';
            dom.tagBrowserModal.dataset.visible = 'true';
            dom.tagBrowserSubcategories.innerHTML = '<div class="spinner"></div>';
            dom.tagBrowserTitle.textContent = 'Loading...';
            try {
                const response = await fetch(`./data/${libraryFile}`);
                if (!response.ok) throw new Error(`Network response was not ok`);
                const libraryData = await response.json();
                state.tagBrowserState.library = libraryData;
                handlers.renderTagBrowser();
            } catch (error) {
                console.error('Failed to load tag library:', error);
                dom.tagBrowserSubcategories.textContent = 'Error loading tags.';
            }
        },
        closeTagBrowser: () => {
            dom.tagBrowserModal.dataset.visible = 'false';
            state.tagBrowserState.isOpen = false;
        },
        handleResetSelection: () => {
            state.tagBrowserState.selectedTags.clear();
            handlers.filterTagsBySearch();
            handlers.updateTagBrowserFooter();
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
                const summary = document.createElement('summary');
                const categoryName = document.createElement('span');
                categoryName.className = 'category-name';
                const nameText = document.createElement('span');
                nameText.textContent = subcat[`name_${lang}`] || subcat.name_ru;
                const tagCount = document.createElement('span');
                tagCount.className = 'tag-count';
                tagCount.textContent = `(${subcat.tags.length})`;
                categoryName.appendChild(nameText);
                categoryName.appendChild(tagCount);
                summary.appendChild(categoryName);
                const tagListContainer = document.createElement('div');
                tagListContainer.className = 'tag-browser-tags-list-new';
                tagListContainer.dataset.subcatId = subcat.id;
                details.appendChild(summary);
                details.appendChild(tagListContainer);
                accordionContainer.appendChild(details);
                details.addEventListener('toggle', () => {
                    if (details.open && !tagListContainer.hasChildNodes()) {
                        handlers.renderTagsForSubcategory(subcat, tagListContainer);
                    }
                });
            });
            dom.tagBrowserSubcategories.appendChild(accordionContainer);
            handlers.updateTagBrowserFooter();
        },
        renderTagsForSubcategory: (subcategory, container) => {
            const { selectedTags } = state.tagBrowserState;
            const lang = state.currentLang;
            const searchTerm = dom.tagBrowserSearch.value.toLowerCase();
            const filteredTags = subcategory.tags.filter(tag =>
                (tag[`name_${lang}`] || tag.name_ru).toLowerCase().includes(searchTerm) ||
                tag.tag.toLowerCase().includes(searchTerm) ||
                (tag[`desc_${lang}`] || '').toLowerCase().includes(searchTerm)
            );
            const fragment = document.createDocumentFragment();
            filteredTags.forEach(tag => {
                const item = document.createElement('div');
                item.className = 'tag-item-new';
                item.dataset.tag = tag.tag;
                if (subcategory.id.includes('_nsfw')) {
                    item.classList.add('nsfw');
                }
                if (selectedTags.has(tag.tag)) {
                    item.classList.add('selected');
                }
                const tagInfo = document.createElement('div');
                tagInfo.className = 'tag-info';
                const tagName = document.createElement('span');
                tagName.className = 'tag-name';
                tagName.textContent = tag[`name_${lang}`] || tag.name_ru;
                const tagCode = document.createElement('span');
                tagCode.className = 'tag-code';
                tagCode.textContent = tag.tag;
                tagInfo.appendChild(tagName);
                tagInfo.appendChild(tagCode);
                const descKey = `desc_${lang}`;
                if (tag[descKey] && tag[descKey].trim() !== '') {
                    const tagDesc = document.createElement('div');
                    tagDesc.className = 'tag-desc';
                    tagDesc.textContent = tag[descKey];
                    tagInfo.appendChild(tagDesc);
                }
                const quickAddBtn = document.createElement('button');
                quickAddBtn.className = 'quick-add-btn';
                quickAddBtn.innerHTML = '&#43;';
                quickAddBtn.title = `Quick add "${tag.tag}"`;
                item.appendChild(tagInfo);
                item.appendChild(quickAddBtn);
                item.addEventListener('click', () => handlers.handleTagClick(tag.tag, item));
                quickAddBtn.addEventListener('click', (e) => {
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
            handlers.closeTagBrowser();
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
            handlers.closeTagBrowser();
        },
        filterTagsBySearch: () => {
            const openAccordions = document.querySelectorAll('.subcategory-accordion details[open]');
            openAccordions.forEach(details => {
                const container = details.querySelector('.tag-browser-tags-list-new');
                const subcatId = container.dataset.subcatId;
                const subcategory = state.tagBrowserState.library.subcategories.find(s => s.id === subcatId);
                if (subcategory) {
                    handlers.renderTagsForSubcategory(subcategory, container);
                }
            });
        }
    };

    function debounce(fn, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    function init() {
        const criticalElements = ['prompt-form', 'output-positive', 'output-negative'];
        const missingElements = criticalElements.filter(id => !document.getElementById(id));
        if (missingElements.length > 0) {
            console.error('Missing critical elements:', missingElements);
            return;
        }

        const savedLang = utils.isLocalStorageAvailable() ? localStorage.getItem(config.LANG_KEY) : 'ru';
        handlers.setLanguage(savedLang || 'ru');

        dom.form.addEventListener('input', debounce(() => {
            handlers.generatePositiveOutput();
            handlers.captureState();
        }, 500));

        dom.form.addEventListener('mousedown', handlers.handleWeightControl);

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') { e.preventDefault(); handlers.undo(); }
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')) { e.preventDefault(); handlers.redo(); }
            if (e.key === 'Escape') {
                if (dom.manualModal.dataset.visible === 'true') handlers.hideManual();
                if (dom.tagBrowserModal.dataset.visible === 'true') handlers.closeTagBrowser();
            }
        });

        dom.positiveOutput.addEventListener('input', () => {
            handlers.setManualEditMode(true);
            utils.autoResizeTextarea(dom.positiveOutput);
        });
        dom.negativeOutput.addEventListener('input', () => utils.autoResizeTextarea(dom.negativeOutput));
        dom.rebuildBtn.addEventListener('click', () => {
            handlers.setManualEditMode(false);
            handlers.generatePositiveOutput();
            handlers.captureState();
        });
        dom.clearFormBtn.addEventListener('click', handlers.resetToDefaultState);
        dom.langToggleCheckbox.addEventListener('change', () => {
            const newLang = dom.langToggleCheckbox.checked ? 'en' : 'ru';
            handlers.setLanguage(newLang);
        });
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
        dom.showManualBtn.addEventListener('click', handlers.showManual);
        dom.closeManualBtn.addEventListener('click', handlers.hideManual);
        document.querySelectorAll('.tag-browser-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const { targetId, library } = btn.dataset;
                if (targetId && library) { handlers.openTagBrowser(targetId, library); }
            });
        });
        dom.closeTagBrowserBtn.addEventListener('click', handlers.closeTagBrowser);
        dom.resetSelectedTagsBtn.addEventListener('click', handlers.handleResetSelection);
        dom.tagBrowserSearch.addEventListener('input', debounce(handlers.filterTagsBySearch, DEBOUNCE_DELAY));
        dom.addSelectedTagsBtn.addEventListener('click', handlers.addSelectedTagsToTextarea);
        dom.manualModal.addEventListener('click', (e) => { if (e.target === dom.manualModal) handlers.hideManual(); });
        dom.tagBrowserModal.addEventListener('click', (e) => { if (e.target === dom.tagBrowserModal) handlers.closeTagBrowser(); });
        dom.allTextareas.forEach(textarea => {
            textarea.addEventListener('input', () => utils.autoResizeTextarea(textarea));
        });

        handlers.captureState();
        setTimeout(handlers.resetToDefaultState, 0);
    }

    init();
})();