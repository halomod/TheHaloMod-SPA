<template>
  <div>
    <md-field>
      <label for="choices">Filter Model</label>
      <md-select
        v-model="model.filter_model"
        id="filterChoices"
        name="filterChoices">
        <md-option
          v-for="(value, key) in choices"
          :key="key"
          :value="key">
          {{value}}
        </md-option>
      </md-select>
    </md-field>
    <DoubleField
      v-for="(input, inputName) in model.filter_params"
      :key="inputName"
      :param="inputName"
      :value="input"
      v-model="model.filter_params[inputName]"/>
    <DoubleField
      :html="'&#948;<sub>c</sub>'"
      :min="1"
      :max="3"
      :value="model.delta_c"
      v-model="model.delta_c"/>
  </div>
</template>

<script>
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import DoubleField from '@/components/DoubleField.vue';
import clonedeep from 'lodash.clonedeep';

const filterChoices = {
  TopHat: 'Top-hat',
  Gaussian: 'Gaussian',
  SharpK: 'Sharp-k',
  SharpKEllipsoid: 'Sharp-k with ellipsoidal correction',
};
export default {
  name: 'FilterForm',
  model: {
    prop: 'filterData',
    event: 'updateFilter',
  },
  props: ['init'],

  data() {
    return {
      model: clonedeep(this.init),
      allFilterData: clonedeep(BACKEND_CONSTANTS.Filter_params),
      choices: filterChoices,
    };
  },
  components: {
    DoubleField,
  },
  activated() {
    this.model = clonedeep(this.init);
  },
  watch: {
    'model.filter_model': function updateOptions(newValue, oldValue) {
      this.allFilterData[oldValue] = clonedeep(this.model.filter_params);
      this.model.filter_params = this.allFilterData[newValue];
    },
  },
  updated() {
    this.$emit('updateFilter', clonedeep(this.model));
  },
};
</script>

<style>

</style>
