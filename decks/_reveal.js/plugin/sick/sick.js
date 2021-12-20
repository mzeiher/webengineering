const SickPlugin = {
  id: "sickplugin",
  init: (reveal) => {

    // logo disabling
    reveal.on('slidechanged', (event) => {
      if (event.currentSlide.hasAttribute('data-sick-no-logo')) {
        document.querySelector('.reveal > .slides').classList.add('no-logo');
      } else {
        document.querySelector('.reveal > .slides').classList.remove('no-logo');
      }
      if (event.currentSlide.hasAttribute('data-sick-no-footer')) {
        document.querySelector('.reveal > .slides').classList.add('no-footer');
      } else {
        document.querySelector('.reveal > .slides').classList.remove('no-footer');
      }
    });

    const overlay = document.createElement('div');
    overlay.classList.add('sick-overlay');
    document.body.appendChild(overlay)
    reveal.on('ready', () => {
      overlay.remove()
    })

    // footer injection
    document.querySelector('.reveal > .slides')?.setAttribute('data-footer-text', reveal.getConfig()?.sickPlugin?.footerText || '')

    document.querySelectorAll('section[data-sick-grid],section[data-sick-title],section[data-sick-chapter]').forEach((element) => {
      if (!element.querySelector('scope > .sick-grid')) { // ignore slides where a sick grid is already in place
        const h1 = element.querySelector(':scope > h1');
        const h2 = element.querySelector(':scope > h2');
        const h3 = element.querySelector(':scope > h3');

        const grid = document.createElement('div');
        grid.classList.add('sick-grid');
        if (element.hasAttribute('data-sick-title') && h1) {
          const header = document.createElement('header');
          header.classList.add('title');
          header.appendChild(h1)
          if(h2) {
            header.appendChild(h2)
          }
          grid.appendChild(header)
        } else if (element.hasAttribute('data-sick-chapter') && h2) {
          const header = document.createElement('header');
          header.classList.add('chapter');
          header.appendChild(h2)
          if(h3) {
            header.appendChild(h3)
          }
          grid.appendChild(header)
        } else {
          if (h2) {
            const header = document.createElement('header');
            header.appendChild(h2)
            grid.appendChild(header)
          }
        }

        const nodes = Array.from(element.childNodes);
        if ((nodes.length > 0 && element.textContent.trim() != "") || element.children.length > 0) {
          const main = document.createElement('main');
          main.append(...nodes);
          grid.append(main);
        }
        element.appendChild(grid);
      }
    });

    document.querySelectorAll('div.sick-grid').forEach((element) => {
      element.classList.add('r-stretch');
    });

    // footer handling
    // const footerAutoanimateId = `id-${Number.parseInt(Math.random() * 1000)}`;
    // document.querySelectorAll('section:not([data-no-footer]) > .sick-grid').forEach((element) => {
    //   if (element.querySelectorAll(':scope > footer').length === 0) {
    //     const footer = document.createElement('footer');
    //     footer.setAttribute('data-id', footerAutoanimateId);
    //     element.appendChild(footer);
    //   }
    // });
    // document.querySelectorAll('.sick-grid > footer').forEach((element) => {
    //   element.textContent = reveal.getConfig()?.sickPlugin?.footerText || '';
    // });
    // end footer handling

    // footnote handling
    const processed = new WeakMap();
    document.querySelectorAll('section').forEach((element) => {
      if (element.querySelectorAll('section').length === 0) { // skip all sections which have sections underneath
        let container = null;
        element.querySelectorAll('figure, sup[data-sick-footnote], sup[data-sick-footnote-link]').forEach((footnote, index) => {
          if (!container) {
            container = document.createElement('ul');
            container.classList.add('sick-footnote');
            (element.querySelector('.sick-grid') ?? element).appendChild(container);
          }
          if (!processed.has(footnote)) {
            processed.set(footnote, true);
            const entry = document.createElement('li');
            entry.innerHTML = `<span>[${index + 1}]
            ${footnote.hasAttribute('data-sick-footnote-link') ? `<a href="${footnote.getAttribute('data-sick-footnote-link')}" title="${footnote.textContent.trim()}">` : ''}
            ${footnote.textContent.trim() || footnote.getAttribute('data-sick-footnote-link')}
            ${footnote.hasAttribute('data-sick-footnote-link') ? `</a>` : ''}
            </span>`
            container.appendChild(entry);
            if (footnote.tagName === 'FIGURE') {
              Array.from(footnote.childNodes).forEach((node) => {
                if (!['PICTURE', 'IMG', 'VIDEO', 'SVG', 'OBJECT', 'AUDIO'].includes(node.nodeName)) {
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
