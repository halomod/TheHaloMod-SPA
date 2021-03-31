<template>
  <form novalidate>
    <!-- Core Paramaters (common to all model options)-->
    <div v-for="key in subformMeta.coreParams" :key="key">
      <div v-if="!isVisible(key) || subformState[key] === null"/>
      <md-checkbox
        v-else-if="typeof subformState[key] === 'boolean'"
        class="md-primary"
        v-model="subformState[key]">
        {{key}}
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
        v-bind="getDoubleFieldProps(key)"/>
    </div>

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

    <!-- Subparameters (unique to model selection) -->
    <div v-for="(value, key) in subformState[subformMeta.paramsKey]" :key="key">
      <div v-if="!isVisible(key) || value === null"/>
      <md-checkbox
        v-else-if="typeof value === 'boolean'"
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
        v-bind="getDoubleFieldProps(key)"/>
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
      /**
       * The cached options that the user has selected previously for the
       * different models, but possibly haven't been saved to the server yet.
       */
      cachedSubformInputs: clonedeep(FORM_OPTION_DEFAULTS[this.formId]),

      subformMeta: forms[this.formId],
    };
  },
  created() {
    this.$watch(
      function toWatch() {
        return this.subformState[this.subformMeta.modelKey];
      },
      (newModelName, oldModelName) => {
        if (this.formId === 'cosmo') {
          this.cachedSubformInputs[oldModelName] = this.subformState;
          this.subformState = {
            ...this.cachedSubformInputs[newModelName],
            [this.subformMeta.modelKey]: newModelName,
          };
        } else {
          this.cachedSubformInputs[oldModelName] = {
            ...this.subformState[this.subformMeta.paramsKey],
          };
          this.subformState[this.subformMeta.paramsKey] = {
            ...this.cachedSubformInputs[newModelName],
          };
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
    getDoubleFieldProps(parameterKey) {
      const parameterProps = PARAMETER_PROPS[parameterKey];
      const doubleProps = {
        plainName: parameterKey,
        range: false,
      };

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
  },
};
</script>
