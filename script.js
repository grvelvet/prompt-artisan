document.addEventListener('DOMContentLoaded', () => {

    // --- КОНСТАНТЫ И СЛОВАРИ ---
    const LANG_KEY = 'promptArtisanLang_v1';
    const APP_VERSION = '2.9.6';
    const POSITIVE_QUALITY_TAGS = ['masterpiece', 'best quality', 'highres', 'ultra-detailed'];
    const NEGATIVE_QUALITY_TAGS = ['worst quality', 'low quality', 'normal quality'];
    const DEFAULT_NEGATIVE_PROMPT = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name, bad feet, deformed, disfigured";

    const i18n = {
        ru: {
            appTitle: "Prompt Artisan",
            helpTitle: "Помощь",
            subjectHeader: "Субъект и действие",
            appearanceHeader: "Внешность",
            appearancePlaceholder: "девушка, long hair, blue eyes...",
            clothingHeader: "Одежда и аксессуары",
            clothingPlaceholder: "elegant dress, red shoes...",
            poseHeader: "Поза и действие",
            posePlaceholder: "standing, looking at viewer...",
            compositionHeader: "Композиция, сцена, стиль",
            locationHeader: "Окружение (Локация)",
            locationPlaceholder: "in a forest, city background...",
            lightingHeader: "Освещение и атмосфера",
            lightingPlaceholder: "cinematic lighting, dark background...",
            cameraHeader: "Камера и композиция",
            cameraPlaceholder: "medium shot, bokeh, blurry background...",
            styleHeader: "Стиль и качество арта",
            stylePlaceholder: "photorealistic, masterpiece, detailed bg...",
            advancedHeader: "Продвинутые настройки",
            loraHeader: "LoRA / Trigger Words",
            loraPlaceholder: "<lora:имя:сила> или триггерные слова",
            finalPromptHeader: "Итоговый промпт",
            copyBtn: "Копировать",
            formManagementHeader: "Управление формой",
            rebuildBtn: "Пересобрать промпт",
            clearBtn: "Очистить форму",
            qualityToggle: "Добавлять теги качества",
            presetsHeader: "Управление Пресетами",
            importBtn: "Импорт (.json)",
            exportBtn: "Экспорт (.json)",
            presetNamePlaceholder: "Имя нового пресета",
            savePresetBtn: "Сохранить в сессию",
            presetSelectDefault: "--- Выберите пресет ---",
            presetPreviewPlaceholder: "Импортируйте файл или сохраните пресет",
            loadPresetBtn: "Загрузить",
            deletePresetBtn: "Удалить",
            footerText: "© 2025 Created by grvelvet",
            closeBtnTitle: "Закрыть",
            copiedAlert: "Скопировано!",
            alertNoPresets: "Нет пресетов для экспорта.",
            alertImportError: "Ошибка: не удалось прочитать файл. Убедитесь, что это корректный JSON."
        },
        en: {
            appTitle: "Prompt Artisan",
            helpTitle: "Help",
            subjectHeader: "Subject & Action",
            appearanceHeader: "Appearance",
            appearancePlaceholder: "1girl, long hair, blue eyes...",
            clothingHeader: "Clothing & Accessories",
            clothingPlaceholder: "elegant dress, red shoes...",
            poseHeader: "Pose & Action",
            posePlaceholder: "standing, looking at viewer...",
            compositionHeader: "Composition, Scene, Style",
            locationHeader: "Environment (Location)",
            locationPlaceholder: "in a forest, city background...",
            lightingHeader: "Lighting & Atmosphere",
            lightingPlaceholder: "cinematic lighting, dark background...",
            cameraHeader: "Camera & Composition",
            cameraPlaceholder: "medium shot, bokeh, blurry background...",
            styleHeader: "Art Style & Quality",
            stylePlaceholder: "photorealistic, masterpiece, detailed bg...",
            advancedHeader: "Advanced Settings",
            loraHeader: "LoRA / Trigger Words",
            loraPlaceholder: "<lora:name:strength> or trigger words",
            finalPromptHeader: "Final Prompt",
            copyBtn: "Copy",
            formManagementHeader: "Form Management",
            rebuildBtn: "Rebuild Prompt",
            clearBtn: "Clear Form",
            qualityToggle: "Add quality tags",
            presetsHeader: "Preset Management",
            importBtn: "Import (.json)",
            exportBtn: "Export (.json)",
            presetNamePlaceholder: "New preset name",
            savePresetBtn: "Save to Session",
            presetSelectDefault: "--- Select a preset ---",
            presetPreviewPlaceholder: "Import a file or save a preset to the session",
            loadPresetBtn: "Load",
            deletePresetBtn: "Delete",
            footerText: "© 2025 Created by grvelvet",
            closeBtnTitle: "Close",
            copiedAlert: "Copied!",
            alertNoPresets: "No presets to export.",
            alertImportError: "Error: Could not read the file. Ensure it's a valid JSON."
        }
    };

    // --- DOM-ЭЛЕМЕНТЫ ---
    const form = document.getElementById('prompt-form');
    const allTextareas = document.querySelectorAll('textarea');
    const promptParts = document.querySelectorAll('.prompt-part');
    const savableFields = document.querySelectorAll('.savable-field');
    const positiveOutput = document.getElementById('output-positive');
    const negativeOutput = document.getElementById('output-negative');
    const loraInput = document.getElementById('loras');
    const rebuildBtn = document.getElementById('rebuild-prompt');
    const qualityToggle = document.getElementById('quality-toggle');
    const presetNameInput = document.getElementById('preset-name');
    const presetSelect = document.getElementById('preset-select');
    const savePresetBtn = document.getElementById('save-preset-btn');
    const deletePresetBtn = document.getElementById('delete-preset-btn');
    const presetPreview = document.getElementById('preset-preview');
    const loadPresetBtn = document.getElementById('load-preset-btn');
    const showManualBtn = document.getElementById('show-manual-btn');
    const manualModal = document.getElementById('manual-modal');
    const closeManualBtn = document.getElementById('close-manual-btn');
    const manualBody = manualModal.querySelector('.manual-body');
    const langToggleCheckbox = document.getElementById('lang-toggle-checkbox');
    const importPresetsBtn = document.getElementById('import-presets-btn');
    const exportPresetsBtn = document.getElementById('export-presets-btn');

    // --- СОСТОЯНИЕ ПРИЛОЖЕНИЯ ---
    let isManualEditMode = false;
    let isManualLoaded = false;
    let savedPresets = {};
    let currentLang = localStorage.getItem(LANG_KEY) || 'ru';

    // --- УТИЛИТЫ ---
    const splitTags = (value) => value.split(',').map(s => s.trim()).filter(Boolean);
    const getUniqueTags = (tags) => [...new Set(tags)];
    const autoResizeTextarea = (element) => {
        if (!element || !element.style) return;
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };
    const copyText = (element, button) => {
        navigator.clipboard.writeText(element.value).then(() => {
            const originalText = button.textContent;
            button.textContent = i18n[currentLang].copiedAlert;
            setTimeout(() => { button.textContent = originalText; }, 1500);
        });
    };

    // --- ОСНОВНЫЕ ФУНКЦИИ ---
    const generatePositiveOutput = () => {
        if (isManualEditMode) return;
        let userTags = [];
        promptParts.forEach(el => {
            userTags = userTags.concat(splitTags(el.value));
        });
        let finalTags = qualityToggle.checked ? [...POSITIVE_QUALITY_TAGS, ...userTags] : userTags;
        const promptCore = getUniqueTags(finalTags).join(', ');
        const loraString = loraInput.value.trim();
        positiveOutput.value = (loraString ? loraString + ' ' : '') + promptCore;
        autoResizeTextarea(positiveOutput);
    };

    const updateNegativeOutput = () => {
        let userNegativeTags = negativeOutput.value.split(',').map(t => t.trim()).filter(Boolean);
        userNegativeTags = userNegativeTags.filter(tag => !NEGATIVE_QUALITY_TAGS.includes(tag));
        let finalNegativeTags = qualityToggle.checked ? [...NEGATIVE_QUALITY_TAGS, ...userNegativeTags] : userNegativeTags;
        negativeOutput.value = getUniqueTags(finalNegativeTags).join(', ');
        autoResizeTextarea(negativeOutput);
    };

    const resetToDefaultState = () => {
        setManualEditMode(false);
        promptParts.forEach(el => el.value = '');
        negativeOutput.value = DEFAULT_NEGATIVE_PROMPT;
        qualityToggle.checked = true;
        generatePositiveOutput();
        updateNegativeOutput();
        allTextareas.forEach(autoResizeTextarea);
    };

    const setManualEditMode = (isManual) => {
        isManualEditMode = isManual;
        positiveOutput.classList.toggle('manual-edit', isManual);
    };

    const handleWeightControl = (e) => {
        const button = e.target.closest('.weight-btn');
        if (!button) return;
        e.preventDefault();
        const textarea = button.closest('.input-group').querySelector('textarea');
        if (!textarea) return;
        const { selectionStart, selectionEnd } = textarea;
        const action = button.dataset.action;
        let startIndex, endIndex, textToModify;
        if (selectionStart !== selectionEnd) {
            startIndex = selectionStart;
            endIndex = selectionEnd;
            textToModify = textarea.value.substring(startIndex, endIndex);
        } else {
            const textBeforeCursor = textarea.value.substring(0, selectionEnd);
            const lastCommaIndex = textBeforeCursor.lastIndexOf(',');
            startIndex = lastCommaIndex === -1 ? 0 : lastCommaIndex + 1;
            endIndex = selectionEnd;
            textToModify = textarea.value.substring(startIndex, endIndex);
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
        generatePositiveOutput();
    };

    // --- ЛОГИКА ПРЕСЕТОВ И МАНУАЛА ---
    const handleSavePreset = () => {
        const name = presetNameInput.value.trim();
        if (!name) { alert(i18n[currentLang].presetNamePlaceholder); return; }
        const presetData = {};
        savableFields.forEach(el => { presetData[el.id] = el.value; });
        savedPresets[name] = presetData;
        populatePresetDropdown();
        presetSelect.value = name;
        renderPresetPreview();
        presetNameInput.value = '';
    };
    const handleLoadPreset = () => {
        const name = presetSelect.value;
        if (!savedPresets[name]) { return; }
        const presetData = savedPresets[name];
        savableFields.forEach(el => {
            el.value = presetData[el.id] || (el.id === 'output-negative' ? DEFAULT_NEGATIVE_PROMPT : '');
        });
        savableFields.forEach(autoResizeTextarea);
        setManualEditMode(false);
        generatePositiveOutput();
        updateNegativeOutput();
    };
    const handleDeletePreset = () => {
        const name = presetSelect.value;
        if (!savedPresets[name]) { return; }
        if (confirm(`Delete preset "${name}" from this session?`)) {
            delete savedPresets[name];
            populatePresetDropdown();
        }
    };
    const populatePresetDropdown = () => {
        const defaultOptionText = i18n[currentLang].presetSelectDefault;
        presetSelect.innerHTML = `<option value="">${defaultOptionText}</option>`;
        Object.keys(savedPresets).sort().forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            presetSelect.appendChild(option);
        });
        renderPresetPreview();
    };
    const renderPresetPreview = () => {
        const name = presetSelect.value;
        const presetData = savedPresets[name];
        const placeholder = presetPreview.querySelector('.placeholder');
        if (!presetData) {
            if(placeholder) placeholder.textContent = i18n[currentLang].presetPreviewPlaceholder;
            const ul = presetPreview.querySelector('ul');
            if(ul) ul.remove();
            if(!placeholder && !ul) presetPreview.innerHTML = `<span class="placeholder">${i18n[currentLang].presetPreviewPlaceholder}</span>`;
            return;
        }
        let previewHtml = '<ul>';
        for (const [key, value] of Object.entries(presetData)) {
            if (value.trim()) {
                const h3 = document.querySelector(`h3[data-i18n="${key}Header"]`);
                const label = h3 ? h3.textContent : key;
                previewHtml += `<li><strong>${label}:</strong> ${value}</li>`;
            }
        }
        previewHtml += '</ul>';
        presetPreview.innerHTML = previewHtml;
    };
    const handleExportPresets = () => {
        if (Object.keys(savedPresets).length === 0) {
            alert(i18n[currentLang].alertNoPresets);
            return;
        }
        const dataStr = JSON.stringify(savedPresets, null, 2);
        const dataBlob = new Blob([dataStr], {type: "application/json"});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `prompt-artisan-presets.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    const handleImportPresets = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const importedPresets = JSON.parse(event.target.result);
                    if (typeof importedPresets === 'object' && importedPresets !== null) {
                        savedPresets = importedPresets;
                        populatePresetDropdown();
                    } else {
                        throw new Error('Invalid JSON structure');
                    }
                } catch (error) {
                    alert(i18n[currentLang].alertImportError);
                    console.error("Import error:", error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };
    const showManual = async () => {
        manualModal.dataset.visible = 'true';
        if (isManualLoaded) return;
        const manualFile = currentLang === 'ru' ? 'manual-content.html' : 'manual-content-en.html';
        try {
            const response = await fetch(manualFile);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            setTimeout(() => {
                manualBody.innerHTML = content;
                isManualLoaded = true;
            }, 300);
        } catch (error) {
            console.error("Failed to load manual:", error);
            manualBody.innerHTML = `<p style="color: var(--text-color);">Could not load the manual.</p>`;
            isManualLoaded = false;
        }
    };
    const hideManual = () => {
        manualModal.dataset.visible = 'false';
    };
    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem(LANG_KEY, lang);
        document.documentElement.lang = lang;
        langToggleCheckbox.checked = lang === 'en';
        const translations = i18n[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = translations[el.dataset.i18n];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = translations[el.dataset.i18nPlaceholder];
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = translations[el.dataset.i18nTitle];
        });
        populatePresetDropdown();
        isManualLoaded = false;
    };

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---
    form.addEventListener('input', generatePositiveOutput);
    form.addEventListener('mousedown', handleWeightControl);
    qualityToggle.addEventListener('change', () => {
        generatePositiveOutput();
        updateNegativeOutput();
    });
    positiveOutput.addEventListener('input', () => {
        setManualEditMode(true);
        autoResizeTextarea(positiveOutput);
    });
    negativeOutput.addEventListener('input', autoResizeTextarea);
    rebuildBtn.addEventListener('click', () => {
        setManualEditMode(false);
        generatePositiveOutput();
    });
    form.addEventListener('reset', (e) => {
        e.preventDefault();
        resetToDefaultState();
    });
    langToggleCheckbox.addEventListener('change', () => {
        const newLang = langToggleCheckbox.checked ? 'en' : 'ru';
        setLanguage(newLang);
    });
    importPresetsBtn.addEventListener('click', handleImportPresets);
    exportPresetsBtn.addEventListener('click', handleExportPresets);
    document.getElementById('copy-positive').addEventListener('click', (e) => copyText(positiveOutput, e.target));
    document.getElementById('copy-negative').addEventListener('click', (e) => copyText(negativeOutput, e.target));
    savePresetBtn.addEventListener('click', handleSavePreset);
    loadPresetBtn.addEventListener('click', handleLoadPreset);
    presetSelect.addEventListener('change', renderPresetPreview);
    deletePresetBtn.addEventListener('click', handleDeletePreset);
    showManualBtn.addEventListener('click', showManual);
    closeManualBtn.addEventListener('click', hideManual);
    manualModal.addEventListener('click', (e) => { if (e.target === manualModal) hideManual(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && manualModal.dataset.visible === 'true') hideManual(); });

    // --- ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ---
    setLanguage(currentLang);
    document.getElementById('app-title').textContent += ` v${APP_VERSION}`;
    setTimeout(resetToDefaultState, 0);
    allTextareas.forEach(textarea => {
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));
    });
});