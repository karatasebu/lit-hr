import { onLocaleChange, offLocaleChange } from '@/utils/localization.js'

/**
 * Mixin that provides reactive localization for Lit components
 */
export const LocalizedMixin = superClass => {
  return class extends superClass {
    constructor() {
      super()
      this._localeChangeListener = () => {
        this.requestUpdate()
      }
    }

    connectedCallback() {
      super.connectedCallback()
      onLocaleChange(this._localeChangeListener)
    }

    disconnectedCallback() {
      super.disconnectedCallback()
      offLocaleChange(this._localeChangeListener)
    }
  }
}
