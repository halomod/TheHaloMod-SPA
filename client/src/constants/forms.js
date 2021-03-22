import MODEL_CHOICES from '@/constants/model_choices.js';
import clonedeep from 'lodash.clonedeep';
import Debug from 'debug';
import BACKEND_CONSTANTS from './backend_constants';

const debug = Debug('forms.js');
debug.enabled = false;

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
 * `hmModelFlatParamsKey` is what is used as the params key that is sent to
 * the server.
 *
 * `hmModelParamsKey` is what is searched for in the `backend_constants` file to
 * retrive properties for the different model selections. This is sometimes
 * different than what is sent to the server.
 *
 * @typedef FormDetails
 * @type {{
 *  id: string,
 *  title: string,
 *  model_key: string | undefined,
 *  modelChoices: ModelChoices,
 *  hmModelFlatParamsKey: string,
 *  hmModelParamsKey: string,
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
    hmModelFlatParamsKey: 'cosmo_params',
    hmModelParamsKey: 'cosmo_defaults',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
          z: hmModelFlat.z,
          n: hmModelFlat.n,
          sigma_8: hmModelFlat.sigma_8,
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        debug('getModelChoicesDataFromFlat was ran for cosmo');
        const cosmoDefaults = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        const modelChoicesData = {
          Planck13: {
            cosmo_params: cosmoDefaults.Planck13,
            z: 0.0,
            n: 0.9619,
            sigma_8: 0.8347,
          },
          Planck15: {
            cosmo_params: cosmoDefaults.Planck15,
            z: 0.0,
            n: 0.965,
            sigma_8: 0.802,
          },
          WMAP5: {
            cosmo_params: cosmoDefaults.WMAP5,
            z: 0.0,
            n: 0.962,
            sigma_8: 0.817,
          },
          WMAP7: {
            cosmo_params: cosmoDefaults.WMAP7,
            z: 0.0,
            n: 0.967,
            sigma_8: 0.81,
          },
          WMAP9: {
            cosmo_params: cosmoDefaults.WMAP9,
            z: 0.0,
            n: 0.9646,
            sigma_8: 0.817,
          },
        };
        modelChoicesData[hmModelFlat[this.model_key]] = {
          [this.hmModelParamsKey]: clonedeep(hmModelFlat[this.hmModelFlatParamsKey]),
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
            [this.hmModelParamsKey]: clonedeep(hmModelFlat[this.hmModelFlatParamsKey]),
            z: hmModelFlat.z,
            n: hmModelFlat.n,
            sigma_8: hmModelFlat.sigma_8,
          };
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName][this.hmModelParamsKey],
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
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'mdef_params',
    hmModelParamsKey: 'MassDefinition_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'transfer_params',
    hmModelParamsKey: 'TransferComponent_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        const relevantHMModelFlat = {
          lnk_min: hmModelFlat.lnk_min,
          lnk_max: hmModelFlat.lnk_max,
          dlnk: hmModelFlat.dlnk,
          takahashi: hmModelFlat.takahashi,
          [this.model_key]: hmModelFlat[this.model_key],
        };
        if (hmModelFlat[this.hmModelFlatParamsKey]) {
          relevantHMModelFlat[this.hmModelFlatParamsKey] = clonedeep(
            hmModelFlat[this.hmModelFlatParamsKey],
          );
        }
        return relevantHMModelFlat;
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        // Make sure the params exist first, because they don't in some cases.
        if (hmModelFlat[this.hmModelFlatParamsKey]) {
          modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
            hmModelFlat[this.hmModelFlatParamsKey],
          );
        }
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'filter_params',
    hmModelParamsKey: 'Filter_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          delta_c: hmModelFlat.delta_c,
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'growth_params',
    hmModelParamsKey: '_GrowthFactor_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'hmf_params',
    hmModelParamsKey: 'FittingFunction_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
          Mmin: hmModelFlat.Mmin,
          Mmax: hmModelFlat.Mmax,
          dlog10m: hmModelFlat.dlog10m,
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
        });
        return partiallyFlattenedHMModel;
      };
    },
  },
  halo_model: {
    id: 'halo_model',
    title: 'Halo Model',
    modelChoices: {},
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        const relevantHMModelFlat = {
          rmin: hmModelFlat.rmin,
          rmax: hmModelFlat.rmax,
          rnum: hmModelFlat.rnum,
          hm_logk_min: hmModelFlat.hm_logk_min,
          hm_logk_max: hmModelFlat.hm_logk_max,
          hm_dlog10k: hmModelFlat.hm_dlog10k,
          hc_spectrum: hmModelFlat.hc_spectrum,
          force_1halo_turnover: hmModelFlat.force_1halo_turnover,
        };
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
        // Nothing needs to happen to flatten for this form.
        return hmModel;
      };
    },
  },
  hod: {
    id: 'hod',
    title: 'HOD',
    model_key: 'hod_model',
    modelChoices: MODEL_CHOICES.hod,
    hmModelFlatParamsKey: 'hod_params',
    hmModelParamsKey: 'HOD_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'bias_params',
    hmModelParamsKey: 'Bias_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'halo_concentration_params',
    hmModelParamsKey: 'CMRelation_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'tracer_concentration_params',
    hmModelParamsKey: 'CMRelation_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'halo_profile_params',
    hmModelParamsKey: 'Profile_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'tracer_profile_params',
    hmModelParamsKey: 'Profile_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        Object.assign(partiallyFlattenedHMModel, {
          [this.hmModelFlatParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.model_key]],
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
    hmModelFlatParamsKey: 'exclusion_params',
    hmModelParamsKey: 'Exclusion_params',
    get getRelevantHMModelFlat() {
      return function getRelevant(hmModelFlat) {
        return {
          [this.model_key]: hmModelFlat[this.model_key],
          [this.hmModelFlatParamsKey]: hmModelFlat[this.hmModelFlatParamsKey],
        };
      };
    },
    get getModelChoicesDataFromFlat() {
      return function getModelChoicesData(hmModelFlat) {
        const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
        modelChoicesData[hmModelFlat[this.model_key]] = clonedeep(
          hmModelFlat[this.hmModelFlatParamsKey],
        );
        return modelChoicesData;
      };
    },
    get updateModelChoice() {
      return function updateModelChoice(oldModelName, newModelName, hmModelFlat, modelChoicesData) {
        const newModelChoicesData = clonedeep(modelChoicesData);
        if (oldModelName) {
          newModelChoicesData[oldModelName] = clonedeep(hmModelFlat[this.hmModelFlatParamsKey]);
        }
        const newHMModelFlat = Object.assign(
          clonedeep(hmModelFlat),
          {
            [this.hmModelFlatParamsKey]: modelChoicesData[newModelName],
          },
        );
        return [newHMModelFlat, newModelChoicesData];
      };
    },
    get flattenHMModel() {
      return function flatten(hmModel) {
        const partiallyFlattenedHMModel = clonedeep(hmModel);
        delete partiallyFlattenedHMModel[this.hmModelParamsKey];
        return partiallyFlattenedHMModel;
      };
    },
  },
};

export default FORMS;
