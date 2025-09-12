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
- ## Installation and Setup

1. Clone the repository:
   git clone https://github.com/grvelvet/prompt-artisan.git

2. Navigate to the project directory:
   cd prompt-artisan

3. Install dependencies:
   npm install

4. Run in development mode:
   npm run dev

The project will then be available at http://localhost:5173