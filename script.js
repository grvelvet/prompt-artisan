document.addEventListener('DOMContentLoaded', () => {

    // --- КОНСТАНТЫ ---
    const PRESETS_KEY = 'promptArtisanPresets_v2_9_0';
    const APP_VERSION = '2.9.5';
    const POSITIVE_QUALITY_TAGS = ['masterpiece', 'best quality', 'highres', 'ultra-detailed'];
    const NEGATIVE_QUALITY_TAGS = ['worst quality', 'low quality', 'normal quality'];
    const DEFAULT_NEGATIVE_PROMPT = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name, bad feet, deformed, disfigured";

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

    // --- СОСТОЯНИЕ ПРИЛОЖЕНИЯ ---
    let isManualEditMode = false;
    let isManualLoaded = false;
    let savedPresets = {};

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
            button.textContent = 'Скопировано!';
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
        
        const trimmedText = textToModify.trim();
        if (!trimmedText) return;

        // --- ГЛАВНЫЙ ФИКС ---
        const weightRegex = /^\((.*):(-?[\d.]+)\)$/;
        const match = trimmedText.match(weightRegex);
        
        const cleanText = match ? match[1].trim() : trimmedText;
        const currentWeight = match ? parseFloat(match[2]) : 1.0;
        
        let newWeight = parseFloat((action === 'increase' ? currentWeight + 0.1 : currentWeight - 0.1).toFixed(1));
        
        // Ограничиваем вес снизу нулем
        newWeight = Math.max(0, newWeight);
        
        const newText = (newWeight === 1.0) ? cleanText : `(${cleanText}:${newWeight})`;
        
        // Находим правильные границы для замены, включая пробелы
        const replacementStartIndex = textarea.value.indexOf(textToModify, startIndex);
        const replacementEndIndex = replacementStartIndex + textToModify.length;

        textarea.setRangeText(newText, replacementStartIndex, replacementEndIndex, 'select');
        textarea.focus();
        generatePositiveOutput();
    };
    
    // --- ЛОГИКА ПРЕСЕТОВ И МАНУАЛА (полные версии) ---
    const handleSavePreset = () => {
        const name = presetNameInput.value.trim();
        if (!name) { alert('Введите имя пресета.'); return; }
        const presetData = {};
        savableFields.forEach(el => { presetData[el.id] = el.value; });
        savedPresets[name] = presetData;
        savePresetsToStorage();
        populatePresetDropdown();
        presetSelect.value = name;
        renderPresetPreview();
        alert(`Пресет "${name}" сохранен!`);
    };
    const handleLoadPreset = () => {
        const name = presetSelect.value;
        if (!savedPresets[name]) { alert('Пожалуйста, выберите пресет из списка для загрузки.'); return; }
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
        if (!savedPresets[name]) { alert('Выберите пресет для удаления.'); return; }
        if (confirm(`Удалить пресет "${name}"?`)) {
            delete savedPresets[name];
            savePresetsToStorage();
            populatePresetDropdown();
            presetNameInput.value = '';
            alert(`Пресет "${name}" удален.`);
        }
    };
    const populatePresetDropdown = () => {
        presetSelect.innerHTML = '<option value="">--- Выберите пресет ---</option>';
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
        if (!presetData) {
            presetPreview.innerHTML = '<span class="placeholder">Выберите пресет для предпросмотра</span>';
            return;
        }
        let previewHtml = '<ul>';
        for (const [key, value] of Object.entries(presetData)) {
            if (value.trim()) {
                const label = document.querySelector(`label[for="${key}"]`)?.textContent || key;
                previewHtml += `<li><strong>${label}:</strong> ${value}</li>`;
            }
        }
        previewHtml += '</ul>';
        presetPreview.innerHTML = previewHtml;
    };
    const loadPresetsFromStorage = () => {
        savedPresets = JSON.parse(localStorage.getItem(PRESETS_KEY)) || {};
        populatePresetDropdown();
    };
    const savePresetsToStorage = () => localStorage.setItem(PRESETS_KEY, JSON.stringify(savedPresets));
    const showManual = async () => {
        manualModal.dataset.visible = 'true';
        if (isManualLoaded) return;
        try {
            const response = await fetch('manual-content.html');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            setTimeout(() => {
                manualBody.innerHTML = content;
                isManualLoaded = true;
            }, 300);
        } catch (error) {
            console.error("Failed to load manual:", error);
            manualBody.innerHTML = `<p style="color: var(--text-color);">Не удалось загрузить руководство.</p>`;
            isManualLoaded = false;
        }
    };
    const hideManual = () => {
        manualModal.dataset.visible = 'false';
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
    negativeOutput.addEventListener('input', () => autoResizeTextarea(negativeOutput));
    rebuildBtn.addEventListener('click', () => {
        setManualEditMode(false);
        generatePositiveOutput();
    });
    form.addEventListener('reset', (e) => {
        e.preventDefault();
        resetToDefaultState();
    });
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
    document.getElementById('app-title').textContent += ` v${APP_VERSION}`;
    loadPresetsFromStorage();
    setTimeout(resetToDefaultState, 0);
    allTextareas.forEach(textarea => {
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));
    });
});