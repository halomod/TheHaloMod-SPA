<template>
  <form novalidate>
    <!-- Core Paramaters (common to all model options)-->
    <div :class="subformMeta.coreParams ? 'md-layout md-gutter' : ''">
      <div :class="subformMeta.coreParams ? 'md-layout-item' : ''">
        <div v-for="key in subformMeta.coreParams" :key="key">
          <Parameter
            v-model="subformState"
            :parameterKey="key"
            @is-valid="(valid) => setValid(subformValid, key, valid)"
          />
        </div>
        <div class="md-gutter md-layout">
          <div class="md-layout-item">
            <!-- Model Selection -->
            <md-field v-if="subformMeta.modelKey">
              <label>{{subformMeta.title}}</label>
              <md-select v-model="subformState[subformMeta.modelKey]">
                <md-option
                  v-for="(value, choice) in subformMeta.modelChoices"
                  :key="choice"
                  :value="value">
                  {{choice}}
                </md-option>
              </md-select>
            </md-field>
          </div>
          <!-- Subparameters (unique to model selection) -->
          <div v-if="subParametersExist" class="md-layout-item">
            <md-list v-if="Object.keys(currentVisibleParameters).length > 3">
              <md-list-item md-expand :md-expanded="true">
                <span class="md-list-item-text">
                  {{currentModelDisplayName}} Parameters
                </span>
                <md-list slot="md-expand">
                  <md-list-item
                    v-for="(value, key) in currentVisibleParameters"
                    :key="key"
                  >
                    <Parameter
                      v-model="subformState[subformMeta.paramsKey]"
                      :parameterKey="key"
                      @is-valid="(valid) =>
                        setValid(subformValid[subformMeta.paramsKey], key, valid)"
                    />
                  </md-list-item>
                </md-list>
              </md-list-item>
            </md-list>
            <div v-else v-for="(value, key) in currentVisibleParameters" :key="key">
              <Parameter
                v-model="subformState[subformMeta.paramsKey]"
                :parameterKey="key"
                @is-valid="(valid) =>
                  setValid(subformValid[subformMeta.paramsKey], key, valid)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
import Debug from 'debug';
import forms from '@/constants/forms.js';
import PARAMETER_PROPS from '@/constants/parameter_properties';
import { FORM_OPTION_DEFAULTS } from '@/constants/backend_constants.js';
import Parameter from '@/components/Forms/Parameter';

const debug = Debug('GenericForm.vue');
debug.enabled = false;

