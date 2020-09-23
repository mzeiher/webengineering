(() => {
  let counter = 0;
  window.addEventListener('message', () => {
    console.log('onMessage' + counter);
    Promise.resolve().then(() => {
      console.log('onmessage promise')
    });
    if (counter < 100) window.postMessage('test');
    counter++;
  });
  window.postMessage('test');
})();
(() => {
  let counter = 0;
  const raf = () => {
    console.log('onanimationframe' + counter);
    Promise.resolve().then(() => {
      console.log('onanimationframe promise1')
    });
    Promise.resolve().then(() => {
      console.log('onanimationframe promise2')
    });
    if (counter < 100) window.requestAnimationFrame(raf);
    counter++;
  }
  window.requestAnimationFrame(raf);
})();
(() => {
  let counter = 0;
  const timeout = () => {
    console.log('ontimeout' + counter);
    Promise.resolve().then(() => {
      console.log('onetimeout promise1')
    });
    Promise.resolve().then(() => {
      console.log('onetimeout promise2')
    });
    if (counter < 100) window.setTimeout(timeout);
    counter++;
  }
  window.setTimeout(timeout);
})();
(() => {
  let counter = 0;
  const idleCallback = () => {
    console.log('onidleCallback' + counter);
    Promise.resolve().then(() => {
      console.log('onidleCallback promise1')
    });
    Promise.resolve().then(() => {
      console.log('onidleCallback promise2')
    });
    if (counter < 100) window.requestIdleCallback(idleCallback);
    counter++;
  }
  if (window.requestIdleCallback) {
    window.requestIdleCallback(idleCallback);
  }
})();
(() => {
	const div = document.createElement('div');
	document.body.append(div);
  let counter = 0;

  const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
  }

  const observer = new MutationObserver(() => {
    console.log('onmutationobserver' + counter);
    Promise.resolve().then(() => {
      console.log('onmutationobserver promise1')
    });
    Promise.resolve().then(() => {
      console.log('onmutationobserver promise2')
    });
    if (counter < 100) div.innerHTML = '<div></div>';
    counter++;
  });
  observer.observe(div, observerOptions);
  div.innerHTML = '<div></div>';
})();
