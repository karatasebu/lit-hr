import { LitElement, html, css, unsafeCSS } from 'lit'

import { employeeFields } from '@/data/constants.js'
import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import rawStyles from '@/styles/pages/employees-page/components/employee-card.scss?inline'
import { t } from '@/utils/localization.js'

import '@/components/button-element.js'

export class EmployeeCard extends LocalizedMixin(LitElement) {
  static properties = {
    employee: { type: Object },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
  }

  _edit() {
    this.dispatchEvent(
      new window.CustomEvent('edit', {
        detail: { employee: this.employee },
        bubbles: true,
        composed: true,
      })
    )
  }
  _delete() {
    this.dispatchEvent(
      new window.CustomEvent('delete', {
        detail: { employee: this.employee },
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    const e = this.employee ?? {}

    const fieldRows = []
    for (let i = 0; i < employeeFields.length; i += 2) {
      fieldRows.push(employeeFields.slice(i, i + 2))
    }

    return html`
      <div class="employee-card">
        ${fieldRows.map(
          row => html`
            <div class="employee-card__row">
              ${row.map(
                field => html`
                  <div class="employee-card__field">
                    <span>${`${t(field)}:`}</span>
                    <strong>${field === 'position' ? t(e[field]) : e[field]}</strong>
                  </div>
                `
              )}
            </div>
          `
        )}
        <div class="employee-card__actions">
          <button-element type="button" icon="edit" @click=${() => this._edit()}>
            ${t('edit')}
          </button-element>
          <button-element variant="secondary" icon="trash" @click=${() => this._delete()}>
            ${t('delete')}
          </button-element>
        </div>
      </div>
    `
  }
}

customElements.define('employee-card', EmployeeCard)
