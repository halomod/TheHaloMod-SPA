/* eslint-disable */

import MODEL_CHOICES from '@/constants/model_choices.js';
import Debug from 'debug';

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
 * FormState stands for "Halo Mod Model flat" and represents the form of a
 * data model which is accepted by the server to create a model on that side.
 *
 * @typedef FormState
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
 * `modelKey` is what is searched for in the `backend_constants` file to
 * retrieve the model that is currently chosen for the form. If there is no
 * model for the form, this property can be left out.
 *
 * `currentFormStateParamsKey` is what is used as the params key that is sent to
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
 *  modelKey: string | undefined,
 *  modelChoices: ModelChoices,
 *  currentFormStateParamsKey: string,
 *  hmModelParamsKey: string,
 *  getRelevantFormState: GetRelevantFormStateFunction,
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
 * Gets the relevant fields of a given FormState object. For example,
 * if a form only uses the `params` field of the FormState, and 2 other
 * root-level fields, it will only return the model name field, the params
 * field, and those 2 other fields.
 *
 * @typedef GetRelevantFormStateFunction
 * @type {(currentFormState: FormState) => object}
 */

/**
 * Builds the `modelChoicesData` based on the given `currentFormState`.
 *
 * Typically this function will take what exists in `currentFormState` and transpose
 * the relevant fields onto the object which corresponds to the currently
 * chosen model.
 *
 * @typedef GetModelChoicesDataFromFlatFunction
 * @type {(currentFormState: FormState) => ModelChoicesData}
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
 * Updates the given `currentFormState` and `modelChoicesData` based on the provided
 * `oldModelName` and `newModelName`. This funciton allows a form to customize
 * how the FormState is modified when the selected model is changed, as well
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
 *  currentFormState: FormState,
 *  modelChoicesData: ModelChoicesData
 * ) => [FormState, ModelChoicesData]}
 */

