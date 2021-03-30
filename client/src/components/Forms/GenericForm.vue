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
      <double-field
        v-else
        :init="subformState[key]"
        v-model="subformState[key]"
        v-bind="getDoubleFieldProps(key)"/>
    </div>

    <!-- Model Selection -->
    <md-field>
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

        <!-- <div v-else>
          <div v-if="key === subformMeta.paramsKey" >
            <div
              v-for="(paramsValue, paramsKey) in value"
              :key="paramsKey"
            >
              <div v-if="!isVisible(paramsKey) || paramsValue === null"/>
              <md-checkbox
                v-else-if="typeof paramsValue === 'boolean'"
                class="md-primary"
                v-model="subformState[paramsKey]">
                {{paramsKey}}
              </md-checkbox>
              <md-field v-else-if="typeof paramsValue === 'string'">
                <label>{{getParameterLabel(paramsKey)}}</label>
                <md-select v-model="subformState[currentFormStateParamsKey][paramsKey]">
                  <md-option
                    v-for="(choiceName, choiceKey) in getParameterOptions(paramsKey)"
                    :key="choiceKey"
                    :value="choiceKey">
                    {{choiceName}}
                  </md-option>
                </md-select>
              </md-field>
              <div v-else-if="isSlider(paramsKey)">
                <div v-if="isSliderMin(paramsKey)">
                  <InputSlider
                    v-if="isSliderMin(paramsKey)"
                    :minParameterKey="paramsKey"
                    v-model="subformState[currentFormStateParamsKey]"
                  />
                </div>
              </div>
              <double-field
                v-else
                :init="subformState[currentFormStateParamsKey][paramsKey]"
                v-model="subformState[currentFormStateParamsKey][paramsKey]"
                v-bind="getDoubleFieldProps(paramsKey)"/>
            </div>
          </div>
          <div v-else>
            <div v-if="!isVisible(key)"/>
            <md-checkbox
              v-else-if="typeof value === 'boolean'"
              class="md-primary"
              v-model="subformState[key]">
              {{key}}
            </md-checkbox>
            <md-field v-else-if="typeof value === 'string'">
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
            <div v-else-if="isSlider(key)">
              <InputSlider
                v-if="isSliderMin(key)"
                :minParameterKey="key"
                v-model="subformState"
              />
            </div>
            <double-field
              v-else
              :init="subformState[key]"
              v-model="subformState[key]"
              v-bind="getDoubleFieldProps(key)"/>
          </div>
        </div> -->
  </form>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
import DoubleField from '@/components/DoubleField.vue';
// import InputSlider from '@/components/InputSlider.vue';
import Debug from 'debug';
import isEqual from 'lodash.isequal';
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
    // InputSlider,
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
        console.log('happening');
        if (oldModelName === newModelName) return;
        if (this.formId === 'cosmo') {
          this.cachedSubformInputs.cosmo[oldModelName] = this.subformState;
          this.subformState.cosmo = this.cachedSubformInputs[newModelName];
          console.log();
        } else {
          console.log('here');
          this.cachedSubformInputs[this.formId] = {
            ...this.subformState[this.subformMeta.paramsKey],
          };
          this.subformState[this.formId] = {
            ...this.subformState,
            [this.subformMeta.paramsKey]: this.cachedSubformInputs[newModelName],
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
    relevantFormState: {
      deep: true,
      handler(newFormState) {
        if (!isEqual(this.subformState, newFormState)) {
          this.subformState = clonedeep(this.relevantFormState);
        }
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
