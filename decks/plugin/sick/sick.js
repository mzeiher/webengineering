const SickPlugin = {
  id: "sickplugin",
  init: (reveal) => {
    
    // logo disabling
    reveal.on('slidechanged', (event) => {
      if (event.currentSlide.hasAttribute('data-no-logo')) {
        document.querySelector('.reveal > .slides').classList.add('no-logo');
      } else {
        document.querySelector('.reveal > .slides').classList.remove('no-logo');
      }
    });

    document.querySelectorAll('.sick-grid').forEach((element) => {
      element.classList.add('r-stretch');
    });

    // footer handling
    const footerAutoanimateId = `id-${Number.parseInt(Math.random()*1000)}`;
    document.querySelectorAll('section:not([data-no-footer]) > .sick-grid').forEach((element) => {
      if(element.querySelectorAll(':scope > footer').length === 0) {
        const footer = document.createElement('footer');
        footer.setAttribute('data-id', footerAutoanimateId);
        element.appendChild(footer);
      }
    });
    document.querySelectorAll('.sick-grid > footer').forEach((element) => {
      element.textContent = reveal.getConfig()?.sickPlugin?.footerText || '';
    });
    // end footer handling

    // footnote handling
    const processed = new WeakMap();
    document.querySelectorAll('section').forEach((element) => {
      if (element.querySelectorAll('section').length === 0) { // skip all sections which have sections underneath
        let container = null;
        element.querySelectorAll('figure, sup[data-footnote], sup[data-footnote-link]').forEach((footnote, index) => {
          if (!container) {
            container = document.createElement('ul');
            container.classList.add('sick-footnote');
            (element.querySelector('.sick-grid') ?? element).appendChild(container);
          }
          if (!processed.has(footnote)) {
            processed.set(footnote, true);
            const entry = document.createElement('li');
            entry.innerHTML = `<span>[${index + 1}]
            ${footnote.hasAttribute('data-footnote-link') ? `<a href="${footnote.getAttribute('data-footnote-link')}" title="${footnote.textContent.trim()}">` : ''}
            ${footnote.textContent.trim() || footnote.getAttribute('data-footnote-link')}
            ${footnote.hasAttribute('data-footnote-link') ? `</a>` : ''}
            </span>`
            container.appendChild(entry);
            if(footnote.tagName === 'FIGURE') {
              Array.from(footnote.childNodes).forEach((node) => {
                if(!['PICTURE', 'IMG'].includes(node.nodeName)) {
                  node.remove();
                }
              });
            } else {
              footnote.innerHTML = `[${index + 1}]`
            }
          }
        });
      }
    });
  },
};
