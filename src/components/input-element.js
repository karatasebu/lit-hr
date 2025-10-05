import { LitElement, html, css, unsafeCSS } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'

import rawStyles from '@/styles/components/input-element.scss?inline'

export class InputElement extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    type: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: { type: String },
    id: { type: String },
    size: { type: String },
    variant: { type: String },
    label: { type: String },
    error: { type: String },
    hasError: { type: Boolean, state: true },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.type = 'text'
    this.size = 'md'
    this.variant = 'default'
    this.value = ''
    this.hasError = false
    this._isPickerOpen = false
  }

  updated(changedProperties) {
    super.updated(changedProperties)
    if (changedProperties.has('error')) {
      this.hasError = !!this.error
    }
  }

  // Handle input events - fires on every keystroke
  _handleInput(e) {
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    const newValue = e.target.value
    this.value = newValue

    // Dispatch custom input event with the new value
    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle change events - fires when input loses focus and value has changed
  _handleChange(e) {
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    const newValue = e.target.value
    this.value = newValue

    // Dispatch custom change event with the new value
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: newValue },
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
        detail: { value: e.target.value },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle blur events
  _handleBlur(e) {
    if (this.type === 'date') {
      this._isPickerOpen = false
    }
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    this.dispatchEvent(
      new CustomEvent('blur', {
        detail: { value: e.target.value },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle keydown events for special keys
  _handleKeydown(e) {
    // Allow Enter key to trigger change event
    if (e.key === 'Enter') {
      this._handleChange(e)
    }

    this.dispatchEvent(
      new CustomEvent('keydown', {
        detail: {
          value: e.target.value,
          key: e.key,
          keyCode: e.keyCode,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle keyup events
  _handleKeyup(e) {
    this.dispatchEvent(
      new CustomEvent('keyup', {
        detail: {
          value: e.target.value,
          key: e.key,
          keyCode: e.keyCode,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Handle paste events
  _handlePaste(e) {
    // Let the paste complete, then handle the input
    setTimeout(() => {
      this._handleInput(e)
    }, 0)
  }

  // Handle cut events
  _handleCut(e) {
    // Let the cut complete, then handle the input
    setTimeout(() => {
      this._handleInput(e)
    }, 0)
  }

  // Handle select events
  _handleSelect(e) {
    if (e) {
      e.stopPropagation()
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation()
    }
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  // Open native datepicker on click when type is date
  _handleClick(e) {
    if (this.type === 'date') {
      const input = e.target
      if (this._isPickerOpen) {
        input.blur()
        this._isPickerOpen = false
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (typeof input?.showPicker === 'function') {
        input.showPicker()
        this._isPickerOpen = true
      } else {
        input.focus()
      }
    }
  }

  render() {
    const variant = this.variant || 'default'
    const size = this.size || 'md'
    const type = this.type || 'text'
    const placeholder = this.placeholder
    const disabled = this.disabled
    const required = this.required
    const name = this.name
    const id = this.id
    const label = this.label
    const error = this.error
    const hasError = this.hasError

    return html`
      ${label
        ? html`<label class="input__label" for=${ifDefined(id)}
            >${label}${required ? html`<span class="input__required"> *</span>` : ''}</label
          >`
        : ''}
      <input
        class="input --${variant} --${size} ${hasError ? '--error' : ''}"
        type=${ifDefined(type)}
        placeholder=${ifDefined(placeholder)}
        name=${ifDefined(name)}
        id=${ifDefined(id)}
        .value=${this.value || ''}
        ?disabled=${disabled}
        ?required=${required}
        @input=${this._handleInput}
        @change=${this._handleChange}
        @focus=${this._handleFocus}
        @blur=${this._handleBlur}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
        @keyup=${this._handleKeyup}
        @paste=${this._handlePaste}
        @cut=${this._handleCut}
        @select=${this._handleSelect}
      />
      ${error ? html`<div class="input__error">${error}</div>` : ''}
    `
  }
}

customElements.define('input-element', InputElement)
