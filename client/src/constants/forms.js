import MODEL_CHOICES from '@/constants/model_choices.json';
import BACKEND_CONSTANTS from '@/constants/backend_constants.js';

// Very Basic
//    Description: Just numeric fields with no core parameters or special styling
//    Examples: Growth, HOD, Bias, Mass Definition, Halo Exclusion
// Basic
//    Description: Mostly numeric fields with no core parameters or special styling
//    Examples: TracerProfile, HaloProfile, Tracer Concentration, Halo Concentration
// Complex
//    Description: Has core parameters with defined ranges
//    Examples: HMF
// Very Complex
//    Description: Has core parameters with defined ranges, special styling, and/or special types
//    Examples: Halo Model, Cosmology, Transfer,  Filter

/**
 * Defines the forms and their data that will be rendered.
 *
 * @typedef Forms
 * @type {{
 *  [formKeyName: string]: FormDetails
 * }}
 */

/**
 * Defines the details that each form will have which will be needed to render
 * that form.
 *
 * The `title` is the title that will be shown to the user when they look
 * at that form. It is also used in navigation.
 *
 * @typedef FormDetails
 * @type {{
 *  id: string,
 *  title: string,
 *  props: FormProps
 * }}
 */

/**
 * Defines the props that each form will accept through Vue.
 *
 * `model_key` is what is searched for int he `backend_constants` file to
 * retrieve the model that is currently chosen for the form.
 *
 * `params_key` is what is searched for in the `backend_constants` file to
 * generate the different fields that can be filled for that form.
 *
 * @typedef FormProps
 * @type {{
 *  model_key: string,
 *  choices: ModelChoices,
 *  params_key: string,
 *  all_data: object
 * }}
 */

/**
 * Defines the choices for the model that a form is displaying.
 *
 * @typedef ModelChoices
 * @type {{
 *  [somePropName: string]: string
 * }}
 */

/**
 * @type {Forms}
 */
const FORMS = {
  // {
  //   component: CosmologyForm,
  //   model: 'cosmo',
  //   title: 'Cosmology',
  //   id: 'cosmology',
  // },
  mdef: {
    id: 'mdef',
    title: 'Mass Definition',
    props: {
      model_key: 'mdef_model',
      choices: MODEL_CHOICES.mdef,
      params_key: 'mdef_params',
      all_data: BACKEND_CONSTANTS.mdef_params,
    },
  },
  // {
  //   component: TransferForm,
  //   model: 'transfer',
  //   title: 'Transfer',
  //   id: 'transfer',
  // },
  // {
  //   component: FilterForm,
  //   model: 'filter',
  //   title: 'Filter',
  //   id: 'filter',
  // },
  growth: {
    id: 'growth',
    title: 'Growth',
    props: {
      model_key: 'growth_model',
      choices: MODEL_CHOICES.growth,
      params_key: 'growth_params',
      all_data: BACKEND_CONSTANTS.growth_params,
    },
  },
  // {
  //   component: HMFForm,
  //   model: 'hmf',
  //   title: 'HMF',
  //   id: 'hmf',
  // },
  // {
  //   component: HaloModelForm,
  //   model: 'halo_model',
  //   title: 'Halo Model',
  //   id: 'halo_model',
  // },
  hod: {
    id: 'hod',
    title: 'HOD',
    props: {
      model_key: 'hod_model',
      choices: MODEL_CHOICES.hod,
      params_key: 'hod_params',
      all_data: BACKEND_CONSTANTS.hod_params,
    },
  },
  bias: {
    id: 'bias',
    title: 'Bias',
    props: {
      model_key: 'bias_model',
      choices: MODEL_CHOICES.bias,
      params_key: 'bias_params',
      all_data: BACKEND_CONSTANTS.bias_params,
    },
  },
  halo_concentration: {
    id: 'halo_concentration',
    title: 'Halo Concentration',
    props: {
      model_key: 'halo_concentration_model',
      choices: MODEL_CHOICES.concentration,
      params_key: 'halo_concentration_params',
      all_data: BACKEND_CONSTANTS.concentration_params,
    },
  },
  tracer_concentration: {
    id: 'tracer_concentration',
    title: 'Tracer Concentration',
    props: {
      model_key: 'tracer_concentration_model',
      choices: MODEL_CHOICES.concentration,
      params_key: 'tracer_concentration_params',
      all_data: BACKEND_CONSTANTS.concentration_params,
    },
  },
  halo_profile: {
    id: 'halo_profile',
    title: 'Halo Profile',
    props: {
      model_key: 'halo_profile_model',
      choices: MODEL_CHOICES.profile,
      params_key: 'halo_profile_params',
      all_data: BACKEND_CONSTANTS.profile_params,
    },
  },
  tracer_profile: {
    id: 'tracer_profile',
    title: 'Tracer Profile',
    props: {
      model_key: 'tracer_profile_model',
      choices: MODEL_CHOICES.profile,
      params_key: 'tracer_profile_params',
      all_data: BACKEND_CONSTANTS.profile_params,
    },
  },
  halo_exclusion: {
    id: 'halo_exclusion',
    title: 'Halo Exclusion',
    props: {
      model_key: 'exclusion_model',
      choices: MODEL_CHOICES.halo_exclusion,
      params_key: 'exclusion_params',
      all_data: BACKEND_CONSTANTS.exclusion_params,
    },
  },
};

export default FORMS;
