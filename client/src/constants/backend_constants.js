// import deepFreeze from 'deep-freeze';
import generatedBackendConstants from '@/../generated/backend_constants.json';
import forms from '@/constants/forms.js';

/**
 * Note that these are generated by running `npm run setup` first.
 *
 * @typedef HMModel
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
const FORM_OPTION_DEFAULTS = {};
const DEFAULT_FORM_STATE = {};

/* halo_model is weird */
FORM_OPTION_DEFAULTS.halo_model = {};

Object.entries(forms).forEach(([key, { coreParams, modelKey, paramsKey }]) => {
  /* pulls option defaults from BACKEND_CONSTANTS */
  FORM_OPTION_DEFAULTS[key] = BACKEND_CONSTANTS[mapping[key]];

  /* builds initial state for each subform */
  const items = modelKey
    ? [...(!coreParams ? [] : coreParams), modelKey]
    : [...(!coreParams ? [] : coreParams)];

  const initial = {};
  items.forEach((item) => {
    initial[item] = BACKEND_CONSTANTS[item];
  });
  if (paramsKey) {
    initial[paramsKey] = FORM_OPTION_DEFAULTS[key][initial[modelKey]];
  }
  DEFAULT_FORM_STATE[key] = initial;
});

/* cosmo is special */
FORM_OPTION_DEFAULTS.cosmo = {
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

export { DEFAULT_FORM_STATE, FORM_OPTION_DEFAULTS };
