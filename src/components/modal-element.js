import { LitElement, html, css, unsafeCSS } from 'lit'

import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import rawStyles from '@/styles/components/modal-element.scss?inline'
import { t } from '@/utils/localization.js'

import '@/components/icon-element.js'
import '@/components/button-element.js'

export class ModalElement extends LocalizedMixin(LitElement) {
  static properties = {
    open: { type: Boolean, reflect: true },
    title: { type: String },
    width: { type: String },
    preventOutsideClose: { type: Boolean, attribute: 'prevent-outside-close' },
    content: { type: String },
    onAccept: { type: Function },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.open = false
    this.title = ''
    this.width = '420px'
    this.preventOutsideClose = false
    this.content = ''
    this.onAccept = undefined
    this._onShow = e => this._handleShow(e)
  }

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('modal:show', this._onShow)
  }

  disconnectedCallback() {
    window.removeEventListener('modal:show', this._onShow)
    super.disconnectedCallback()
  }

  _handleShow(e) {
    const {
      title,
      content,
      width = '380px',
      preventOutsideClose = false,
      onAccept,
    } = e.detail || {}
    this.title = title || ''
    this.content = content || ''
    this.width = width
    this.preventOutsideClose = preventOutsideClose
    this.onAccept = onAccept
    this.open = true
  }

  _onBackdropClick(e) {
    if (this.preventOutsideClose) return
    if (e.target.classList.contains('modal__backdrop')) this._close()
  }

  _close() {
    this.open = false
    this.dispatchEvent(
      new window.CustomEvent('close', {
        bubbles: true,
        composed: true,
      })
    )
  }

  _accept() {
    try {
      if (typeof this.onAccept === 'function') {
        this.onAccept()
      }
    } finally {
      this._close()
    }
  }

  render() {
    if (!this.open) return html``
    return html`
      <div class="modal__backdrop" @click=${e => this._onBackdropClick(e)}>
        <div
          class="modal"
          style=${unsafeCSS(`max-width:${this.width};`)}
          role="dialog"
          aria-modal="true"
        >
          <div class="modal__header">
            <h3 class="modal__title">${this.title}</h3>
            <button-element
              justIcon
              size="lg"
              variant="ghost"
              colorType="orange"
              icon="close"
              @click=${() => this._close()}
            ></button-element>
          </div>
          <div class="modal__content">${this.content}</div>

          <div class="modal__footer">
            <button-element type="button" @click=${() => this._accept()}>
              ${t('proceed')}
            </button-element>
            <button-element variant="secondary" @click=${() => this._close()}>
              ${t('cancel')}
            </button-element>
          </div>
        </div>
      </div>
    `
  }
}

customElements.define('modal-element', ModalElement)
