import MODEL_CHOICES from '@/constants/model_choices.js';
import Debug from 'debug';

const debug = Debug('forms.js');
debug.enabled = false;

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
 * The `id` needs to be the same as the key for the form. It is used to
 * identify the form when all forms are iterated over.
 *
 * The `title` is the title that will be shown to the user when they look
 * at that form. It is also used in navigation.
 *
 * `modelKey` is what is searched for in the `backend_constants` file to
 * retrieve the model that is currently chosen for the form. If there is no
 * model for the form, this property can be left out.
 *
 * `coreParams` lists the parameters associated with the subform common
 * to all model selections associated with that subform.
 *
 * `paramsKey` is what is used as the params key that is sent to
 * the server.
 *
 * @typedef FormDetails
 * @type {{
 *  id: string,
 *  title: string,
 *  modelKey: string | undefined,
 *  coreParams: string[] | undefined,
 *  modelChoices: ModelChoices,
 *  paramsKey: string,
 * }}
 */

/**
 * Defines the choices for the model that a form is displaying. This is
 * formatted as an object where the key is the name that the user sees,
 * and the value is the value that is used to get the defaults or currently
 * set values for that model choice in `backend_constants`.
 *
 * @typedef ModelChoices
 * @type {{
 *  [displayName: string]: string
 * }}
 */

 /**
 * The primary source of information on subform specific metadata. This is
 * referenced extensively when building and rendering forms.
 *
 * @type {Forms}
 */
const FORMS = {
  cosmo: {
    id: 'cosmo',
    title: 'Cosmology',
    modelKey: 'cosmo_model',
    coreParams: ['z', 'n', 'sigma_8'],
    modelChoices: MODEL_CHOICES.cosmo,
    paramsKey: 'cosmo_params',
  },
  mdef: {
    id: 'mdef',
    title: 'Mass Definition',
    modelKey: 'mdef_model',
    modelChoices: MODEL_CHOICES.mdef,
    paramsKey: 'mdef_params',
  },
  transfer: {
    id: 'transfer',
    title: 'Transfer',
    modelKey: 'transfer_model',
    coreParams: ['lnk_min', 'lnk_max', 'dlnk', 'takahashi'],
    modelChoices: MODEL_CHOICES.transfer,
    paramsKey: 'transfer_params',
  },
  filter: {
    id: 'filter',
    title: 'Filter',
    modelKey: 'filter_model',
    coreParams: ['delta_c'],
    modelChoices: MODEL_CHOICES.filter,
    paramsKey: 'filter_params',
  },
  growth: {
    id: 'growth',
    title: 'Growth',
    modelKey: 'growth_model',
    modelChoices: MODEL_CHOICES.growth,
    paramsKey: 'growth_params',
  },
  hmf: {
    id: 'hmf',
    title: 'HMF',
    modelKey: 'hmf_model',
    coreParams: ['Mmin', 'Mmax', 'dlog10m'],
    modelChoices: MODEL_CHOICES.hmf,
    paramsKey: 'hmf_params',
  },
  halo_model: {
    id: 'halo_model',
    title: 'Halo Model',
    coreParams: [
      'rmin',
      'rmax',
      'rnum',
      'hm_logk_min',
      'hm_logk_max',
      'hm_dlog10k',
      'hc_spectrum',
      'force_1halo_turnover',
    ],
  },
  hod: {
    id: 'hod',
    title: 'HOD',
    modelKey: 'hod_model',
    modelChoices: MODEL_CHOICES.hod,
    paramsKey: 'hod_params',
  },
  bias: {
    id: 'bias',
    title: 'Bias',
    modelKey: 'bias_model',
    modelChoices: MODEL_CHOICES.bias,
    paramsKey: 'bias_params',
  },
  halo_concentration: {
    id: 'halo_concentration',
    title: 'Halo Concentration',
    modelKey: 'halo_concentration_model',
    modelChoices: MODEL_CHOICES.concentration,
    paramsKey: 'halo_concentration_params',
  },
  tracer_concentration: {
    id: 'tracer_concentration',
    title: 'Tracer Concentration',
    modelKey: 'tracer_concentration_model',
    modelChoices: MODEL_CHOICES.concentration,
    paramsKey: 'tracer_concentration_params',
  },
  halo_profile: {
    id: 'halo_profile',
    title: 'Halo Profile',
    modelKey: 'halo_profile_model',
    modelChoices: MODEL_CHOICES.profile,
    paramsKey: 'halo_profile_params',
  },
  tracer_profile: {
    id: 'tracer_profile',
    title: 'Tracer Profile',
    modelKey: 'tracer_profile_model',
    modelChoices: MODEL_CHOICES.profile,
    paramsKey: 'tracer_profile_params',
  },
  halo_exclusion: {
    id: 'halo_exclusion',
    title: 'Halo Exclusion',
    modelKey: 'exclusion_model',
    modelChoices: MODEL_CHOICES.halo_exclusion,
    paramsKey: 'exclusion_params',
  },
};

export default FORMS;