/**
 * Flattens the given HMModel's parameters which are relevant to the form into
 * a format usable by the server.
 *
 * For example, this is used to convert an `HMModel` from its
 * expanded form, into an `FormState` when done over all forms.
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
    modelKey: 'cosmo_model',
    coreParams: ['z', 'n', 'sigma_8'],
    modelChoices: MODEL_CHOICES.cosmo,
    paramsKey: 'cosmo_params',
  },
//   mdef: {
//     id: 'mdef',
//     title: 'Mass Definition',
//     modelKey: 'mdef_model',
//     modelChoices: MODEL_CHOICES.mdef,
//     currentFormStateParamsKey: 'mdef_params',
//     hmModelParamsKey: 'MassDefinition_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   transfer: {
//     id: 'transfer',
//     title: 'Transfer',
//     modelKey: 'transfer_model',
//     modelChoices: MODEL_CHOICES.transfer,
//     currentFormStateParamsKey: 'transfer_params',
//     hmModelParamsKey: 'TransferComponent_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         const relevantFormState = {
//           lnk_min: currentFormState.lnk_min,
//           lnk_max: currentFormState.lnk_max,
//           dlnk: currentFormState.dlnk,
//           takahashi: currentFormState.takahashi,
//           [this.modelKey]: currentFormState[this.modelKey],
//         };
//         if (currentFormState[this.currentFormStateParamsKey]) {
//           relevantFormState[this.currentFormStateParamsKey] = clonedeep(
//             currentFormState[this.currentFormStateParamsKey],
//           );
//         }
//         return relevantFormState;
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         // Make sure the params exist first, because they don't in some cases.
//         if (currentFormState[this.currentFormStateParamsKey]) {
//           modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//             currentFormState[this.currentFormStateParamsKey],
//           );
//         }
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   filter: {
//     id: 'filter',
//     title: 'Filter',
//     modelKey: 'filter_model',
//     modelChoices: MODEL_CHOICES.filter,
//     currentFormStateParamsKey: 'filter_params',
//     hmModelParamsKey: 'Filter_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           delta_c: currentFormState.delta_c,
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   growth: {
//     id: 'growth',
//     title: 'Growth',
//     modelKey: 'growth_model',
//     modelChoices: MODEL_CHOICES.growth,
//     currentFormStateParamsKey: 'growth_params',
//     hmModelParamsKey: '_GrowthFactor_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   hmf: {
//     id: 'hmf',
//     title: 'HMF',
//     modelKey: 'hmf_model',
//     modelChoices: MODEL_CHOICES.hmf,
//     currentFormStateParamsKey: 'hmf_params',
//     hmModelParamsKey: 'FittingFunction_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//           Mmin: currentFormState.Mmin,
//           Mmax: currentFormState.Mmax,
//           dlog10m: currentFormState.dlog10m,
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   halo_model: {
//     id: 'halo_model',
//     title: 'Halo Model',
//     modelChoices: {},
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         const relevantFormState = {
//           rmin: currentFormState.rmin,
//           rmax: currentFormState.rmax,
//           rnum: currentFormState.rnum,
//           hm_logk_min: currentFormState.hm_logk_min,
//           hm_logk_max: currentFormState.hm_logk_max,
//           hm_dlog10k: currentFormState.hm_dlog10k,
//           hc_spectrum: currentFormState.hc_spectrum,
//           force_1halo_turnover: currentFormState.force_1halo_turnover,
//         };
//         return relevantFormState;
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData() {
//         // There are no model options for this form
//         return {};
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(_1, _2, currentFormState, modelChoicesData) {
//         return [currentFormState, modelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         // Nothing needs to happen to flatten for this form.
//         return hmModel;
//       };
//     },
//   },
//   hod: {
//     id: 'hod',
//     title: 'HOD',
//     modelKey: 'hod_model',
//     modelChoices: MODEL_CHOICES.hod,
//     currentFormStateParamsKey: 'hod_params',
//     hmModelParamsKey: 'HOD_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   bias: {
//     id: 'bias',
//     title: 'Bias',
//     modelKey: 'bias_model',
//     modelChoices: MODEL_CHOICES.bias,
//     currentFormStateParamsKey: 'bias_params',
//     hmModelParamsKey: 'Bias_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   halo_concentration: {
//     id: 'halo_concentration',
//     title: 'Halo Concentration',
//     modelKey: 'halo_concentration_model',
//     modelChoices: MODEL_CHOICES.concentration,
//     currentFormStateParamsKey: 'halo_concentration_params',
//     hmModelParamsKey: 'CMRelation_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   tracer_concentration: {
//     id: 'tracer_concentration',
//     title: 'Tracer Concentration',
//     modelKey: 'tracer_concentration_model',
//     modelChoices: MODEL_CHOICES.concentration,
//     currentFormStateParamsKey: 'tracer_concentration_params',
//     hmModelParamsKey: 'CMRelation_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   halo_profile: {
//     id: 'halo_profile',
//     title: 'Halo Profile',
//     modelKey: 'halo_profile_model',
//     modelChoices: MODEL_CHOICES.profile,
//     currentFormStateParamsKey: 'halo_profile_params',
//     hmModelParamsKey: 'Profile_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   tracer_profile: {
//     id: 'tracer_profile',
//     title: 'Tracer Profile',
//     modelKey: 'tracer_profile_model',
//     modelChoices: MODEL_CHOICES.profile,
//     currentFormStateParamsKey: 'tracer_profile_params',
//     hmModelParamsKey: 'Profile_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         Object.assign(partiallyFlattenedHMModel, {
//           [this.currentFormStateParamsKey]: hmModel[this.hmModelParamsKey][hmModel[this.modelKey]],
//         });
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
//   halo_exclusion: {
//     id: 'halo_exclusion',
//     title: 'Halo Exclusion',
//     modelKey: 'exclusion_model',
//     modelChoices: MODEL_CHOICES.halo_exclusion,
//     currentFormStateParamsKey: 'exclusion_params',
//     hmModelParamsKey: 'Exclusion_params',
//     get getRelevantFormState() {
//       return function getRelevant(currentFormState) {
//         return {
//           [this.modelKey]: currentFormState[this.modelKey],
//           [this.currentFormStateParamsKey]: currentFormState[this.currentFormStateParamsKey],
//         };
//       };
//     },
//     get getModelChoicesDataFromFlat() {
//       return function getModelChoicesData(currentFormState) {
//         const modelChoicesData = clonedeep(BACKEND_CONSTANTS[this.hmModelParamsKey]);
//         modelChoicesData[currentFormState[this.modelKey]] = clonedeep(
//           currentFormState[this.currentFormStateParamsKey],
//         );
//         return modelChoicesData;
//       };
//     },
//     get updateModelChoice() {
//       return function updateModelChoice(oldModelName, newModelName, currentFormState, modelChoicesData) {
//         const newModelChoicesData = clonedeep(modelChoicesData);
//         if (oldModelName) {
//           newModelChoicesData[oldModelName] = clonedeep(currentFormState[this.currentFormStateParamsKey]);
//         }
//         const newFormState = Object.assign(
//           clonedeep(currentFormState),
//           {
//             [this.currentFormStateParamsKey]: modelChoicesData[newModelName],
//           },
//         );
//         return [newFormState, newModelChoicesData];
//       };
//     },
//     get flattenHMModel() {
//       return function flatten(hmModel) {
//         const partiallyFlattenedHMModel = clonedeep(hmModel);
//         delete partiallyFlattenedHMModel[this.hmModelParamsKey];
//         return partiallyFlattenedHMModel;
//       };
//     },
//   },
};

export default FORMS;
