(() => {
    'use strict';

    // --- КОНФИГУРАЦИЯ И СЛОВАРИ ---
    const config = {
        APP_VERSION: '2.9.8-UI-Refined',
        LANG_KEY: 'promptArtisanLang_v1',
        POSITIVE_QUALITY_TAGS: ['masterpiece', 'best quality', 'highres', 'ultra-detailed'],
        NEGATIVE_QUALITY_TAGS: ['worst quality', 'low quality', 'normal quality'],
        DEFAULT_NEGATIVE_PROMPT: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name, bad feet, deformed, disfigured"
    };

    const i18n = {
        ru: {
            appTitle: "Prompt Artisan", helpTitle: "Помощь", subjectHeader: "Субъект и действие", appearanceHeader: "Внешность",
            appearancePlaceholder: "девушка, long hair, blue eyes...", clothingHeader: "Одежда и аксессуары", clothingPlaceholder: "elegant dress, red shoes...",
            poseHeader: "Поза и действие", posePlaceholder: "standing, looking at viewer...", compositionHeader: "Композиция, сцена, стиль",
            locationHeader: "Окружение (Локация)", locationPlaceholder: "in a forest, city background...", lightingHeader: "Освещение и атмосфера",
            lightingPlaceholder: "cinematic lighting, dark background...", cameraHeader: "Камера и композиция", cameraPlaceholder: "medium shot, bokeh, blurry background...",
            styleHeader: "Стиль и качество арта", stylePlaceholder: "photorealistic, masterpiece, detailed bg...", advancedHeader: "Продвинутые настройки",
            loraHeader: "LoRA / Trigger Words", loraPlaceholder: "<lora:имя:сила> или триггерные слова", finalPromptHeader: "Итоговый промпт",
            copyBtn: "Копировать", formManagementHeader: "Управление формой", rebuildBtn: "Пересобрать промпт", clearBtn: "Очистить форму",
            qualityToggle: "Добавлять теги качества", presetsHeader: "Управление Пресетами", importBtn: "Импорт (.json)", exportBtn: "Экспорт (.json)",
            presetNamePlaceholder: "Имя нового пресета", savePresetBtn: "Сохранить в сессию", presetSelectDefault: "--- Выберите пресет ---",
            presetPreviewPlaceholder: "Импортируйте файл или сохраните пресет", deletePresetBtn: "Удалить",
            footerText: "© 2025 Created by grvelvet", closeBtnTitle: "Закрыть", copiedAlert: "Скопировано!",
            alertNoPresets: "Нет пресетов для экспорта.", alertImportError: "Ошибка: не удалось прочитать файл. Убедитесь, что это корректный JSON.",
            rebuildBtnTitle: "Сбросить ручные правки и сгенерировать промпт заново"
        },
        en: {
            appTitle: "Prompt Artisan", helpTitle: "Help", subjectHeader: "Subject & Action", appearanceHeader: "Appearance",
            appearancePlaceholder: "1girl, long hair, blue eyes...", clothingHeader: "Clothing & Accessories", clothingPlaceholder: "elegant dress, red shoes...",
            poseHeader: "Pose & Action", posePlaceholder: "standing, looking at viewer...", compositionHeader: "Composition, Scene, Style",
            locationHeader: "Environment (Location)", locationPlaceholder: "in a forest, city background...", lightingHeader: "Lighting & Atmosphere",
            lightingPlaceholder: "cinematic lighting, dark background...", cameraHeader: "Camera & Composition", cameraPlaceholder: "medium shot, bokeh, blurry background...",
            styleHeader: "Art Style & Quality", stylePlaceholder: "photorealistic, masterpiece, detailed bg...", advancedHeader: "Advanced Settings",
            loraHeader: "LoRA / Trigger Words", loraPlaceholder: "<lora:name:strength> or trigger words", finalPromptHeader: "Final Prompt",
            copyBtn: "Copy", formManagementHeader: "Form Management", rebuildBtn: "Rebuild Prompt", clearBtn: "Clear Form",
            qualityToggle: "Add quality tags", presetsHeader: "Preset Management", importBtn: "Import (.json)", exportBtn: "Export (.json)",
            presetNamePlaceholder: "New preset name", savePresetBtn: "Save to Session", presetSelectDefault: "--- Select a preset ---",
            presetPreviewPlaceholder: "Import a file or save a preset to the session", deletePresetBtn: "Delete",
            footerText: "© 2025 Created by grvelvet", closeBtnTitle: "Close", copiedAlert: "Copied!",
            alertNoPresets: "No presets to export.", alertImportError: "Error: Could not read the file. Ensure it's a valid JSON.",
            rebuildBtnTitle: "Discard manual edits and regenerate the prompt"
        }
    };

    const state = {
        isManualEditMode: false,
        isManualLoaded: false,
        savedPresets: {},
        currentLang: 'ru'
    };

    const dom = {
        form: document.getElementById('prompt-form'),
        allTextareas: document.querySelectorAll('textarea'),
        promptParts: document.querySelectorAll('.prompt-part'),
        savableFields: document.querySelectorAll('.savable-field'),
        positiveOutput: document.getElementById('output-positive'),
        negativeOutput: document.getElementById('output-negative'),
        loraInput: document.getElementById('loras'),
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
        copyNegativeBtn: document.getElementById('copy-negative')
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
            dom.promptParts.forEach(el => {
                userTags = userTags.concat(utils.splitTags(el.value));
            });
            const finalTags = dom.qualityToggle.checked ? [...config.POSITIVE_QUALITY_TAGS, ...userTags] : userTags;
            const promptCore = utils.getUniqueTags(finalTags).join(', ');
            const loraString = dom.loraInput.value.trim();
            dom.positiveOutput.value = (loraString ? `${loraString} ` : '') + promptCore;
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
            dom.promptParts.forEach(el => el.value = '');
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
            if (!state.savedPresets[name]) return;
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
            dom.presetPreview.innerHTML = '';

            if (!presetData) {
                const placeholder = document.createElement('span');
                placeholder.className = 'placeholder';
                placeholder.textContent = i18n[state.currentLang].presetPreviewPlaceholder;
                dom.presetPreview.appendChild(placeholder);
                return;
            }

            const ul = document.createElement('ul');
            for (const [key, value] of Object.entries(presetData)) {
                if (value.trim()) {
                    const h3 = document.querySelector(`h3[data-i18n="${key}Header"]`);
                    const label = h3 ? h3.textContent : key;
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
                        } else {
                            throw new Error('Invalid JSON structure');
                        }
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
                dom.manualBody.innerHTML = '';
                const errorP = document.createElement('p');
                errorP.style.color = 'var(--text-color)';
                errorP.textContent = 'Could not load the manual.';
                dom.manualBody.appendChild(errorP);
                state.isManualLoaded = false;
            }
        },

        hideManual: () => {
            dom.manualModal.dataset.visible = 'false';
        },
        
        setLanguage: (lang) => {
            state.currentLang = lang;
            if (utils.isLocalStorageAvailable()) {
                localStorage.setItem(config.LANG_KEY, lang);
            }
            document.documentElement.lang = lang;
            dom.langToggleCheckbox.checked = lang === 'en';
            const translations = i18n[lang];
            
            dom.appTitle.textContent = `${translations.appTitle} v${config.APP_VERSION}`;

            document.querySelectorAll('[data-i18n]').forEach(el => {
                if (el.id !== 'app-title') {
                     el.textContent = translations[el.dataset.i18n];
                }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                el.placeholder = translations[el.dataset.i18nPlaceholder];
            });
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                el.title = translations[el.dataset.i18nTitle];
            });
            
            handlers.populatePresetDropdown();
            state.isManualLoaded = false;
        }
    };

    function init() {
        const savedLang = utils.isLocalStorageAvailable() ? localStorage.getItem(config.LANG_KEY) : 'ru';
        handlers.setLanguage(savedLang || 'ru');

        // ОБРАБОТЧИКИ СОБЫТИЙ
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
        dom.manualModal.addEventListener('click', (e) => { if (e.target === dom.manualModal) handlers.hideManual(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dom.manualModal.dataset.visible === 'true') handlers.hideManual(); });
        
        dom.allTextareas.forEach(textarea => {
            textarea.addEventListener('input', () => utils.autoResizeTextarea(textarea));
        });

        setTimeout(handlers.resetToDefaultState, 0);
    }

    init();
})();