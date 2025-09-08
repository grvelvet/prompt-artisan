# Prompt Artisan

A structured tool for building and managing prompts for generative Text-to-Image AI, such as **Stable Diffusion**.

## ✨ Core Features
- **Structured Input**: The form is segmented into logical blocks (style, subject, scene, camera, etc.) for step-by-step prompt construction.  
- **Tag Browser**: A built-in tag dictionary loaded from JSON libraries, featuring search and categories for quickly adding complex details.  
- **Weight Control**: Incrementally increase or decrease the weight of individual tags `((tag:1.1))` directly within the UI.  
- **Preset Management**: Save, load, import, and export sets of populated fields in JSON format.  
- **Internationalization (i18n)**: Supports Russian and English with a language toggle.  
- **Responsive UI**: Renders correctly on both desktop and mobile devices.  

## 🛠 Tech Stack
- HTML5  
- CSS3 (vanilla)  
- JavaScript (ES6+, vanilla)  
- JSON (tags, presets, localization)  

## 📂 Project Structure
```text
.
├── data/
│   ├── tags-appearance.json
│   ├── tags-camera.json
│   ├── tags-clothing.json
│   ├── tags-lighting.json
│   ├── tags-location.json
│   ├── tags-style.json
│   └── tags-subject.json
├── index.html              # Main application structure
├── script.js               # All application logic
├── style.css               # All styles
├── package.json            # Project metadata and scripts
├── update-version.js       # Script for automatic version updates
└── README.md
