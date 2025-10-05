import { LitElement, html, css, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import rawStyles from '@/styles/components/checkbox-element.scss?inline'

export class CheckboxElement extends LitElement {
  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: { type: String },
    id: { type: String },
    size: { type: String },
    variant: { type: String },
    label: { type: String },
    error: { type: String },
    hasError: { type: Boolean, state: true },
    value: { type: String },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.checked = false
    this.size = 'md'
    this.variant = 'default'
    this.hasError = false
    this.value = ''
  }

  updated(changedProperties) {
    super.updated(changedProperties)
    if (changedProperties.has('error')) {
      this.hasError = !!this.error
    }
  }

  // Handle change events
  _handleChange(e) {
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    const isChecked = e.target.checked
    this.checked = isChecked

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          checked: isChecked,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle click events
  _handleClick(e) {
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    this.dispatchEvent(
      new CustomEvent('click', {
        detail: {
          checked: this.checked,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle focus events
  _handleFocus(e) {
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    this.dispatchEvent(
      new CustomEvent('focus', {
        detail: {
          checked: this.checked,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle blur events
  _handleBlur(e) {
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    this.dispatchEvent(
      new CustomEvent('blur', {
        detail: {
          checked: this.checked,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    const variant = this.variant || 'default'
    const size = this.size || 'md'
    const disabled = this.disabled
    const required = this.required
    const name = this.name
    const id = this.id
    const label = this.label
    const error = this.error
    const hasError = this.hasError
    const value = this.value

    return html`
      <div class="checkbox-container">
        <input
          class="checkbox --${variant} --${size} ${hasError ? '--error' : ''}"
          type="checkbox"
          name=${ifDefined(name)}
          id=${ifDefined(id)}
          value=${ifDefined(value)}
          .checked=${this.checked}
          ?disabled=${disabled}
          ?required=${required}
          @change=${this._handleChange}
          @click=${this._handleClick}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        />
        ${label
          ? html`<label class="checkbox__label" for=${ifDefined(id)}
              >${label}${required ? html`<span class="checkbox__required"> *</span>` : ''}</label
            >`
          : ''}
      </div>
      ${error ? html`<div class="checkbox__error">${error}</div>` : ''}
    `
  }
}

customElements.define('checkbox-element', CheckboxElement)
