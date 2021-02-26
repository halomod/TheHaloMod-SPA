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

const FORMS = [
  // {
  //   component: CosmologyForm,
  //   model: 'cosmo',
  //   title: 'Cosmology',
  //   id: 'cosmology',
  // },
  {
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
  {
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
  {
    id: 'hod',
    title: 'HOD',
    props: {
      model_key: 'hod_model',
      choices: MODEL_CHOICES.hod,
      params_key: 'hod_params',
      all_data: BACKEND_CONSTANTS.hod_params,
    },
  },
  {
    id: 'bias',
    title: 'Bias',
    props: {
      model_key: 'bias_model',
      choices: MODEL_CHOICES.bias,
      params_key: 'bias_params',
      all_data: BACKEND_CONSTANTS.bias_params,
    },
  },
  {
    id: 'halo_concentration',
    title: 'Halo Concentration',
    props: {
      model_key: 'halo_concentration_model',
      choices: MODEL_CHOICES.concentration,
      params_key: 'halo_concentration_params',
      all_data: BACKEND_CONSTANTS.concentration_params,
    },
  },
  {
    id: 'tracer_concentration',
    title: 'Tracer Concentration',
    props: {
      model_key: 'tracer_concentration_model',
      choices: MODEL_CHOICES.concentration,
      params_key: 'tracer_concentration_params',
      all_data: BACKEND_CONSTANTS.concentration_params,
    },
  },
  {
    id: 'halo_profile',
    title: 'Halo Profile',
    props: {
      model_key: 'halo_profile_model',
      choices: MODEL_CHOICES.profile,
      params_key: 'halo_profile_params',
      all_data: BACKEND_CONSTANTS.profile_params,
    },
  },
  {
    id: 'tracer_profile',
    title: 'Tracer Profile',
    props: {
      model_key: 'tracer_profile_model',
      choices: MODEL_CHOICES.profile,
      params_key: 'tracer_profile_params',
      all_data: BACKEND_CONSTANTS.profile_params,
    },
  },
  {
    id: 'halo_exclusion',
    title: 'Halo Exclusion',
    props: {
      model_key: 'exclusion_model',
      choices: MODEL_CHOICES.halo_exclusion,
      params_key: 'exclusion_params',
      all_data: BACKEND_CONSTANTS.exclusion_params,
    },
  },
];

export default FORMS;
