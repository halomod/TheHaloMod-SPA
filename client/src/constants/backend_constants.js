import generatedBackendConstants from '@/../generated/backend_constants.json';
import forms from '@/constants/forms.js';
import deepFreeze from 'deep-freeze';

/**
 * Defines the default state for forms when a new model is being created
 * @typedef DefaultFormState
 * @type {{
 *   [formId: string]: SubformState,
 * }}
 */

/**
  * Establishes the potential formats for each subform's unique state
  * @typedef SubformState
  * @type {{
  *   [coreParameter: string]?: string | int | boolean,
  *   [modelKey: string]?: string,
  *   [paramKey: string]?: object
  * }}
  */

/**
 * Defines the defaults associated with alternate model selections in each
 * subform.
 * @typedef FormOptionDefaults
 * @type {{
 *  [formId]: {Object.<string, number>}
 * }}
 */

const mapping = {
  growth: '_GrowthFactor_params',
  mdef: 'MassDefinition_params',
  cosmo: 'cosmo_defaults',
  filter: 'Filter_params',
  hmf: 'FittingFunction_params',
  hod: 'HOD_params',
  bias: 'Bias_params',
  halo_concentration: 'CMRelation_params',
  tracer_concentration: 'CMRelation_params',
  halo_profile: 'Profile_params',
  tracer_profile: 'Profile_params',
  halo_exclusion: 'Exclusion_params',
  transfer: 'TransferComponent_params',
};

const BACKEND_CONSTANTS = generatedBackendConstants;

const form_option_defaults = {};
const default_form_state = {};

Object.entries(forms).forEach(([key, { coreParams, modelKey, paramsKey }]) => {
  /* pulls option defaults from BACKEND_CONSTANTS */
  form_option_defaults[key] = BACKEND_CONSTANTS[mapping[key]];

  /* builds initial state for each subform */
  const items = modelKey
    ? [...(!coreParams ? [] : coreParams), modelKey]
    : [...(!coreParams ? [] : coreParams)];

  const initial = {};
  items.forEach((item) => {
    initial[item] = BACKEND_CONSTANTS[item];
  });
  if (paramsKey) {
    initial[paramsKey] = form_option_defaults[key][initial[modelKey]];
  }
  default_form_state[key] = initial;
});

/*
*  Cosmo is special because it updates its core parameters, too, when a new option
*  is selected. These extra parameters are manually included in form_option_defaults to
*  reflect that.
*/
form_option_defaults.cosmo = {
  Planck13: {
    cosmo_params: BACKEND_CONSTANTS.cosmo_defaults.Planck13,
    z: 0.0,
    n: 0.9619,
    sigma_8: 0.8347,
  },
  Planck15: {
    cosmo_params: BACKEND_CONSTANTS.cosmo_defaults.Planck15,
    z: 0.0,
    n: 0.965,
    sigma_8: 0.802,
  },
  WMAP5: {
    cosmo_params: BACKEND_CONSTANTS.cosmo_defaults.WMAP5,
    z: 0.0,
    n: 0.962,
    sigma_8: 0.817,
  },
  WMAP7: {
    cosmo_params: BACKEND_CONSTANTS.cosmo_defaults.WMAP7,
    z: 0.0,
    n: 0.967,
    sigma_8: 0.81,
  },
  WMAP9: {
    cosmo_params: BACKEND_CONSTANTS.cosmo_defaults.WMAP9,
    z: 0.0,
    n: 0.9646,
    sigma_8: 0.817,
  },
};

/**
 * Contains the default state for all forms
 *
 * @type {DefaultFormState}
 */
const DEFAULT_FORM_STATE = deepFreeze(default_form_state);

/**
 * Contains the defaults associated with changes to model selection
 * within individual forms
 *
 * @type {FormOptionDefaults}
 */
const FORM_OPTION_DEFAULTS = deepFreeze(form_option_defaults);

export { DEFAULT_FORM_STATE, FORM_OPTION_DEFAULTS };
