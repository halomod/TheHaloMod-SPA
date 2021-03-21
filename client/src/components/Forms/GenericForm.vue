<template>
  <form novalidate>

    <div class='md-layout md-gutter'>
      <div v-for="(value, key) in localHMModelFlat" :key="key" class='md-layout-item'>
        <div v-if="key === model_key">
          <md-field>
            <label>{{title}}</label>
            <md-select v-model="localHMModelFlat[model_key]">
              <md-option
                v-for="(value, choice) in modelChoices"
                :key="choice"
                :value="value">
                {{choice}}
              </md-option>
            </md-select>
          </md-field>
        </div>
        <div v-else>
          <div v-if="key === params_key" >
            <div
              v-for="(paramsValue, paramsKey) in value"
              :key="paramsKey"
            >
              <div v-if="!isVisible(paramsKey)"/>
              <md-checkbox
                v-else-if="typeof paramsValue === 'boolean'"
                class="md-primary"
                v-model="localHMModelFlat[params_key][paramsKey]">
                {{paramsKey}}
              </md-checkbox>
              <md-field v-else-if="typeof paramsValue === 'string'">
                <label>{{getParameterLabel(paramsKey)}}</label>
                <md-select v-model="localHMModelFlat[params_key][paramsKey]">
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
                    v-model="localHMModelFlat[params_key]"
                  />
                </div>
              </div>
              <double-field
                v-else
                :init="localHMModelFlat[params_key][paramsKey]"
                v-model="localHMModelFlat[params_key][paramsKey]"
                v-bind="getDoubleFieldProps(paramsKey)"/>
            </div>
          </div>
          <div v-else>
            <div v-if="!isVisible(key)"/>
            <md-checkbox
              v-else-if="typeof value === 'boolean'"
              class="md-primary"
              v-model="localHMModelFlat[key]">
              {{key}}
            </md-checkbox>
            <md-field v-else-if="typeof value === 'string'">
              <label>{{getParameterLabel(key)}}</label>
              <md-select v-model="localHMModelFlat[key]">
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
                v-model="localHMModelFlat"
              />
            </div>
            <double-field
              v-else
              :init="localHMModelFlat[key]"
              v-model="localHMModelFlat[key]"
              v-bind="getDoubleFieldProps(key)"/>
          </div>
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
import isEqual from 'lodash.isequal';
import PARAMETER_PROPS from '@/constants/parameter_properties.js';

const debug = Debug('GenericForm.vue');
debug.enabled = false;

export default {
  name: 'GenericForm',
  model: {
    event: 'onChange',
  },
  props: {
    relevantHMModelFlat: {
      type: Object,
      required: true,
    },
    /**
     * See `forms.js` for descriptions on what each of the below props are for.
     */
    title: {
      type: String,
      required: true,
    },
    model_key: {
      type: String,
      required: false,
    },
    params_key: {
      type: String,
      required: true,
    },
    modelChoices: {
      type: Object,
      required: true,
    },
    /**
     * Holds the data for each model that could be chosen. The chosen model will
     * switch what is in localHMModelFlat to what is held inside, and
     * overwrite those values that correspond in localHMModelFlat.
     */
    modelChoicesData: {
      type: Object,
      required: true,
    },
    updateModelChoice: {
      type: Function,
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
       * A local version of the relevant hmModelFlat.
       */
      localHMModelFlat: clonedeep(this.relevantHMModelFlat),
      /**
       * The cached options that the user has selected previously for the
       * different models, but possibly haven't been saved to the server yet.
       */
      localModelChoicesData: clonedeep(this.modelChoicesData),
    };
  },
  created() {
    this.$watch(
      function toWatch() {
        return this.localHMModelFlat[this.model_key];
      },
      function updateParams(newModelName, oldModelName) {
        if (oldModelName === newModelName) return;
        // Use the method of updating appropriate to the form
        const [newHMModelFlat, newModelChoicesData] = this.updateModelChoice(
          oldModelName,
          newModelName,
          this.localHMModelFlat,
          this.localModelChoicesData,
        );
        // Change everything but the model name to avoid infinite loop
        delete newHMModelFlat[this.model_key];
        this.localHMModelFlat = Object.assign(
          this.localHMModelFlat,
          newHMModelFlat,
        );
        this.localModelChoicesData = newModelChoicesData;
      },
    );
  },
  watch: {
    /**
     * If the state is changed locally, pass it up to the parent.
     */
    localHMModelFlat: {
      deep: true,
      handler() {
        this.$emit('onChange', clonedeep(this.localHMModelFlat));
      },
    },
    /**
     * If the state is changed by the parent, change the local values.
     */
    relevantHMModelFlat: {
      deep: true,
      handler(newHMModelFlat) {
        if (!isEqual(this.localHMModelFlat, newHMModelFlat)) {
          this.localHMModelFlat = clonedeep(this.relevantHMModelFlat);
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

      return { ...Object.assign(doubleProps, parameterProps) };
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
      return PARAMETER_PROPS[parameterKey]
        && PARAMETER_PROPS[parameterKey].visible !== false;
    },
    isSlider(parameterKey) {
      const parameterProps = PARAMETER_PROPS[parameterKey];
      if (!parameterProps || !parameterProps.rangeSlider) {
        return false;
      }
      return true;
    },
    isSliderMin(parameterKey) {
      const parameterProps = PARAMETER_PROPS[parameterKey];
      if (!parameterProps || !parameterProps.rangeSlider
      || !parameterProps.rangeSlider.isRangeSliderMin) {
        return false;
      }
      return true;
    },
  },
};
</script>
