<template>
  <div v-if="!isVisible(parameterKey) || localParentObj[parameterKey] === null"/>
  <md-checkbox
    v-else-if="typeof localParentObj[parameterKey] === 'boolean'"
    class="md-primary"
    v-model="localParentObj[parameterKey]">
    {{getParameterLabel(parameterKey)}}
  </md-checkbox>
  <md-field v-else-if="typeof localParentObj[parameterKey] === 'string'">
    <label>{{getParameterLabel(parameterKey)}}</label>
    <md-select v-model="localParentObj[parameterKey]">
      <md-option
        v-for="(choiceName, choiceKey) in getParameterOptions(parameterKey)"
        :key="choiceKey"
        :value="choiceKey">
        {{choiceName}}
      </md-option>
    </md-select>
  </md-field>
  <input-slider
    v-else-if="isSlider(parameterKey) && isSliderMin(parameterKey)"
    :minParameterKey="parameterKey"
    v-model="localParentObj"
  />
  <double-field
    v-else-if="!isSlider(parameterKey)"
    :init="localParentObj[parameterKey]"
    v-model="localParentObj[parameterKey]"
    @is-valid="(valid) => $emit('is-valid', valid)"
    v-bind="getDoubleFieldProps(parameterKey)"/>
</template>

<script>
import PARAMETER_PROPS from '@/constants/parameter_properties';
import DoubleField from '@/components/DoubleField.vue';
import InputSlider from '@/components/InputSlider';
import { getHtmlFromKey } from '@/utils/stringUtils';
import clonedeep from 'lodash.clonedeep';
import isequal from 'lodash.isequal';
import Debug from 'debug';

const debug = Debug('Parameter.vue');
debug.enabled = false;

/**
 * The main component for a parameter in the GenericForm. This component
 * outputs an `onChange` event with the changed parent object when this
 * parameter changes.
 *
 * This also emits `is-valid` when the input is valid with the valid state
 * when this parameter changes.
 */
export default {
  name: 'Parameter',
  components: {
    DoubleField,
    InputSlider,
  },
  model: {
    event: 'onChange',
    prop: 'parentObj',
  },
  props: {
    parameterKey: {
      type: String,
      required: true,
    },
    /**
     * The parent object which contains the parameter key and parameter value.
     * This is passed to the slider if it should be a slider. It is also used
     * to change the data as convienience because this prop already exists.
     */
    parentObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localParentObj: clonedeep(this.parentObj),
    };
  },
  watch: {
    /**
     * If the state is changed locally, pass it up to the parent.
     */
    localParentObj: {
      deep: true,
      handler(newVal) {
        if (!isequal(newVal, this.parentObj)) {
          this.$emit('onChange', clonedeep(this.localParentObj));
        }
      },
    },
    /**
     * If the state is changed by the parent, change the local values.
     */
    parentObj: {
      deep: true,
      handler(newVal) {
        if (!isequal(newVal, this.localParentObj)) {
          this.localParentObj = clonedeep(this.parentObj);
        }
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
  },

};
</script>

<style>

</style>
