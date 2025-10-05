import { Router } from '@vaadin/router'
import { LitElement, html, css, unsafeCSS } from 'lit'

import { employeeFields } from '@/data/constants.js'
import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import { employeeStore } from '@/store/index.js'
import rawStyles from '@/styles/pages/employees-page/employees-page.scss?inline'
import { t } from '@/utils/localization.js'

import '@/components/table-element.js'
import './components/employee-card.js'
import '@/components/pagination-element.js'
import '@/components/icon-element.js'
import '@/components/no-content-element.js'

export class EmployeesPage extends LocalizedMixin(LitElement) {
  static properties = {
    employees: { type: Array },
    columns: { type: Array },
    view: { type: String }, // 'list' | 'grid'
    page: { type: Number },
    pageSize: { type: Number },
    pendingDelete: { type: Object, state: true },
    isMobile: { type: Boolean, state: true },
    selectedRows: { type: Array, state: true },
  }

  // Pagination settings for this page
  get paginationSettings() {
    return {
      defaultPageSize: 10,
      mobilePageSize: 6,
      gridPageSize: 4,
    }
  }

  get _start() {
    return (this.page - 1) * this.pageSize
  }
  get _end() {
    return this._start + this.pageSize
  }
  get _pagedEmployees() {
    return this.employees.slice(this._start, this._end)
  }

  get _hasEmployees() {
    return this.employees.length > 0
  }

  _onPaginate(e) {
    const { page, pageSize } = e.detail
    this.page = page
    this.pageSize = pageSize
  }

  _setView(next) {
    if (this.view !== next) {
      this.view = next
      this.page = 1
      this.pageSize =
        next === 'grid'
          ? this.paginationSettings.gridPageSize
          : this.paginationSettings.defaultPageSize
    }
  }

