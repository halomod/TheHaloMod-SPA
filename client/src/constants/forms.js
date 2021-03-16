import MODEL_CHOICES from '@/constants/model_choices.js';
import clonedeep from 'lodash.clonedeep';
import Debug from 'debug';
import BACKEND_CONSTANTS from './backend_constants';

const debug = Debug('forms.js');
debug.enabled = true;

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
 * The `id` needs to be the same as the key for the form, AND match one of the
 * entries in `initial_state.json`.
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
 * `model_key` is what is searched for in the `backend_constants` file to
 * retrieve the model that is currently chosen for the form.
 *
 * `params_key` is what is searched for in the `backend_constants` file to
 * generate the different fields that can be filled for that form.
 *
 * `rootLevelFields` are optional and should be an array of strings that match
 * to fields that are in the root of `backend_constants` that should be shown
 * for that form. At the moment, all the values these correspond to should be
 * number fields.
 *
 * @typedef FormProps
 * @type {{
 *  model_key: string,
 *  modelChoices: ModelChoices,
 *  params_key: string,
 *  all_data: object,
 *  rootLevelFields?: string[]
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
 * What is a consistent format for each of these?
 * It looks like there is always a model that is chosen, and then some
 * set of parameters. There are also some set of parameters that may
 * change with the model change and some that might not.
 */

/**
 * The primary source of information on the client side which will generate
 * the forms. This contains everything that is needed to configure the
 * front-end forms.
 *
 * @type {Forms}
 */
const FORMS = {
  cosmo: {
    id: 'cosmo',
    title: 'Cosmology',
    model_key: 'cosmo_model',
    modelChoices: MODEL_CHOICES.cosmo,
    params_key: 'cosmo_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
          z: hmModelFlat.z,
          n: hmModelFlat.n,
          sigma_8: hmModelFlat.sigma_8,
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        debug('getModelChoicesDataFromFlat was ran for cosmo');
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.params_key]);
        modelChoicesData[hmModelFlat[this.model_key]] = {
          [this.params_key]: clonedeep(hmModelFlat[this.params_key]),
          z: hmModelFlat.z,
          n: hmModelFlat.n,
          sigma_8: hmModelFlat.sigma_8,
        };
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = {
            [this.params_key]: clonedeep(hmModelFlat[this.params_key]),
            z: hmModelFlat.z,
            n: hmModelFlat.n,
            sigma_8: hmModelFlat.sigma_8,
          };
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName][this.params_key],
            z: modelChoicesData[newModelName].z,
            n: modelChoicesData[newModelName].n,
            sigma_8: modelChoicesData[newModelName].sigma_8,
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel[this.params_key][hmModel[this.model_key]][this.params_key],
          z: hmModel[this.params_key][hmModel[this.model_key]].z,
          n: hmModel[this.params_key][hmModel[this.model_key]].n,
          sigma_8: hmModel[this.params_key][hmModel[this.model_key]].sigma_8,
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  mdef: {
    id: 'mdef',
    title: 'Mass Definition',
    model_key: 'mdef_model',
    modelChoices: MODEL_CHOICES.mdef,
    params_key: 'mdef_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.params_key]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel[this.params_key][hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  transfer: {
    id: 'transfer',
    title: 'Transfer',
    model_key: 'transfer_model',
    modelChoices: MODEL_CHOICES.transfer,
    params_key: 'transfer_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        const relevantHMModelFlat = {
          lnk_min: hmModelFlat.lnk_min,
          lnk_max: hmModelFlat.lnk_max,
          dlnk: hmModelFlat.dlnk,
          takahashi: hmModelFlat.takahashi,
          [this.model_key]: hmModelFlat[this.model_key],
        };
        if (hmModelFlat[this.params_key]) {
          relevantHMModelFlat[this.params_key] = clonedeep(hmModelFlat[this.params_key]);
        }
        return relevantHMModelFlat;
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.params_key]);
        // Make sure the params exist first, because they don't in some cases.
        if (hmModelFlat[this.params_key]) {
          modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
            hmModelFlat[this.params_key],
          );
        }
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel[this.params_key][hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  // filter: {
  //   id: 'filter',
  //   title: 'Filter',
  //   props: {
  //     model_key: 'filter_model',
  //     modelChoices: MODEL_CHOICES.filter,
  //     params_key: 'filter_params',
  //     all_data: BACKEND_CONSTANTS.filter_params,
  //     rootLevelFields: [
  //       'delta_c',
  //     ],
  //   },
  // },
  growth: {
    id: 'growth',
    title: 'Growth',
    model_key: 'growth_model',
    modelChoices: MODEL_CHOICES.growth,
    params_key: 'growth_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.params_key]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel[this.params_key][hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
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
    model_key: 'hod_model',
    modelChoices: MODEL_CHOICES.hod,
    params_key: 'hod_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.params_key]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel[this.params_key][hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  bias: {
    id: 'bias',
    title: 'Bias',
    model_key: 'bias_model',
    modelChoices: MODEL_CHOICES.bias,
    params_key: 'bias_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.params_key]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel[this.params_key][hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  halo_concentration: {
    id: 'halo_concentration',
    title: 'Halo Concentration',
    model_key: 'halo_concentration_model',
    modelChoices: MODEL_CHOICES.concentration,
    params_key: 'halo_concentration_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS.concentration_params);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel.concentration_params[hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  tracer_concentration: {
    id: 'tracer_concentration',
    title: 'Tracer Concentration',
    model_key: 'tracer_concentration_model',
    modelChoices: MODEL_CHOICES.concentration,
    params_key: 'tracer_concentration_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS.concentration_params);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel.concentration_params[hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  halo_profile: {
    id: 'halo_profile',
    title: 'Halo Profile',
    model_key: 'halo_profile_model',
    modelChoices: MODEL_CHOICES.profile,
    params_key: 'halo_profile_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS.concentration_params);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel.profile_params[hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  tracer_profile: {
    id: 'tracer_profile',
    title: 'Tracer Profile',
    model_key: 'tracer_profile_model',
    modelChoices: MODEL_CHOICES.profile,
    params_key: 'tracer_profile_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS.profile_params);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.params_key]: hmModel.profile_params[hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  halo_exclusion: {
    id: 'halo_exclusion',
    title: 'Halo Exclusion',
    model_key: 'exclusion_model',
    modelChoices: MODEL_CHOICES.halo_exclusion,
    params_key: 'exclusion_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS.exclusion_params);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.params_key],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.params_key]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.params_key]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        return partiallyFlattenedHMModel;
      };
    },
  },
};

export default FORMS;