export default {
  name: 'GenericForm',
  model: {
    event: 'onChange',
  },
  props: {
    initialSubformState: {
      type: Object,
      required: true,
    },
    formId: {
      type: String,
      required: true,
    },
  },
  components: {
    Parameter,
  },
  data() {
    return {
      /**
       * A local version of the relevant portion of currentFormState.
       */
      subformState: clonedeep(this.initialSubformState),
      subformValid: clonedeep(this.initialSubformState),
      /**
       * The cached options that the user has selected previously for the
       * different models, but possibly haven't been saved to the server yet.
       */
      cachedSubformInputs: clonedeep(FORM_OPTION_DEFAULTS[this.formId]),

      subformMeta: forms[this.formId],

      /**
       * Holds the boolean determining if sub-parameters exist for the current
       * model selection.
       */
      subParametersExist: false,
      /**
       * Holds the list of currently visible parameters for the current model
       * selection.
       */
      currentVisibleParameters: {},
      /**
       * Holds the current model's display name if there is one. This is just
       * used to be efficient about when the model name is found for the
       * parameters drop-down.
       */
      currentModelDisplayName: '',
    };
  },
  created() {
    this.initValid(this.subformValid);
    this.$emit('is-valid', this.testValid(this.subformValid));
    const subParametersExist = this.checkSubParametersExist(this.subformState);
    this.subParametersExist = subParametersExist;
    if (subParametersExist) {
      this.currentVisibleParameters = this.getVisibleSubFormParameters(this.subformState);
      this.currentModelDisplayName = this.getKeyByValue(
        this.subformMeta.modelChoices,
        this.subformState[this.subformMeta.modelKey],
      );
    }
    this.$watch(
      function toWatch() {
        return this.subformState[this.subformMeta.modelKey];
      },
      (newModelName, oldModelName) => {
        let newSubformState;
        // Special behavior for the cosmo model
        if (this.formId === 'cosmo') {
          this.cachedSubformInputs[oldModelName] = this.subformState;
          newSubformState = {
            ...this.cachedSubformInputs[newModelName],
            [this.subformMeta.modelKey]: newModelName,
          };
          this.subformState = {
            ...this.cachedSubformInputs[newModelName],
            [this.subformMeta.modelKey]: newModelName,
          };
        } else {
          this.cachedSubformInputs[oldModelName] = {
            ...this.subformState[this.subformMeta.paramsKey],
          };
          newSubformState = this.subformState;
          newSubformState[this.subformMeta.paramsKey] = {
            ...this.cachedSubformInputs[newModelName],
          };
        }
        this.subformState = newSubformState;

        // Check if sub-parameters exist
        const subParamsExist = this.checkSubParametersExist(newSubformState);
        this.subParametersExist = subParamsExist;
        if (subParamsExist) {
          this.currentVisibleParameters = this.getVisibleSubFormParameters(newSubformState);
          this.currentModelDisplayName = this.getKeyByValue(
            this.subformMeta.modelChoices,
            newModelName,
          );
        }
      },
    );
  },
  watch: {
    /**
     * If the state is changed locally, pass it up to the parent.
     */
    subformState: {
      deep: true,
      handler() {
        this.$emit('onChange', clonedeep(this.subformState));
      },
    },
    /**
     * If the state is changed by the parent, change the local values.
     */
    initialSubformState: {
      deep: true,
      handler() {
        this.subformState = clonedeep(this.initialSubformState);
        this.cachedSubformInputs = clonedeep(FORM_OPTION_DEFAULTS[this.formId]);
      },
    },
  },
  methods: {
    setValid(o, key, valid) {
      if (typeof o === 'object') {
        const obj = o;
        obj[key] = valid;
        this.$emit('is-valid', this.testValid(this.subformValid));
      }
    },
    initValid(ob) {
      const obj = ob;
      Object.keys(obj).forEach((key) => {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          return this.initValid(obj[key]);
        }
        obj[key] = true;
        return null;
      });
    },
    /**
     * Recursively tests if the provided object is valid.
     */
    testValid(obj) {
      let res = true;
      Object.keys(obj).forEach((key) => {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          res = res && this.testValid(obj[key]);
          // Exit out of loop
          return null;
        }
        res = res && obj[key];
        // Exit out of loop
        return null;
      });
      return res;
    },
    isVisible(parameterKey) {
      // Visible if parameter props do not exist or parameter props visible
      // property is not equal to false
      return !PARAMETER_PROPS[parameterKey]
        || PARAMETER_PROPS[parameterKey].visible !== false;
    },
    /**
     * Checks to see if subParameters exist for a particular model selection.
     * This checks if there is a parameters key and that at least one
     * parameter should be visible.
     *
     * @param {object} newSubFormState the new subformState
     */
    checkSubParametersExist(newSubFormState) {
      if (newSubFormState[this.subformMeta.paramsKey]) {
        const parameterKeys = Object.keys(newSubFormState[this.subformMeta.paramsKey]);
        let visibleParameterFound = false;
        let parameterIndex = 0;
        while (!visibleParameterFound && parameterIndex < parameterKeys.length) {
          if (this.isVisible(parameterKeys[parameterIndex])) {
            visibleParameterFound = true;
          }
          parameterIndex += 1;
        }
        return visibleParameterFound;
      }
      return false;
    },
    /**
     * Gets the visible subform parameters as an object. They are not visible if
     * `isVisible` returns false or the value is `null`. The value does not
     * update in real time so the value should only be used for checking the
     * type in this way.
     *
     * This should be called whenever the model changes, and
     * `checkSubParametersExist` returns true.
     *
     * @param {object} newSubFormState the new subformState
     */
    getVisibleSubFormParameters(newSubFormState) {
      const visibleSubFormParameters = {};
      if (newSubFormState[this.subformMeta.paramsKey]) {
        Object.entries(newSubFormState[this.subformMeta.paramsKey]).forEach(([key, value]) => {
          if (this.isVisible(key) && value !== null) {
            visibleSubFormParameters[key] = value;
          }
        });
      }
      return visibleSubFormParameters;
    },
    /**
     * Used to find the model name of the currently selected model.
     */
    getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    },
  },
};
</script>
