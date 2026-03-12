/**
 * Tiptap-Max Export Utilities
 * Provides functions to export editor content in multiple formats
 */

/**
 * Export content as HTML file
 */
export const exportAsHTML = (htmlContent, filename = 'document') => {
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
</head>
<body>
${htmlContent}
</body>
</html>`;

    downloadFile(fullHTML, `${filename}.html`, 'text/html');
};

/**
 * Export content as JSON
 */
export const exportAsJSON = (editor, filename = 'document') => {
    if (!editor) {
        console.error('Editor instance not available');
        return;
    }
    
    const json = editor.getJSON();
    const jsonString = JSON.stringify(json, null, 2);
    downloadFile(jsonString, `${filename}.json`, 'application/json');
};

/**
 * Export content as Plain Text
 */
export const exportAsText = (editor, filename = 'document') => {
    if (!editor) {
        console.error('Editor instance not available');
        return;
    }
    
    const text = editor.getText();
    downloadFile(text, `${filename}.txt`, 'text/plain');
};

/**
 * Export content as Rich Text Format (RTF)
 * Converts HTML to basic RTF format
 */
export const exportAsRTF = (htmlContent, filename = 'document') => {
    const rtfContent = htmlToRTF(htmlContent);
    downloadFile(rtfContent, `${filename}.rtf`, 'application/rtf');
};

/**
 * Export content as PDF
 * Uses browser's print functionality with custom styling
 */
export const exportAsPDF = (htmlContent, filename = 'document') => {
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    iframeDoc.open();
    iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${filename}</title>
            <style>
                @page {
                    margin: 2cm;
                    size: A4;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #000;
                    font-size: 12pt;
                }
                h1 { font-size: 24pt; margin-top: 24pt; margin-bottom: 12pt; }
                h2 { font-size: 18pt; margin-top: 18pt; margin-bottom: 10pt; }
                h3 { font-size: 14pt; margin-top: 14pt; margin-bottom: 8pt; }
                p { margin: 8pt 0; }
                img { max-width: 100%; height: auto; page-break-inside: avoid; }
                table { border-collapse: collapse; width: 100%; margin: 12pt 0; page-break-inside: avoid; }
                th, td { border: 1px solid #000; padding: 8pt; text-align: left; }
                th { background-color: #f0f0f0; font-weight: 600; }
                pre { background: #f5f5f5; padding: 12pt; border-radius: 4px; page-break-inside: avoid; }
                code { background: #f5f5f5; padding: 2pt 4pt; border-radius: 3px; font-size: 10pt; }
                blockquote { border-left: 4px solid #000; margin: 12pt 0; padding-left: 12pt; }
                ul, ol { margin: 8pt 0; padding-left: 24pt; }
            </style>
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `);
    iframeDoc.close();
    
    // Wait for content to load, then print
    iframe.contentWindow.focus();
    setTimeout(() => {
        iframe.contentWindow.print();
        // Remove iframe after printing
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    }, 250);
};

/**
 * Convert HTML to RTF format
 * Comprehensive conversion with proper formatting support
 */
function htmlToRTF(html) {
    // RTF header with charset
    let rtf = '{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\n';
    
    // Extended font table with common fonts
    rtf += '{\\fonttbl';
    rtf += '{\\f0\\fnil\\fcharset0 Calibri;}';
    rtf += '{\\f1\\fnil\\fcharset0 Arial;}';
    rtf += '{\\f2\\fnil\\fcharset0 Times New Roman;}';
    rtf += '{\\f3\\fnil\\fcharset0 Courier New;}';
    rtf += '{\\f4\\fnil\\fcharset0 Georgia;}';
    rtf += '{\\f5\\fnil\\fcharset0 Verdana;}';
    rtf += '{\\f6\\fnil\\fcharset0 Comic Sans MS;}';
    rtf += '{\\f7\\fnil\\fcharset0 Trebuchet MS;}';
    rtf += '{\\f8\\fnil\\fcharset0 Consolas;}';
    rtf += '{\\f9\\fnil\\fcharset0 monospace;}';
    rtf += '}\n';
    
    // Extended color table
    rtf += '{\\colortbl;';
    rtf += '\\red0\\green0\\blue0;';        // 1 - black
    rtf += '\\red255\\green255\\blue255;';  // 2 - white
    rtf += '\\red255\\green0\\blue0;';      // 3 - red
    rtf += '\\red0\\green255\\blue0;';      // 4 - green
    rtf += '\\red0\\green0\\blue255;';      // 5 - blue
    rtf += '\\red255\\green255\\blue0;';    // 6 - yellow
    rtf += '\\red255\\green0\\blue255;';    // 7 - magenta
    rtf += '\\red0\\green255\\blue255;';    // 8 - cyan
    rtf += '\\red128\\green128\\blue128;';  // 9 - gray
    rtf += '\\red139\\green92\\blue246;';   // 10 - purple (highlight)
    rtf += '\\red245\\green158\\blue11;';   // 11 - orange
    rtf += '\\red240\\green240\\blue240;';  // 12 - light gray (code bg)
    rtf += '}\n';
    
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Start with default formatting
    rtf += '\\viewkind4\\uc1\\pard\\sa200\\sl276\\slmult1\\f0\\fs22\\lang9 ';
    
    // Convert the body content
    rtf += convertNodeToRTF(doc.body);
    
    rtf += '\n}';
    
    return rtf;
}

