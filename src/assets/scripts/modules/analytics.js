export function sendEvent({ type, label, value }) {
    // @ts-ignore
    if (!window.panelbear) return;
  
    // @ts-ignore
    window.panelbear('track', [type, label, value].filter(Boolean).join('.'));
  }
  