import { LitElement, html, css, unsafeCSS } from 'lit'

import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import rawStyles from '@/styles/components/no-content-element.scss?inline'
import { t } from '@/utils/localization.js'

import '@/components/icon-element.js'

export class NoContentElement extends LocalizedMixin(LitElement) {
  static properties = {
    title: { type: String },
    message: { type: String },
    icon: { type: String },
    showAction: { type: Boolean },
    actionText: { type: String },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.title = ''
    this.message = ''
    this.icon = 'user'
    this.showAction = false
    this.actionText = ''
  }

  _handleAction() {
    this.dispatchEvent(
      new window.CustomEvent('action', {
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    return html`
      <div class="no-content">
        <div class="no-content__icon">
          <icon-element name=${this.icon} size="64" colorType="orange-pale"></icon-element>
        </div>
        <div class="no-content__content">
          <h3 class="no-content__title">${this.title || t('noEmployees')}</h3>
          <p class="no-content__message">${this.message || t('noEmployeesMessage')}</p>
          ${this.showAction
            ? html`
                <button-element variant="primary" @click=${this._handleAction}>
                  ${this.actionText || t('addFirstEmployee')}
                </button-element>
              `
            : ''}
        </div>
      </div>
    `
  }
}

customElements.define('no-content-element', NoContentElement)
