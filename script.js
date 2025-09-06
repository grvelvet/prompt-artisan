(() => {
    'use strict';

    const config = {
        APP_VERSION: '3.2.0',
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
            rebuildBtn: "Пересобрать промпт", clearBtn: "Очистить форму", qualityToggle: "Добавлять теги качества",
            presetsHeader: "Управление Пресетами", importBtn: "Импорт (.json)", exportBtn: "Экспорт (.json)",
            presetNamePlaceholder: "Имя нового пресета", savePresetBtn: "Сохранить в сессию", presetSelectDefault: "--- Выберите пресет ---",
            presetPreviewPlaceholder: "Выберите пресет для просмотра", deletePresetBtn: "Удалить",
            footerText: "© 2025 Created by grvelvet", closeBtnTitle: "Закрыть", copiedAlert: "Скопировано!",
            alertNoPresets: "Нет пресетов для экспорта.", alertImportError: "Ошибка: не удалось прочитать файл. Убедитесь, что это корректный JSON.",
            rebuildBtnTitle: "Сбросить ручные правки и сгенерировать промпт заново",
            tagBrowserSearchPlaceholder: "Поиск по тегам...",
            addSelectedBtn: "Добавить выбранные"
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
            rebuildBtn: "Rebuild Prompt", clearBtn: "Clear Form", qualityToggle: "Add quality tags",
            presetsHeader: "Preset Management", importBtn: "Import (.json)", exportBtn: "Export (.json)",
            presetNamePlaceholder: "New preset name", savePresetBtn: "Save to Session", presetSelectDefault: "--- Select a preset ---",
            presetPreviewPlaceholder: "Select a preset to preview", deletePresetBtn: "Delete",
            footerText: "© 2025 Created by grvelvet", closeBtnTitle: "Close", copiedAlert: "Copied!",
            alertNoPresets: "No presets to export.", alertImportError: "Error: Could not read the file. Ensure it's a valid JSON.",
            rebuildBtnTitle: "Discard manual edits and regenerate the prompt",
            tagBrowserSearchPlaceholder: "Search tags...",
            addSelectedBtn: "Add Selected"
        }
    };

    const state = {
        isManualEditMode: false,
        isManualLoaded: false,
        savedPresets: {},
        currentLang: 'ru',
        tagBrowserState: {
            isOpen: false,
            targetId: null,
            library: null,
            selectedTags: new Set(),
            currentSubcategoryId: null
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
        qualityToggle: document.getElementById('quality-toggle'),
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
        tagBrowserModal: document.getElementById('tag-browser-modal'),
        closeTagBrowserBtn: document.getElementById('close-tag-browser-btn'),
        tagBrowserTitle: document.getElementById('tag-browser-title'),
        tagBrowserSubcategories: document.getElementById('tag-browser-subcategories'),
        tagBrowserSearch: document.getElementById('tag-browser-search'),
        tagBrowserTagsList: document.getElementById('tag-browser-tags-list'),
        tagBrowserSelectionPreview: document.getElementById('tag-browser-selection-preview'),
        addSelectedTagsBtn: document.getElementById('add-selected-tags-btn')
    };

    const utils = {
        splitTags: (value) => value.split(',').map(s => s.trim()).filter(Boolean),
        getUniqueTags: (tags) => [...new Set(tags)],
        autoResizeTextarea: (element) => {
            if (!element || !element.style) return;
            element.style.height = 'auto';
            element.style.height = `${element.scrollHeight}px`;
        },
        copyText: (element, button) => {
            navigator.clipboard.writeText(element.value).then(() => {
                const originalText = button.textContent;
                button.textContent = i18n[state.currentLang].copiedAlert;
                setTimeout(() => { button.textContent = originalText; }, 1500);
            });
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
            const finalTags = dom.qualityToggle.checked ? [...config.POSITIVE_QUALITY_TAGS, ...userTags] : userTags;
            dom.positiveOutput.value = utils.getUniqueTags(finalTags).join(', ');
            utils.autoResizeTextarea(dom.positiveOutput);
        },

        updateNegativeOutput: () => {
            let userNegativeTags = utils.splitTags(dom.negativeOutput.value);
            userNegativeTags = userNegativeTags.filter(tag => !config.NEGATIVE_QUALITY_TAGS.includes(tag));
            const finalNegativeTags = dom.qualityToggle.checked ? [...config.NEGATIVE_QUALITY_TAGS, ...userNegativeTags] : userNegativeTags;
            dom.negativeOutput.value = utils.getUniqueTags(finalNegativeTags).join(', ');
            utils.autoResizeTextarea(dom.negativeOutput);
        },

        resetToDefaultState: () => {
            handlers.setManualEditMode(false);
            dom.form.reset();
            dom.negativeOutput.value = config.DEFAULT_NEGATIVE_PROMPT;
            dom.qualityToggle.checked = true;
            handlers.generatePositiveOutput();
            handlers.updateNegativeOutput();
            dom.allTextareas.forEach(utils.autoResizeTextarea);
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
            const weightRegex = /^\((.*):(-?[\d.]+)\)$/;
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
            if (!state.savedPresets[name]) return;
            const presetData = state.savedPresets[name];
            dom.savableFields.forEach(el => {
                el.value = presetData[el.id] || (el.id === 'output-negative' ? config.DEFAULT_NEGATIVE_PROMPT : '');
            });
            dom.savableFields.forEach(utils.autoResizeTextarea);
            handlers.setManualEditMode(false);
            handlers.generatePositiveOutput();
            handlers.updateNegativeOutput();
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
            
            if (!presetData) {
                dom.presetPreview.dataset.hidden = 'true';
                const placeholder = dom.presetPreview.querySelector('.placeholder');
                if(placeholder) placeholder.textContent = i18n[state.currentLang].presetPreviewPlaceholder;
                return;
            }

            dom.presetPreview.dataset.hidden = 'false';
            dom.presetPreview.innerHTML = ''; 
            
            const ul = document.createElement('ul');
            for (const [key, value] of Object.entries(presetData)) {
                if (value.trim()) {
                    const i18nKey = document.querySelector(`#${key}`)?.closest('.prompt-card')?.querySelector('[data-i18n]')?.dataset.i18n;
                    const labelEl = document.querySelector(`[data-i18n="${i18nKey}"]`);
                    const label = labelEl ? labelEl.textContent.replace(/🎨|👤|🏞️/g, '').trim() : key;
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
            const dataBlob = new Blob([dataStr], {type: "application/json"});
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
            const manualFile = state.currentLang === 'ru' ? 'manual-content.html' : 'manual-content-en.html';
            try {
                const response = await fetch(manualFile);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const contentHTML = await response.text();
                setTimeout(() => {
                    dom.manualBody.innerHTML = '';
                    const template = document.createElement('template');
                    template.innerHTML = contentHTML;
                    dom.manualBody.appendChild(template.content);
                    state.isManualLoaded = true;
                }, 300);
            } catch (error) {
                console.error("Failed to load manual:", error);
                dom.manualBody.innerHTML = `<p style="color: var(--text-color);">Could not load the manual.</p>`;
                state.isManualLoaded = false;
            }
        },

        hideManual: () => { dom.manualModal.dataset.visible = 'false'; },
        
        setLanguage: (lang) => {
            state.currentLang = lang;
            if (utils.isLocalStorageAvailable()) { localStorage.setItem(config.LANG_KEY, lang); }
            document.documentElement.lang = lang;
            dom.langToggleCheckbox.checked = lang === 'en';
            const translations = i18n[lang];
            
            dom.appTitle.textContent = `${translations.appTitle} v${config.APP_VERSION}`;

            document.querySelectorAll('[data-i18n]').forEach(el => {
                if (el.id !== 'app-title' && translations[el.dataset.i18n]) { el.textContent = translations[el.dataset.i18n]; }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                 if (translations[el.dataset.i18nPlaceholder]) { el.placeholder = translations[el.dataset.i18nPlaceholder]; }
            });
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                 if (translations[el.dataset.i18nTitle]) { el.title = translations[el.dataset.i18nTitle]; }
            });
            document.querySelectorAll('.tooltip-text[data-i18n]').forEach(el => {
                 if (translations[el.dataset.i18n]) { el.textContent = translations[el.dataset.i18n]; }
            });
            
            handlers.populatePresetDropdown();
            state.isManualLoaded = false;
        },

        openTagBrowser: async (targetId, libraryFile) => {
            state.tagBrowserState = {
                isOpen: true,
                targetId: targetId,
                library: null,
                selectedTags: new Set(utils.splitTags(document.getElementById(targetId).value)),
                currentSubcategoryId: null
            };
            dom.tagBrowserSearch.value = '';
            dom.tagBrowserModal.dataset.visible = 'true';
            dom.tagBrowserTagsList.innerHTML = '<div class="spinner"></div>';
            dom.tagBrowserSubcategories.innerHTML = '';
            dom.tagBrowserTitle.textContent = 'Loading...';

            try {
                const response = await fetch(`./data/${libraryFile}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const libraryData = await response.json();
                state.tagBrowserState.library = libraryData;
                handlers.renderTagBrowser();
            } catch (error) {
                console.error('Failed to load tag library:', error);
                dom.tagBrowserTagsList.innerHTML = 'Error loading tags.';
            }
        },

        closeTagBrowser: () => {
            dom.tagBrowserModal.dataset.visible = 'false';
            state.tagBrowserState.isOpen = false;
        },

        renderTagBrowser: () => {
            const { library } = state.tagBrowserState;
            if (!library) return;
            
            const lang = state.currentLang;
            dom.tagBrowserTitle.textContent = library[`name_${lang}`] || library.name_ru;
            dom.tagBrowserSearch.placeholder = i18n[lang].tagBrowserSearchPlaceholder;
            dom.addSelectedTagsBtn.textContent = i18n[lang].addSelectedBtn;
            
            dom.tagBrowserSubcategories.innerHTML = '';
            library.subcategories.forEach(subcat => {
                const btn = document.createElement('button');
                btn.textContent = subcat[`name_${lang}`] || subcat.name_ru;
                btn.dataset.subcatId = subcat.id;
                btn.onclick = () => handlers.handleSubcategoryClick(subcat.id);
                dom.tagBrowserSubcategories.appendChild(btn);
            });
            
            if (library.subcategories.length > 0) {
                handlers.handleSubcategoryClick(library.subcategories[0].id);
            }
            handlers.updateTagBrowserFooter();
        },

        handleSubcategoryClick: (subcatId) => {
            state.tagBrowserState.currentSubcategoryId = subcatId;
            const allBtns = dom.tagBrowserSubcategories.querySelectorAll('button');
            allBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.subcatId === subcatId));
            handlers.renderTagsForSubcategory(dom.tagBrowserSearch.value);
        },

        renderTagsForSubcategory: (searchTerm = '') => {
            const { library, currentSubcategoryId, selectedTags } = state.tagBrowserState;
            const lang = state.currentLang;
            const subcategory = library.subcategories.find(s => s.id === currentSubcategoryId);
            if (!subcategory) return;
            
            dom.tagBrowserTagsList.innerHTML = '';
            const normalizedSearchTerm = searchTerm.toLowerCase();
            const filteredTags = subcategory.tags.filter(tag => 
                (tag[`name_${lang}`] || tag.name_ru).toLowerCase().includes(normalizedSearchTerm) ||
                tag.tag.toLowerCase().includes(normalizedSearchTerm)
            );

            filteredTags.forEach(tag => {
                const item = document.createElement('div');
                item.className = 'tag-item';
                item.textContent = tag[`name_${lang}`] || tag.name_ru;
                item.dataset.tag = tag.tag;
                if (selectedTags.has(tag.tag)) { item.classList.add('selected'); }
                item.onclick = () => handlers.handleTagClick(tag.tag);
                dom.tagBrowserTagsList.appendChild(item);
            });
        },

        handleTagClick: (tag) => {
            const { selectedTags } = state.tagBrowserState;
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
            } else {
                selectedTags.add(tag);
            }
            const item = dom.tagBrowserTagsList.querySelector(`[data-tag="${tag}"]`);
            if (item) { item.classList.toggle('selected'); }
            handlers.updateTagBrowserFooter();
        },
        
        updateTagBrowserFooter: () => {
            const { selectedTags } = state.tagBrowserState;
            dom.addSelectedTagsBtn.disabled = selectedTags.size === 0;
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
            handlers.closeTagBrowser();
        }
    };

    function init() {
        const savedLang = utils.isLocalStorageAvailable() ? localStorage.getItem(config.LANG_KEY) : 'ru';
        handlers.setLanguage(savedLang || 'ru');

        dom.form.addEventListener('input', handlers.generatePositiveOutput);
        dom.form.addEventListener('mousedown', handlers.handleWeightControl);
        dom.qualityToggle.addEventListener('change', () => {
            handlers.generatePositiveOutput();
            handlers.updateNegativeOutput();
        });
        dom.positiveOutput.addEventListener('input', () => {
            handlers.setManualEditMode(true);
            utils.autoResizeTextarea(dom.positiveOutput);
        });
        dom.negativeOutput.addEventListener('input', () => utils.autoResizeTextarea(dom.negativeOutput));
        dom.rebuildBtn.addEventListener('click', () => {
            handlers.setManualEditMode(false);
            handlers.generatePositiveOutput();
        });
        dom.form.addEventListener('reset', (e) => {
            e.preventDefault();
            handlers.resetToDefaultState();
        });
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
        dom.tagBrowserSearch.addEventListener('input', (e) => handlers.renderTagsForSubcategory(e.target.value));
        dom.addSelectedTagsBtn.addEventListener('click', handlers.addSelectedTagsToTextarea);

        dom.manualModal.addEventListener('click', (e) => { if (e.target === dom.manualModal) handlers.hideManual(); });
        dom.tagBrowserModal.addEventListener('click', (e) => { if (e.target === dom.tagBrowserModal) handlers.closeTagBrowser(); });
        
        document.addEventListener('keydown', (e) => { 
            if (e.key === 'Escape') {
                if (dom.manualModal.dataset.visible === 'true') handlers.hideManual();
                if (dom.tagBrowserModal.dataset.visible === 'true') handlers.closeTagBrowser();
            }
        });
        
        dom.allTextareas.forEach(textarea => {
            textarea.addEventListener('input', () => utils.autoResizeTextarea(textarea));
        });

        setTimeout(handlers.resetToDefaultState, 0);
    }

    init();
})();