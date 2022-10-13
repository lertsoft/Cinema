import './assets/styles/main.css';

// @ts-ignore
import TVScreen from './assets/scripts/components/Screen.svelte';
// @ts-ignore
import Remote from './assets/scripts/components/Remote.svelte';
// @ts-ignore
import HeaderControls from './assets/scripts/components/HeaderControls.svelte';
// @ts-ignore
import SpaceTrigger from './assets/scripts/components/SpaceTrigger.svelte';
// @ts-ignore
import { raf } from './assets/scripts/modules/utils.js';
// @ts-ignore
import { screenEl } from './assets/scripts/modules/tv.js';
// @ts-ignore
import { initTextNav } from './assets/scripts/modules/textNav.js';
// @ts-ignore
import { initHotkeys } from './assets/scripts/modules/keyboard.js';
// @ts-ignore
import { initLinks } from './assets/scripts/modules/links.js';

const bootstrap = () => {
  raf(() => {
    initTextNav();
    initHotkeys();
    initLinks();

    new TVScreen({ target: screenEl });

    new Remote({ target: document.querySelector('.js-remote') });

    new HeaderControls({
      target: document.querySelector('.js-header-controls'),
    });

    new SpaceTrigger({
      target: document.querySelector('.js-space-trigger'),
    });
  });
};

if (document.readyState !== 'interactive') {
  window.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

export default bootstrap;