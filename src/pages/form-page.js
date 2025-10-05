import { Router } from '@vaadin/router'
import { LitElement, html, css, unsafeCSS } from 'lit'

import { positionOptions } from '@/data/constants.js'
import { LocalizedMixin } from '@/mixins/localized-mixin.js'
import { employeeStore } from '@/store/index.js'
import rawStyles from '@/styles/pages/form-page.scss?inline'
import { dateUtils } from '@/utils/date.js'
import { t } from '@/utils/localization.js'
import { validateForm, validateFieldWithErrors } from '@/utils/validation.js'

import '@/components/button-element.js'
import '@/components/input-element.js'
import '@/components/dropdown-element.js'

export class FormPage extends LocalizedMixin(LitElement) {
  static properties = {
    form: { type: Object },
    mode: { type: String },
    errors: { type: Object, state: true },
    isValid: { type: Boolean, state: true },
    isSubmitting: { type: Boolean, state: true },
  }

  static styles = css`
    ${unsafeCSS(rawStyles)}
    :host {
      display: block;
    }
  `

  constructor() {
    super()
    this.form = {}
    this.mode = 'add'
    this.errors = {}
    this.isValid = false
    this.isSubmitting = false
  }

  async _validateForm() {
    const result = await validateForm(this.form)
    this.errors = result.errors
    this.isValid = result.isValid
    return result.isValid
  }

  async _validateField(fieldName, value) {
    const result = await validateFieldWithErrors(fieldName, value, this.errors)
    this.errors = result.errors
    return result.isValid
  }

  _convertDateForInput(dateString) {
    return dateUtils.convertDateForInput(dateString)
  }

  _convertDateForStorage(dateString) {
    return dateUtils.convertDateForStorage(dateString)
  }

  connectedCallback() {
    super.connectedCallback()
    const match = this._paramsFromUrl()
    const id = match?.id ?? null
    if (id) {
      this.mode = 'edit'
      const found = employeeStore.getState().getById(id)
      if (found) {
        this.form = {
          ...found,
          dateOfEmployment: this._convertDateForInput(found.dateOfEmployment),
          dateOfBirth: this._convertDateForInput(found.dateOfBirth),
        }
      }
    } else {
      this.mode = 'add'
      this.form = {
        firstName: '',
        lastName: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        department: '',
        position: '',
      }
    }
  }

  _paramsFromUrl() {
    const parts = window.location.pathname.split('/')
    if (parts[1] === 'form' && parts[2]) return { id: parts[2] }
    return undefined
  }

  _goBack() {
    const url = new URL(window.location.href)
    const locale = url.searchParams.get('locale') || 'en'
    Router.go(`/?locale=${locale}`)
  }

  async _save(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()

    if (this.isSubmitting) return

    this.isSubmitting = true

    const isValid = await this._validateForm()
    if (!isValid) {
      this.isSubmitting = false
      window.dispatchEvent(
        new CustomEvent('toast:show', {
          detail: {
            message: t('pleaseFixErrors'),
            variant: 'error',
            duration: 3000,
          },
        })
      )
      return
    }

    const state = employeeStore.getState()
    let action = 'created'

    const formData = {
      ...this.form,
      dateOfEmployment: this._convertDateForStorage(this.form.dateOfEmployment),
      dateOfBirth: this._convertDateForStorage(this.form.dateOfBirth),
    }

    try {
      if (this.mode === 'edit' && this.form?.id) {
        state.updateEmployee(this.form.id, formData)
        action = 'updated'
      } else {
        const { id: _omit, ...payload } = formData
        state.addEmployee(payload)
        action = 'created'
      }

      const name = [this.form.firstName, this.form.lastName].filter(Boolean).join(' ')
      let message
      if (action === 'updated') {
        message = `${t('recordUpdated')}: ${name}`
      } else {
        message = `${t('recordCreated')}: ${name}`
      }

      window.dispatchEvent(
        new CustomEvent('toast:show', {
          detail: { message, variant: 'success', duration: 2500 },
        })
      )
      this._goBack()
    } catch (error) {
      console.error('Error saving employee:', error)
      window.dispatchEvent(
        new CustomEvent('toast:show', {
          detail: {
            message: t('errorSavingEmployee'),
            variant: 'error',
            duration: 3000,
          },
        })
      )
    } finally {
      this.isSubmitting = false
    }
  }

