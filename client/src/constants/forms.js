import MODEL_CHOICES from '@/constants/model_choices.js';
import clonedeep from 'lodash.clonedeep';
import Debug from 'debug';
import BACKEND_CONSTANTS from './backend_constants';

const debug = Debug('forms.js');
debug.enabled = true;

/**
 * The HMModel stands for "Halo Mod Model" and represents the form that the
 * backend constants come in.
 *
 * @typedef HMModel
 * @type {object}
 */

/**
 * HMModelFlat stands for "Halo Mod Model flat" and represents the form of a
 * data model which is accepted by the server to create a model on that side.
 *
 * @typedef HMModelFlat
 * @type {object}
 */

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
 * `model_key` is what is searched for in the `backend_constants` file to
 * retrieve the model that is currently chosen for the form. If there is no
 * model for the form, this property can be left out.
 *
 * `params_key` is what is searched for in the `backend_constants` file to
 * retrive properties for the different model selections. It is also used to
 * set the name of parameters for the form in most cases.
 *
 * @typedef FormDetails
 * @type {{
 *  id: string,
 *  title: string,
 *  model_key: string | undefined,
 *  modelChoices: ModelChoices,
 *  params_key: string,
 *  getRelevantHMModelFlat: GetRelevantHMModelFlatFunction,
 *  getModelChoicesDataFromFlat: GetModelChoicesDataFromFlatFunction,
 *  updateModelChoice: UpdateModelChoiceFunction,
 *  flattenHMModel: FlattenHMModelFunction
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
 * Gets the relevant fields of a given HMModelFlat object. For example,
 * if a form only uses the `params` field of the HMModelFlat, and 2 other
 * root-level fields, it will only return the model name field, the params
 * field, and those 2 other fields.
 *
 * @typedef GetRelevantHMModelFlatFunction
 * @type {(hmModelFlat: HMModelFlat) => object}
 */

/**
 * Builds the `modelChoicesData` based on the given `hmModelFlat`.
 *
 * Typically this function will take what exists in `hmModelFlat` and transpose
 * the relevant fields onto the object which corresponds to the currently
 * chosen model.
 *
 * @typedef GetModelChoicesDataFromFlatFunction
 * @type {(hmModelFlat: HMModelFlat) => ModelChoicesData}
 */

/**
 * Holds the different data + paremeters associated with the model choices.
 * The use of this object and it's objects change based on the form and on
 * the `getModelChoicesDataFromFlat` function, but the structure below is
 * consistent among all forms.
 *
 * @typedef ModelChoicesData
 * @type {{
 *  [modelName: string]: object
 * }}
 */

/**
 * Updates the given `hmModelFlat` and `modelChoicesData` based on the provided
 * `oldModelName` and `newModelName`. This funciton allows a form to customize
 * how the HMModelFlat is modified when the selected model is changed, as well
 * as the current ModelChoicesData.
 *
 * Most of the time, the params field for the form is modified when this
 * happens, but custom behavior is needed for several forms which make use of
 * root-level fields.
 *
 * @typedef UpdateModelChoiceFunction
 * @type {(
 *  oldModelName: string,
 *  newModelName: string,
 *  hmModelFlat: HMModelFlat,
 *  modelChoicesData: ModelChoicesData
 * ) => [HMModelFlat, ModelChoicesData]}
 */

/**
 * Flattens the given HMModel's parameters which are relevant to the form into
 * a format usable by the server.
 *
 * For example, this is used to convert an `HMModel` from its
 * expanded form, into an `HMModelFlat` when done over all forms.
 *
 * @typedef FlattenHMModelFunction
 * @type {(hmModel: HMModel) => object}
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
  filter: {
    id: 'filter',
    title: 'Filter',
    model_key: 'filter_model',
    modelChoices: MODEL_CHOICES.filter,
    params_key: 'filter_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          delta_c: hmModelFlat.delta_c,
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
  hmf: {
    id: 'hmf',
    title: 'HMF',
    model_key: 'hmf_model',
    modelChoices: MODEL_CHOICES.hmf,
    params_key: 'hmf_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.params_key]: hmModelFlat[this.params_key],
          Mmin: hmModelFlat.Mmin,
          Mmax: hmModelFlat.Mmax,
          dlog10m: hmModelFlat.dlog10m,
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
  halo_model: {
    id: 'halo_model',
    title: 'Halo Model',
    modelChoices: {},
    params_key: 'halo_model_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        const relevantHMModelFlat = {};
        Object.keys(BACKEND_CONSTANTS.halo_model_params).forEach((key) => {
          relevantHMModelFlat[key] = hmModelFlat[key];
        });
        return relevantHMModelFlat;
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData() {
        // There are no model options for this form
        return {};
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(_1, _2, hmModelFlat, modelChoicesData) {
        return [hmModelFlat, modelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.params_key];
        Object.assign(partiallyFlattenedHMModel, hmModel[this.params_key]);
        return partiallyFlattenedHMModel;
      };
    },
  },
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
