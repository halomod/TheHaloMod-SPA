<template>
  <div>
    <label>
      {{sliderTitle}}
    </label>
    <ejs-slider
      style="width:300px;min-height:45px;padding-top:16px;"
      :value="sliderValue"
      :tooltip="{ showOn: 'Hover', isVisible: true }"
      :min="minParameterProps.min"
      :max="minParameterProps.max"
      :step="minParameterProps.step ? minParameterProps.step: undefined"
      :ticks="{
        placement: 'Before',
        largeStep: minParameterProps.rangeSlider.rangeSliderTickInterval ?
          minParameterProps.rangeSlider.rangeSliderTickInterval :
          1,
        smallStep: 0.5,
        showSmallTicks: true
      }"
      :type="'Range'"
      v-model="sliderValue"
    />
  </div>
</template>

<script>
import PARAMETER_PROPS from '@/constants/parameter_properties';
import clonedeep from 'lodash.clonedeep';

export default {
  name: 'InputSlider',
  model: {
    event: 'onChange',
    prop: 'parentObj',
  },
  props: {
    minParameterKey: {
      type: String,
      required: true,
    },
    parentObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      minParameterProps: PARAMETER_PROPS[this.minParameterKey],
      sliderValue: [
        this.parentObj[this.minParameterKey],
        this.parentObj[
          PARAMETER_PROPS[this.minParameterKey].rangeSlider.rangeSliderMaxParameter
        ],
      ],
      maxParameterKey: PARAMETER_PROPS[this.minParameterKey].rangeSlider.rangeSliderMaxParameter,
    };
  },
  computed: {
    sliderTitle() {
      if (this.minParameterProps.plainName) {
        return this.minParameterProps.plainName;
      }
      return this.minParameterKey;
    },
  },
  watch: {
    sliderValue(newVal) {
      const newParentObj = clonedeep(this.parentObj);
      const [newMin, newMax] = newVal;
      newParentObj[this.minParameterKey] = newMin;
      newParentObj[this.maxParameterKey] = newMax;
      this.$emit('onChange', newParentObj);
    },
  },
};
</script>

<style scoped>
  @import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
  @import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
  @import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
  @import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
</style>
