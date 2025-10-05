import { LitElement, html, css, unsafeCSS } from 'lit'

import { employeeFields } from '@/data/constants.js'
import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import rawStyles from '@/styles/components/table-element.scss?inline'
import { t } from '@/utils/localization.js'

import '@/components/button-element.js'
import '@/components/checkbox-element.js'
import '@/components/icon-element.js'

export class TableElement extends LocalizedMixin(LitElement) {
  static properties = {
    data: { type: Array },
    columns: { type: Array },
    selectable: { type: Boolean },
    selectedRows: { type: Array },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.data = []
    this.columns = employeeFields
    this.selectable = false
    this.selectedRows = []
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('data')) {
      this.requestUpdate()
    }
  }

  _handleSelectAll(e) {
    const isChecked = e.detail.checked
    this._dispatchRowSelection(null, isChecked, true)
  }

  _handleRowSelect(e, index) {
    const isChecked = e.detail.checked
    const rowId = this.data[index]?.id
    this._dispatchRowSelection(rowId, isChecked, false)
  }

  _isAllSelected() {
    if (this.data.length === 0) return false

    const currentPageIds = this.data.map(row => row.id)
    return currentPageIds.every(id => this.selectedRows?.includes(id) || false)
  }

  _handleEdit(row, index) {
    this.dispatchEvent(
      new window.CustomEvent('edit', {
        detail: { row, index },
        bubbles: true,
        composed: true,
      })
    )
  }

  _handleDelete(row, index) {
    this.dispatchEvent(
      new window.CustomEvent('delete', {
        detail: { row, index },
        bubbles: true,
        composed: true,
      })
    )
  }

  _dispatchRowSelection(id, isChecked, isSelectAll) {
    this.dispatchEvent(
      new window.CustomEvent('row-selection', {
        detail: { id, isChecked, isSelectAll },
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    return html`
      <div class="table-container">
        <table class="table">
          <thead class="table__header">
            <tr class="table__header-row">
              ${this.selectable
                ? html`
                    <th class="table__header-cell table__header-cell--checkbox">
                      <checkbox-element
                        class="table__checkbox table__checkbox--header"
                        @change=${this._handleSelectAll}
                        .checked=${this._isAllSelected()}
                      ></checkbox-element>
                    </th>
                  `
                : ''}
              ${this.columns.map(
                column => html` <th class="table__header-cell">${t(column)}</th> `
              )}
              <th class="table__header-cell table__header-cell--actions">${t('actions')}</th>
            </tr>
          </thead>
          <tbody class="table__body">
            ${this.data.map(
              (row, index) => html`
                <tr class="table__row">
                  ${this.selectable
                    ? html`
                        <td class="table__cell table__cell--checkbox">
                          <checkbox-element
                            class="table__checkbox"
                            .checked=${this.selectedRows?.includes(row.id) || false}
                            @change=${e => this._handleRowSelect(e, index)}
                          ></checkbox-element>
                        </td>
                      `
                    : ''}
                  ${this.columns.map(
                    column => html`
                      <td
                        class="table__cell ${column === 'firstName' || column === 'lastName'
                          ? 'table__cell--name'
                          : ''}"
                      >
                        ${column === 'position' ? t(row[column]) : row[column]}
                      </td>
                    `
                  )}
                  <td class="table__cell table__cell--actions">
                    <div class="table__actions">
                      <button-element
                        variant="ghost"
                        colorType="orange"
                        icon="edit"
                        justIcon
                        @click=${() => this._handleEdit(row, index)}
                      ></button-element>
                      <button-element
                        variant="ghost"
                        icon="trash"
                        justIcon
                        @click=${() => this._handleDelete(row, index)}
                      ></button-element>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `
  }
}

customElements.define('table-element', TableElement)
