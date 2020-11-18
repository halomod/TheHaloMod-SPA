<template>
  <div>
    <p>{{doSomething(1)}}</p>
    <md-field>
      <label for="filterChoices">Filter Model</label>
      <md-select
        v-model="filterChoice"
        id="filterChoices"
        name="filterChoice"
      >
        <md-option
          v-for="(value, key) in filterChoices"
          :key="key"
          :value="key"
        >
          {{value}}
        </md-option>
      </md-select>
    </md-field>
    <p>{{doSomething(2)}}</p>
    <div v-if="Object.keys(allFilterData[filterChoice]).length !== 0">
      <p>{{doSomething('2.1')}}</p>
      <DoubleField
        v-for="(input, inputName) in filterData.filter_params"
        :key="inputName"
        :param="inputName"
        :value="input"
        v-on:input="createSetParamValueFunc(filterChoice)($event)"
      />
    </div>
    <p>{{doSomething(3)}}</p>
    <DoubleField
      :labelHtml="'&#948;<sub>c</sub>'"
      :min="1"
      :max="3"
      :value="deltaC"
      v-on:input="createSetValueFunc(deltaC)($event)"
    />
    <p>{{doSomething(4)}}</p>
  </div>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';

const filterChoices = {
  TopHat: 'Top-hat',
  Gaussian: 'Gaussian',
  SharpK: 'Sharp-k',
  SharpKEllipsoid: 'Sharp-k with ellipsoidal correction',
};
export default {
  name: 'FilterForm',
  title: 'Filter',
  id: 'filter',
  model: {
    prop: 'filterData',
    event: 'updateFilter',
  },
  props: {
    filterData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      allFilterData: BACKEND_CONSTANTS.filter_params,
      filterChoices,
      filterChoice: BACKEND_CONSTANTS.filter_model,
    };
  },
  components: {
    DoubleField,
  },
  methods: {
    createSetParamValueFunc(filterType, varName) {
      return (newValue) => {
        // Set the new value temporarily
        this.filterData.filter_params[varName] = newValue;
        this.allFilterData[filterType][varName] = newValue;

        // Set the value for good.
        this.$emit('updateFilter', this.filterData);
      };
    },
    /**
     * Sets a value at the top level of filterData.
     */
    createSetValueFunc(varName) {
      return (newValue) => {
        this.filterData[varName] = newValue;
        this.$emit('updateFilter', this.filterData);
      };
    },
    doSomething(val) {
      console.log(`rendered ${val}`);
    },
  },
  watch: {
    filterChoice(newChoice) {
      // If the new choice doesn't have extra params
      if (Object.keys(this.allFilterData[newChoice]) === 0) {
        // Remove the params
        delete this.filterData.filter_params;
      } else {
        // Add the params in
        this.filterData.filter_params = this.allFilterData[newChoice];
      }
      this.filterData.filter_model = newChoice;
      this.$emit('updateFilter', this.filterData);
    },
  },
};
</script>

<style>

</style>
