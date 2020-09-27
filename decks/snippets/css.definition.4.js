let sheet = new CSSStyleSheet();
sheet.addRule('div', 'background-color: black;');

document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
