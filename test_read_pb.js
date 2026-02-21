const fs = require('fs');
const path = 'C:\\Users\\Hanz Mapua\\.gemini\\antigravity\\conversations\\80fdec6f-e98b-4df9-be5f-f8430315c04d.pb';

try {
    const data = fs.readFileSync(path);
    console.log('Buffer Length:', data.length);
    // Print the first 1000 characters to see if there's text
    console.log('Sample Data (utf8):', data.toString('utf8').slice(0, 1000).replace(/[^\x20-\x7E]/g, '.'));
} catch (err) {
    console.error('Error reading file:', err);
}