  render() {
    const title = this.mode === 'edit' ? t('editEmployee') : t('addEmployee')
    return html`
      <div class="form-page">
        <div class="form-page__header">
          <h1 class="form-page__title">${title}</h1>
        </div>
        <form>
          <div class="form-page__grid">
            <input-element
              label=${t('firstName')}
              .value=${this.form.firstName || ''}
              error=${this.errors.firstName?.[0] || ''}
              required
              @change=${e => {
                this.form = { ...this.form, firstName: e.detail?.value || e.target.value }
                this._validateField('firstName', e.detail?.value || e.target.value)
              }}
            ></input-element>
            <input-element
              label=${t('lastName')}
              .value=${this.form.lastName || ''}
              error=${this.errors.lastName?.[0] || ''}
              required
              @change=${e => {
                this.form = { ...this.form, lastName: e.detail?.value || e.target.value }
                this._validateField('lastName', e.detail?.value || e.target.value)
              }}
            ></input-element>
            <input-element
              label=${t('dateOfEmployment')}
              type="date"
              .value=${this.form.dateOfEmployment || ''}
              error=${this.errors.dateOfEmployment?.[0] || ''}
              required
              @input=${e => {
                this.form = { ...this.form, dateOfEmployment: e.detail?.value || e.target.value }
              }}
              @change=${e => {
                this.form = { ...this.form, dateOfEmployment: e.detail?.value || e.target.value }
                this._validateField('dateOfEmployment', e.detail?.value || e.target.value)
              }}
            ></input-element>

            <input-element
              label=${t('dateOfBirth')}
              type="date"
              .value=${this.form.dateOfBirth || ''}
              error=${this.errors.dateOfBirth?.[0] || ''}
              required
              @input=${e =>
                (this.form = { ...this.form, dateOfBirth: e.detail?.value || e.target.value })}
              @change=${e => {
                this.form = { ...this.form, dateOfBirth: e.detail?.value || e.target.value }
                this._validateField('dateOfBirth', e.detail?.value || e.target.value)
              }}
            ></input-element>
            <input-element
              label=${t('phone')}
              type="tel"
              .value=${this.form.phone || ''}
              error=${this.errors.phone?.[0] || ''}
              required
              @change=${e => {
                this.form = { ...this.form, phone: e.detail?.value || e.target.value }
                this._validateField('phone', e.detail?.value || e.target.value)
              }}
            ></input-element>
            <input-element
              label=${t('email')}
              type="email"
              .value=${this.form.email || ''}
              error=${this.errors.email?.[0] || ''}
              required
              @change=${e => {
                this.form = { ...this.form, email: e.detail?.value || e.target.value }
                this._validateField('email', e.detail?.value || e.target.value)
              }}
            ></input-element>

            <input-element
              label=${t('department')}
              .value=${this.form.department || ''}
              error=${this.errors.department?.[0] || ''}
              required
              @change=${e => {
                this.form = { ...this.form, department: e.detail?.value || e.target.value }
                this._validateField('department', e.detail?.value || e.target.value)
              }}
            ></input-element>
            <dropdown-element
              label=${t('position')}
              .value=${this.form.position || ''}
              error=${this.errors.position?.[0] || ''}
              required
              .options=${positionOptions.map(option => ({
                value: option,
                label: t(option),
              }))}
              @change=${e => {
                this.form = { ...this.form, position: e.detail?.value || e.target.value }
                this._validateField('position', e.detail?.value || e.target.value)
              }}
            ></dropdown-element>
          </div>

          <div class="form-page__actions">
            <button-element
              type="button"
              ?disabled=${this.isSubmitting}
              @click=${e => this._save(e)}
            >
              ${this.isSubmitting ? t('saving') : t('save')}
            </button-element>
            <button-element variant="secondary" @click=${() => this._goBack()}>
              ${t('cancel')}
            </button-element>
          </div>
        </form>
      </div>
    `
  }
}

customElements.define('form-page', FormPage)
