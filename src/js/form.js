import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import formData from '../form-data.json'

import { $, appendTo, createElement } from './dom-utils'

const createTitle = () => {
  const h2 = createElement('h2', { className: 'titre-2', innerHTML: 'Remplissez en ligne votre déclaration numérique : ' })
  const p = createElement('p', { className: 'msg-info', innerHTML: 'Tous les champs sont obligatoires.' })
  return [h2, p]
}

const createFormGroup = ({
  autocomplete = false,
  autofocus = false,
  inputmode,
  label,
  max,
  min,
  maxlength,
  minlength,
  name,
  pattern,
  placeholder = '',
  type = 'text',
}) => {
  const formGroup = createElement('div', { className: 'form-group' })
  const labelAttrs = {
    for: `field-${name}`,
    id: `field-${name}-label`,
    innerHTML: label,
  }
  const labelEl = createElement('label', labelAttrs)

  const inputGroup = createElement('div', { className: 'input-group align-items-center' })
  const inputAttrs = {
    autocomplete,
    autofocus,
    className: 'form-control',
    id: `field-${name}`,
    inputmode,
    min,
    max,
    minlength,
    maxlength,
    name,
    pattern,
    placeholder,
    required: true,
    type,
  }

  const input = createElement('input', inputAttrs)

  const validityAttrs = {
    className: 'validity',
  }
  const validity = createElement('span', validityAttrs)

  const example = createElement('p', { className: 'exemple  basis-100' })

  const appendToFormGroup = appendTo(formGroup)
  appendToFormGroup(labelEl)
  appendToFormGroup(inputGroup)

  const appendToInputGroup = appendTo(inputGroup)
  appendToInputGroup(input)
  appendToInputGroup(validity)
  appendToInputGroup(example)

  return formGroup
}

const createReasonField = (reasonData, context) => {
  const formReasonAttrs = { className: 'form-checkbox align-items-center' }
  const formReason = createElement('div', formReasonAttrs)
  const appendToReason = appendTo(formReason)

  const id = `checkbox-${context}-${reasonData.code}`
  const inputReasonAttrs = {
    className: 'form-check-input',
    type: 'checkbox',
    id,
    name: 'field-reason',
    value: reasonData.code,
  }
  const inputReason = createElement('input', inputReasonAttrs)

  // const titleAttrs = { innerHTML: reasonData.title }
  // const title = createElement('h4', titleAttrs)
  // const labelAttrs = { innerHTML: reasonData.label, className: 'form-checkbox-label', for: id }
  // const label = createElement('label', labelAttrs)
  // const filtertitre = titreAttrs.filter(field => field !== undefined)

  if (reasonData.type === 'title') {
    const titleAttrs = { innerHTML: reasonData.label, className: 'group-reason' }
    const title = createElement('h5', titleAttrs)
    appendToReason([title])
  } else {
    const labelAttrs = { innerHTML: reasonData.label, className: 'form-checkbox-label', for: id }
    const label = createElement('label', labelAttrs)
    appendToReason([inputReason, label])
  }
  // appendToReason([inputReason, title, label])
  // console.log(reasonData.type)
  // appendToReason(reasonData.title ? [inputReason, title, label] : [inputReason, label])
  return formReason
}

const createReasonFieldset = (reasonsData, sanitaryContextData) => {
  const fieldsetAttrs = {
    id: 'curfew-reason-fieldset',
    className: 'fieldset  reason-fieldset',
  }

  const fieldset = createElement('fieldset', fieldsetAttrs)
  const appendToFieldset = appendTo(fieldset)

  const textSubscribeReasonAttrs = {
    innerHTML: 'Je certifie que mon déplacement est lié au motif suivant (cocher la case) autorisé par le décret n°2020-1310 du 29 octobre 2020 prescrivant les mesures générales nécessaires pour faire face à l\'épidémie de Covid19 dans le cadre de l\'état d\'urgence sanitaire  <a class="footnote" href="#footnote1">[1]</a>&nbsp;:',
  }
  const textSubscribeReason = createElement('p', textSubscribeReasonAttrs)

  const legendAttrs = {
    className: 'legend titre-3',
    innerHTML: 'Choisissez un motif de déplacement',
  }
  const legend = createElement('p', legendAttrs)

  const textAlertAttrs = { className: 'msg-alert hidden', innerHTML: 'Veuillez choisir un motif' }
  const textAlert = createElement('p', textAlertAttrs)

  const reasonsFields = reasonsData.items.map(createReasonField, reasonsData.key)

  appendToFieldset([textSubscribeReason, legend, textAlert, ...reasonsFields])
  // Créer un form-checkbox par motif
  return fieldset
}

