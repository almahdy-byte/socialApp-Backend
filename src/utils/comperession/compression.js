export const compressText = (text) => {
    const compressed = pako.gzip(text);
    return btoa(String.fromCharCode(...compressed)); 
};

export const dCompressText = (base64Str) => {
    const binaryString = atob(base64Str);
    const byteArray = new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
    return pako.inflate(byteArray, { to: 'string' });
};

export const messageCompression = (text) => {
    const compressed = compressText(text);
    return compressed;
};

export const messageDCompression = (compressedText) => dCompressText(compressedText);
