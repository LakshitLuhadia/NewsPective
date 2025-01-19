async function translateToFrench(text) {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encodeURIComponent(text)}`);
        
        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();
        // Google Translate returns an array of arrays, get the translated text from first element
        const translatedText = data[0].map(item => item[0]).join('');
        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // fallback to original text
    }
}

export { translateToFrench };