/**
 * Recursively convert DOM nodes to RTF
 */
function convertNodeToRTF(node) {
    if (!node) return '';
    
    let rtf = '';
    
    // Handle different node types
    if (node.nodeType === Node.TEXT_NODE) {
        // Escape special RTF characters
        let text = node.textContent;
        text = text.replace(/\\/g, '\\\\');
        text = text.replace(/{/g, '\\{');
        text = text.replace(/}/g, '\\}');
        text = text.replace(/\n/g, '\\par ');
        return text;
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }
    
    const tagName = node.tagName.toLowerCase();
    const style = node.getAttribute('style') || '';
    
    // Handle different HTML elements
    switch (tagName) {
        case 'h1':
            rtf += '\\pard\\sa200\\sl276\\slmult1\\b\\fs48 ';
            rtf += convertChildNodes(node);
            rtf += '\\b0\\fs22\\par ';
            break;
            
        case 'h2':
            rtf += '\\pard\\sa200\\sl276\\slmult1\\b\\fs40 ';
            rtf += convertChildNodes(node);
            rtf += '\\b0\\fs22\\par ';
            break;
            
        case 'h3':
            rtf += '\\pard\\sa200\\sl276\\slmult1\\b\\fs32 ';
            rtf += convertChildNodes(node);
            rtf += '\\b0\\fs22\\par ';
            break;
            
        case 'h4':
            rtf += '\\pard\\sa200\\sl276\\slmult1\\b\\fs28 ';
            rtf += convertChildNodes(node);
            rtf += '\\b0\\fs22\\par ';
            break;
            
        case 'h5':
            rtf += '\\pard\\sa200\\sl276\\slmult1\\b\\fs26 ';
            rtf += convertChildNodes(node);
            rtf += '\\b0\\fs22\\par ';
            break;
            
        case 'h6':
            rtf += '\\pard\\sa200\\sl276\\slmult1\\b\\fs24 ';
            rtf += convertChildNodes(node);
            rtf += '\\b0\\fs22\\par ';
            break;
            
        case 'p':
            rtf += '\\pard\\sa200\\sl276\\slmult1 ';
            rtf += convertChildNodes(node);
            rtf += '\\par ';
            break;
            
        case 'strong':
        case 'b':
            rtf += '{\\b ';
            rtf += convertChildNodes(node);
            rtf += '}';
            break;
            
        case 'em':
        case 'i':
            rtf += '{\\i ';
            rtf += convertChildNodes(node);
            rtf += '}';
            break;
            
        case 'u':
            rtf += '{\\ul ';
            rtf += convertChildNodes(node);
            rtf += '}';
            break;
            
        case 's':
        case 'strike':
        case 'del':
            rtf += '{\\strike ';
            rtf += convertChildNodes(node);
            rtf += '}';
            break;
            
        case 'mark':
            rtf += '{\\highlight10 ';
            rtf += convertChildNodes(node);
            rtf += '}';
            break;
            
        case 'code':
            if (node.parentNode.tagName.toLowerCase() !== 'pre') {
                rtf += '{\\f3\\fs20\\highlight12 ';
                rtf += convertChildNodes(node);
                rtf += '}';
            } else {
                rtf += convertChildNodes(node);
            }
            break;
            
        case 'pre':
            rtf += '\\pard\\sa200\\sl276\\slmult1\\f3\\fs20\\highlight12 ';
            rtf += convertChildNodes(node);
            rtf += '\\f0\\fs22\\highlight0\\par ';
            break;
            
        case 'blockquote':
            rtf += '\\pard\\li720\\sa200\\sl276\\slmult1\\i ';
            rtf += convertChildNodes(node);
            rtf += '\\i0\\li0\\par ';
            break;
            
        case 'ul':
            node.childNodes.forEach((li) => {
                if (li.tagName && li.tagName.toLowerCase() === 'li') {
                    rtf += '\\pard\\fi-360\\li720\\sa100\\sl276\\slmult1 \\bullet\\tab ';
                    rtf += convertChildNodes(li);
                    rtf += '\\par ';
                }
            });
            break;
            
        case 'ol':
            let counter = 1;
            node.childNodes.forEach((li) => {
                if (li.tagName && li.tagName.toLowerCase() === 'li') {
                    rtf += `\\pard\\fi-360\\li720\\sa100\\sl276\\slmult1 ${counter}.\\tab `;
                    rtf += convertChildNodes(li);
                    rtf += '\\par ';
                    counter++;
                }
            });
            break;
            
        case 'table':
            rtf += convertTableToRTF(node);
            break;
            
        case 'br':
            rtf += '\\line ';
            break;
            
        case 'hr':
            rtf += '\\pard\\brdrb\\brdrs\\brdrw10\\brsp20\\sa200\\par ';
            break;
            
        case 'a':
            const href = node.getAttribute('href');
            rtf += '{\\field{\\*\\fldinst HYPERLINK "' + href + '"}{\\fldrslt {\\ul\\cf5 ';
            rtf += convertChildNodes(node);
            rtf += '}}}';
            break;
            
        case 'span':
            // Handle font family from style
            let fontFamily = '';
            let fontSize = '';
            let color = '';
            
            if (style) {
                const fontFamilyMatch = style.match(/font-family:\s*([^;]+)/i);
                if (fontFamilyMatch) {
                    fontFamily = fontFamilyMatch[1].trim().replace(/['"]/g, '');
                }
                
                const fontSizeMatch = style.match(/font-size:\s*(\d+)px/i);
                if (fontSizeMatch) {
                    fontSize = Math.round(parseInt(fontSizeMatch[1]) * 2); // Convert px to half-points
                }
                
                const colorMatch = style.match(/color:\s*([^;]+)/i);
                if (colorMatch) {
                    color = colorMatch[1].trim();
                }
            }
            
            let prefix = '';
            let suffix = '';
            
            if (fontFamily) {
                const fontMap = {
                    'arial': 'f1',
                    'times': 'f2',
                    'courier': 'f3',
                    'georgia': 'f4',
                    'verdana': 'f5',
                    'comic sans': 'f6',
                    'trebuchet': 'f7',
                    'consolas': 'f8',
                    'monospace': 'f9'
                };
                
                for (let [key, value] of Object.entries(fontMap)) {
                    if (fontFamily.toLowerCase().includes(key)) {
                        prefix += `\\${value} `;
                        suffix = '\\f0 ' + suffix;
                        break;
                    }
                }
            }
            
            if (fontSize) {
                prefix += `\\fs${fontSize} `;
                suffix = '\\fs22 ' + suffix;
            }
            
            if (prefix || suffix) {
                rtf += '{' + prefix;
                rtf += convertChildNodes(node);
                rtf += suffix + '}';
            } else {
                rtf += convertChildNodes(node);
            }
            break;
            
        case 'sub':
            rtf += '{\\sub ';
            rtf += convertChildNodes(node);
            rtf += '}';
            break;
            
        case 'sup':
            rtf += '{\\super ';
            rtf += convertChildNodes(node);
            rtf += '}';
            break;
            
        default:
            // For unknown elements, just process children
            rtf += convertChildNodes(node);
            break;
    }
    
    return rtf;
}

/**
 * Convert child nodes to RTF
 */
function convertChildNodes(node) {
    let rtf = '';
    node.childNodes.forEach(child => {
        rtf += convertNodeToRTF(child);
    });
    return rtf;
}

/**
 * Convert HTML table to RTF table
 */
function convertTableToRTF(tableNode) {
    let rtf = '';
    
    const rows = tableNode.querySelectorAll('tr');
    if (rows.length === 0) return rtf;
    
    // Calculate number of columns
    const firstRow = rows[0];
    const cols = firstRow.querySelectorAll('th, td').length;
    
    // Define cell widths (distribute evenly, RTF uses twips: 1 inch = 1440 twips)
    const pageWidth = 9000; // ~6.25 inches
    const cellWidth = Math.floor(pageWidth / cols);
    
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('th, td');
        
        // Row definition
        rtf += '\\trowd\\trgaph70\\trleft0';
        
        // Define cell borders and widths
        let cellPos = 0;
        for (let i = 0; i < cells.length; i++) {
            cellPos += cellWidth;
            rtf += `\\clbrdrt\\brdrw10\\brdrs\\clbrdrl\\brdrw10\\brdrs\\clbrdrb\\brdrw10\\brdrs\\clbrdrr\\brdrw10\\brdrs\\cellx${cellPos}`;
        }
        
        rtf += ' ';
        
        // Cell content
        cells.forEach((cell) => {
            const isHeader = cell.tagName.toLowerCase() === 'th';
            if (isHeader) {
                rtf += '\\pard\\intbl\\qc\\b ';
            } else {
                rtf += '\\pard\\intbl ';
            }
            
            rtf += convertChildNodes(cell);
            
            if (isHeader) {
                rtf += '\\b0';
            }
            
            rtf += '\\cell ';
        });
        
        rtf += '\\row ';
    });
    
    rtf += '\\pard\\sa200\\par ';
    
    return rtf;
}

/**
 * Generic file download helper
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 */
export const generateFilename = (base = 'tiptap-document') => {
    const date = new Date();
    const timestamp = date.toISOString().split('T')[0];
    return `${base}-${timestamp}`;
};
