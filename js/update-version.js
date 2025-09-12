const fs = require('fs');
const path = require('path');

// Читаем версию из package.json
const packageJson = require('./package.json');
const newVersion = packageJson.version;

console.log(`Обновляю версию в script.js на ${newVersion}...`);

// Путь к вашему основному скрипту
const scriptPath = path.join(__dirname, 'script.js');

try {
    // Читаем содержимое script.js
    let scriptContent = fs.readFileSync(scriptPath, 'utf8');

    // Ищем строку с версией и заменяем её
    const versionRegex = /(APP_VERSION:\s*['"])([^'"]+)(['"])/;
    if (versionRegex.test(scriptContent)) {
        scriptContent = scriptContent.replace(versionRegex, `$1${newVersion}$3`);
        
        // Перезаписываем файл с новой версией
        fs.writeFileSync(scriptPath, scriptContent, 'utf8');
        console.log('✅ Версия в script.js успешно обновлена!');
    } else {
        console.error('❌ Не удалось найти строку APP_VERSION в script.js.');
    }
} catch (error) {
    console.error('❌ Ошибка при чтении или записи script.js:', error);
}