  _checkMobile() {
    const wasMobile = this.isMobile
    this.isMobile = window.innerWidth < 768

    // If switching to mobile, force grid view
    if (this.isMobile && !wasMobile) {
      this.view = 'grid'
      this.page = 1
      this.pageSize = 4
    }
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
  `

  constructor() {
    super()
    this.employees = []
    this.columns = employeeFields
    this.view = 'list'
    this.page = 1
    this.pageSize = this.paginationSettings.defaultPageSize
    this.pendingDelete = null
    this.isMobile = false
    this.selectedRows = []
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('employees')) {
      // Check if current page has data after data changes
      this._checkPageAfterDataChange()
    }
  }

  connectedCallback() {
    super.connectedCallback()
    // Subscribe to store updates
    this._unsubscribe = employeeStore.subscribe(state => {
      this.employees = state.employees
    })
    // Initialize once on attach
    this.employees = employeeStore.getState().employees

    // Check if mobile on mount and set up resize listener
    this._checkMobile()
    this._resizeObserver = new ResizeObserver(() => this._checkMobile())
    this._resizeObserver.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this._unsubscribe) this._unsubscribe()
    if (this._resizeObserver) this._resizeObserver.disconnect()
  }

  _handleEdit(_event) {
    const { row } = _event.detail
    const url = new URL(window.location.href)
    const locale = url.searchParams.get('locale') || 'en'
    Router.go(`/form/${row.id}?locale=${locale}`)
  }

  _handleDelete(event) {
    const { row, index } = event.detail
    this.pendingDelete = { row, index }

    window.dispatchEvent(
      new CustomEvent('modal:show', {
        detail: {
          title: t('areYouSure'),
          content: `${t('selectedEmployeeRecord')} ${row?.firstName ?? ''} ${
            row?.lastName ?? ''
          } ${t('willBeDeleted')}`,
          onAccept: () => this._confirmDelete(),
        },
      })
    )
  }

  _confirmDelete() {
    const { row } = this.pendingDelete || {}

    if (row?.id) {
      employeeStore.getState().deleteEmployee(row.id)
    }

    this.pendingDelete = undefined

    const name = [row?.firstName, row?.lastName].filter(Boolean).join(' ')
    const message = name ? `${t('recordDeleted')}: ${name}` : t('recordDeleted')
    window.dispatchEvent(
      new CustomEvent('toast:show', {
        detail: { message, variant: 'success', duration: 2000 },
      })
    )
  }

  _handleRowSelection(event) {
    const { id, isChecked, isSelectAll } = event.detail

    if (isSelectAll) {
      if (isChecked) {
        const currentPageIds = this._pagedEmployees.map(emp => emp.id)
        this.selectedRows = [...new Set([...this.selectedRows, ...currentPageIds])]
      } else {
        const currentPageIds = this._pagedEmployees.map(emp => emp.id)
        this.selectedRows = this.selectedRows.filter(id => !currentPageIds.includes(id))
      }
    } else {
      if (isChecked) {
        if (!this.selectedRows.includes(id)) {
          this.selectedRows = [...this.selectedRows, id]
        }
      } else {
        this.selectedRows = this.selectedRows.filter(selectedId => selectedId !== id)
      }
    }
  }

  _handleBulkDelete() {
    if (this.selectedRows.length > 0) {
      window.dispatchEvent(
        new CustomEvent('modal:show', {
          detail: {
            title: t('areYouSure'),
            content: `${this.selectedRows.length} ${t('selectedEmployeesWillBeDeleted')}`,
            onAccept: () => this._confirmBulkDelete(),
          },
        })
      )
    }
  }

  _confirmBulkDelete() {
    this.selectedRows.forEach(id => {
      employeeStore.getState().deleteEmployee(id)
    })

    this.selectedRows = []

    window.dispatchEvent(
      new CustomEvent('toast:show', {
        detail: {
          message: t('recordsDeleted'),
          variant: 'success',
          duration: 2000,
        },
      })
    )
  }

  _checkPageAfterDataChange() {
    const totalPages = Math.ceil(this.employees.length / this.pageSize)

    if (this.page > totalPages && this.page > 1) {
      this.page = Math.max(1, totalPages)
    }
  }

  _handleEditFromCard(e) {
    const employee = e.detail?.employee
    if (employee?.id) {
      const url = new URL(window.location.href)
      const locale = url.searchParams.get('locale') || 'en'
      Router.go(`/form/${employee.id}?locale=${locale}`)
    }
  }

  _handleDeleteFromCard(e) {
    const employee = e.detail?.employee
    if (employee?.id) {
      this.pendingDelete = { row: employee, index: null }

      window.dispatchEvent(
        new CustomEvent('modal:show', {
          detail: {
            title: t('areYouSure'),
            content: `${t('selectedEmployeeRecord')} ${employee?.firstName ?? ''} ${
              employee?.lastName ?? ''
            } ${t('willBeDeleted')}`,
            onAccept: () => this._confirmDelete(),
          },
        })
      )
    }
  }

  _handleAddFirstEmployee() {
    const url = new URL(window.location.href)
    const locale = url.searchParams.get('locale') || 'en'
    Router.go(`/form?locale=${locale}`)
  }

  render() {
    return html`
      <div class="employees-page">
        <div class="employees-page__header">
          <h1 class="employees-page__title">${t('employeeList')}</h1>
          ${!this.isMobile
            ? html`
                <div class="employees-page__actions">
                  ${this.selectedRows.length > 0 && this.view === 'list'
                    ? html`
                        <button-element
                          icon="trash"
                          variant="ghost"
                          @click=${this._handleBulkDelete}
                        >
                          ${t('deleteSelected')} (${this.selectedRows.length})
                        </button-element>
                      `
                    : ''}
                  <button-element
                    variant="ghost"
                    shape="circle"
                    @click=${() => this._setView('list')}
                  >
                    <icon-element
                      name="menu"
                      size="30"
                      colorType=${this.view === 'list' ? 'orange' : 'orange-pale'}
                    ></icon-element>
                  </button-element>
                  <button-element
                    variant="ghost"
                    shape="circle"
                    @click=${() => this._setView('grid')}
                  >
                    <icon-element
                      name="grid"
                      size="30"
                      colorType=${this.view === 'grid' ? 'orange' : 'orange-pale'}
                    ></icon-element>
                  </button-element>
                </div>
              `
            : ''}
        </div>

        <div class="employees-page__content">
          ${!this._hasEmployees
            ? html`
                <no-content-element
                  icon="user"
                  showAction
                  @action=${this._handleAddFirstEmployee}
                ></no-content-element>
              `
            : this.isMobile || this.view === 'grid'
              ? html`
                  <div
                    class="employee-grid"
                    @edit=${e => this._handleEditFromCard(e)}
                    @delete=${e => this._handleDeleteFromCard(e)}
                  >
                    ${this._pagedEmployees
                      .slice(
                        0,
                        this.isMobile
                          ? this.paginationSettings.mobilePageSize
                          : this.paginationSettings.gridPageSize
                      )
                      .map(emp => html`<employee-card .employee=${emp}></employee-card>`)}
                  </div>
                  <div class="employees-page__pagination">
                    <pagination-element
                      .page=${this.page}
                      .pageSize=${this.isMobile
                        ? this.paginationSettings.mobilePageSize
                        : this.paginationSettings.gridPageSize}
                      .total=${this.employees.length}
                      @paginate=${e =>
                        this._onPaginate({
                          detail: {
                            page: e.detail.page,
                            pageSize: this.isMobile
                              ? this.paginationSettings.mobilePageSize
                              : this.paginationSettings.gridPageSize,
                          },
                        })}
                    ></pagination-element>
                  </div>
                `
              : html`
                  <table-element
                    .data=${this._pagedEmployees}
                    .columns=${this.columns}
                    .selectedRows=${this.selectedRows}
                    selectable
                    @edit=${this._handleEdit}
                    @delete=${this._handleDelete}
                    @row-selection=${this._handleRowSelection}
                  ></table-element>
                  <div class="employees-page__pagination">
                    <pagination-element
                      .page=${this.page}
                      .pageSize=${this.pageSize}
                      .total=${this.employees.length}
                      @paginate=${e => this._onPaginate(e)}
                    ></pagination-element>
                  </div>
                `}
        </div>
      </div>
    `
  }
}

customElements.define('employees-page', EmployeesPage)
