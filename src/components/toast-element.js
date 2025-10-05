import { LitElement, html, css, unsafeCSS } from 'lit'

import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import rawStyles from '@/styles/components/toast-element.scss?inline'

import '@/components/button-element.js'
import '@/components/icon-element.js'

export class ToastElement extends LocalizedMixin(LitElement) {
  static properties = {
    open: { type: Boolean, reflect: true },
    message: { type: String },
    variant: { type: String },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.open = false
    this.message = ''
    this.variant = 'success'
    this._hideTimer = undefined
    this._onShow = e => this._handleShow(e)
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('toast:show', this._onShow)
  }

  disconnectedCallback() {
    window.removeEventListener('toast:show', this._onShow)
    super.disconnectedCallback()
  }

  _handleShow(e) {
    const { message, variant = 'success', duration = 2500 } = e.detail || {}
    this.message = message || ''
    this.variant = variant
    this.open = true
    clearTimeout(this._hideTimer)
    this._hideTimer = setTimeout(() => {
      this.open = false
    }, duration)
  }

  render() {
    const classes = ['toast', this.open ? '--open' : '', `--${this.variant}`]
      .filter(Boolean)
      .join(' ')

    return html`
      <div class="${classes}" role="status" aria-live="polite">
        <span class="toast__message">${this.message}</span>
        <button-element
          variant="ghost"
          justIcon
          icon="close"
          @click=${() => (this.open = false)}
        ></button-element>
      </div>
    `
  }
}

customElements.define('toast-element', ToastElement)
