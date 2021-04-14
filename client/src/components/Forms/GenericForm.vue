<template>
  <form novalidate>
    <!-- Core Paramaters (common to all model options)-->
    <div :class="subformMeta.coreParams ? 'md-layout md-gutter' : ''">
      <div :class="subformMeta.coreParams ? 'md-layout-item' : ''">
        <div v-for="key in subformMeta.coreParams" :key="key">
          <div v-if="!isVisible(key) || subformState[key] === null"/>
          <md-checkbox
            v-else-if="typeof subformState[key] === 'boolean'"
            class="md-primary"
            v-model="subformState[key]">
            {{getParameterLabel(key)}}
          </md-checkbox>
          <md-field v-else-if="typeof subformState[key] === 'string'">
            <label>{{getParameterLabel(key)}}</label>
            <md-select v-model="subformState[key]">
              <md-option
                v-for="(choiceName, choiceKey) in getParameterOptions(key)"
                :key="choiceKey"
                :value="choiceKey">
                {{choiceName}}
              </md-option>
            </md-select>
          </md-field>
          <input-slider
            v-else-if="isSlider(key) && isSliderMin(key)"
            :minParameterKey="key"
            v-model="subformState"
          />
          <double-field
            v-else-if="!isSlider(key)"
            :init="subformState[key]"
            v-model="subformState[key]"
            @is-valid="(valid) => isValid(subformValid, key, valid)"
            v-bind="getDoubleFieldProps(key)"/>
        </div>
        <div class="md-gutter">
          <div class="md-layout">
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
          <md-list v-if="subParametersExist" class="md-layout">
            <md-list-item md-expand :md-expanded="true">
              <span class="md-list-item-text">
                {{currentModelDisplayName}} Parameters
              </span>
              <md-list slot="md-expand">
                <md-list-item
                  v-for="(value, key) in currentVisibleParameters"
                  :key="key"
                >
                  <md-checkbox
                    v-if="typeof value === 'boolean'"
                    class="md-primary"
                    v-model="subformState[subformMeta.paramsKey][key]">
                    {{key}}
                  </md-checkbox>
                  <md-field v-else-if="typeof value === 'string'">
                    <label>{{getParameterLabel(key)}}</label>
                    <md-select v-model="subformState[subformMeta.paramsKey][key]">
                      <md-option
                        v-for="(choiceName, choiceKey) in getParameterOptions(key)"
                        :key="choiceKey"
                        :value="choiceKey">
                        {{choiceName}}
                      </md-option>
                    </md-select>
                  </md-field>
                  <double-field
                    v-else
                    :init="subformState[subformMeta.paramsKey][key]"
                    v-model="subformState[subformMeta.paramsKey][key]"
                    @is-valid="(valid) =>
                      isValid(subformValid[subformMeta.paramsKey], key, valid)"
                    v-bind="getDoubleFieldProps(key)"/>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
import DoubleField from '@/components/DoubleField.vue';
import InputSlider from '@/components/InputSlider.vue';
import Debug from 'debug';
import PARAMETER_PROPS from '@/constants/parameter_properties.js';
import forms from '@/constants/forms.js';
import { FORM_OPTION_DEFAULTS } from '@/constants/backend_constants.js';
import { getHtmlFromKey } from '@/utils/stringUtils';

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
    DoubleField,
    InputSlider,
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
    /**
     * @param {string} parameterKey
     */
    getDoubleFieldProps(parameterKey) {
      const parameterProps = PARAMETER_PROPS[parameterKey];
      const doubleProps = {
        plainName: parameterKey,
        range: false,
      };

      // Try to auto-convert key to HTML if a name isn't already defined
      if (!parameterProps || !(parameterProps.plainName || parameterProps.html)) {
        const htmlConversionResult = getHtmlFromKey(parameterKey);
        if (htmlConversionResult) {
          doubleProps.html = htmlConversionResult;
        }
      }

      // If properties do not exist, pass the default values
      if (!parameterProps) return doubleProps;

      return Object.assign(doubleProps, parameterProps);
    },
    /**
     * Gets a label for the given parameter. This should only be used on
     * parameters that have a string value.
     */
    getParameterLabel(parameterKey) {
      const parameterProps = PARAMETER_PROPS[parameterKey];
      if (parameterProps && parameterProps.plainName) {
        return parameterProps.plainName;
      }
      return parameterKey;
    },
    /**
     * Gets the options for a given parameter. This should only be used on
     * parameters that have a string value.
     */
    getParameterOptions(parameterKey) {
      const parameterProps = PARAMETER_PROPS[parameterKey];
      if (!parameterProps || !parameterProps.options) {
        console.error(`Error in parameter "${parameterKey}" \n`
        + 'No options were provided for the string value parameter in '
        + 'parameter_properties.js');
        return {};
      }
      return parameterProps.options;
    },
    isVisible(parameterKey) {
      // Visible if parameter props do not exist or parameter props visible
      // property is not equal to false
      return !PARAMETER_PROPS[parameterKey]
        || PARAMETER_PROPS[parameterKey].visible !== false;
    },
    isSlider(parameterKey) {
      const parameterProps = PARAMETER_PROPS[parameterKey];
      return parameterProps && parameterProps.rangeSlider;
    },
    isSliderMin(parameterKey) {
      return this.isSlider(parameterKey) && PARAMETER_PROPS[parameterKey]
        .rangeSlider.isRangeSliderMin;
    },
    isValid(o, key, valid) {
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
    testValid(obj) {
      let res = true;
      Object.keys(obj).forEach((key) => {
        if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
          res = res && this.testValid(obj[key]);
          return null;
        }
        res = res && obj[key];
        return null;
      });
      return res;
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
            debug('Parameter ', parameterKeys[parameterIndex], ' is visible');
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
      debug('getKeyByValue ran');
      return Object.keys(object).find((key) => object[key] === value);
    },
  },
};
</script>
