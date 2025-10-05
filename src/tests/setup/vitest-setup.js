// Polyfill ResizeObserver for jsdom test environment
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  class ResizeObserver {
    constructor(callback) {
      this.callback = callback
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver
  // eslint-disable-next-line no-undef
  global.ResizeObserver = ResizeObserver
}