const createReasonFieldsetQuarantine = (reasonsData) => {
  const fieldsetAttrs = {
    id: 'quarantine-reason-fieldset',
    className: 'fieldset  reason-fieldset',
  }

  const fieldset = createElement('fieldset', fieldsetAttrs)
  const appendToFieldset = appendTo(fieldset)

  const reasonsFields = reasonsData.items.map(createReasonField, reasonsData.key)

  appendToFieldset([...reasonsFields])
  // Créer un form-checkbox par motif
  return fieldset
}

export function createForm () {
  const form = $('#form-profile')
  // Évite de recréer le formulaire s'il est déjà créé par react-snap (ou un autre outil de prerender)
  if (form.innerHTML !== '') {
    return
  }

  const appendToForm = appendTo(form)

  const formFirstPart = formData
    .flat(1)
    .filter(field => field.key !== 'reason-curfew')
    .filter(field => field.key !== 'reason-quarantine')
    .filter(field => !field.isHidden)
    .map((field,
      index) => {
      const formGroup = createFormGroup({
        autofocus: index === 0,
        ...field,
        name: field.key,
      })

      return formGroup
    })

  const reasonsDataCurfew = formData
    .flat(1)
    .find(field => field.key === 'reason-curfew')

  const reasonsDataQuarantine = formData
    .flat(1)
    .find(field => field.key === 'reason-quarantine')

  const reasonFieldsetCurfew = createReasonFieldset(reasonsDataCurfew)
  const reasonFieldsetQuarantine = createReasonFieldsetQuarantine(reasonsDataQuarantine)
  const curfewButton = createElement('button', { type: 'button', className: 'curfew-button  context-button  btn', innerHTML: 'Couvre-feu  <br/> (19h-6h)' })
  // const curfewLink = document.createTextNode('Couvre-feu  (19h-6h)')
  // curfewButton.appendChild(curfewButton)
  const quarantineButton = createElement('button', { type: 'button', className: 'quarantine-button  context-button  btn', innerHTML: 'Journée <br/> (6h-19h)' })
  // const quarantineLink = document.createTextNode('Journée (6h-19h)')
  // quarantineButton.appendChild(quarantineButton)
  const buttonWrapper = createElement('div', { className: 'button-wrapper' })
  buttonWrapper.appendChild(curfewButton)
  buttonWrapper.appendChild(quarantineButton)
  const contextTitle = createElement('p', { className: 'context-title' })
  const contextTitleText = document.createTextNode('Choisissez un contexte')
  contextTitle.appendChild(contextTitleText)
  const contextSubtitle = createElement('p', { className: 'context-subtitle' })
  // const contextSubtitleText = document.createTextNode('* Le contexte "Week-end (6h-18h)" ne s\'applique qu\'aux territoires concernés par des dispositions spécifiques')
  // contextSubtitle.appendChild(contextSubtitleText)
  const contextWrapper = createElement('div', { className: 'context-wrapper' })
  contextWrapper.appendChild(contextTitle)
  contextWrapper.appendChild(contextSubtitle)
  contextWrapper.appendChild(buttonWrapper)
  const reasonFielsetWrapper = createElement('div', { className: 'fieldset-wrapper  hidden' })

  const quarantineSubtitle = createElement('div', { className: 'quarantine-subtitle  hidden' })
  const quarantineSubtitleText = document.createTextNode('J\'effectue un déplacement le week-end entre 06h00 et 19h00 sur un territoire soumis au confinement')
  quarantineSubtitle.appendChild(quarantineSubtitleText)
  const curfewSubtitle = createElement('div', { className: 'curfew-subtitle  hidden' })
  const curfewSubtitleText = document.createTextNode('J\'effectue un déplacement entre 19h00 et 06h00 sur un territoire soumis au couvre-feu.')
  curfewSubtitle.appendChild(curfewSubtitleText)
  reasonFieldsetCurfew.prepend(quarantineSubtitle)
  reasonFieldsetCurfew.prepend(curfewSubtitle)
  reasonFielsetWrapper.appendChild(reasonFieldsetCurfew)
  reasonFielsetWrapper.appendChild(reasonFieldsetQuarantine)
  appendToForm([...createTitle(), ...formFirstPart, contextWrapper, reasonFielsetWrapper])
}
