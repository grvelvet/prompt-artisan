// js/config.js
export const config = {
    APP_VERSION: '1.0.0',
    LANG_KEY: 'promptArtisanLang_v1',
    THEME_KEY: 'promptArtisanTheme_v1',
    // БЫЛО: DATA_PATH: './data/',
    // СТАЛО:
    DATA_PATH: '/data/',
    POSITIVE_QUALITY_TAGS: ['masterpiece', 'best quality', 'highres', 'ultra-detailed'],
    NEGATIVE_QUALITY_TAGS: ['worst quality', 'low quality', 'normal quality'],
    DEFAULT_NEGATIVE_PROMPT: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, jpeg artifacts, signature, watermark, username, blurry, artist name, bad feet, deformed, disfigured"
};