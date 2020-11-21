<template>
  <div>
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
    <div v-if="Object.keys(allFilterData[filterChoice]).length !== 0">
      <DoubleField
        v-for="(input, inputName) in filterData.filter_params"
        :key="inputName"
        :param="inputName"
        :value="input"
        v-on:input="createSetParamValueFunc(filterChoice, inputName)($event)"
      />
    </div>
    <DoubleField
      :htmlParam="'&#948;<sub>c</sub>'"
      :min="1"
      :max="3"
      :value="filterData.delta_c"
      v-on:input="createSetValueFunc('delta_c')($event)"
    />
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
      allFilterData: BACKEND_CONSTANTS.Filter_params,
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
        const newFilterObj = {
          ...this.filterData,
          filter_params: {
            ...this.filterData.filter_params,
          },
        };
        newFilterObj.filter_params[varName] = newValue;
        this.allFilterData[filterType][varName] = newValue;
        this.$emit('updateFilter', newFilterObj);
      };
    },
    /**
     * Sets a value at the top level of filterData.
     */
    createSetValueFunc(varName) {
      return (newValue) => {
        const newFilterObj = {
          ...this.filterData,
        };
        newFilterObj[varName] = newValue;
        this.$emit('updateFilter', newFilterObj);
      };
    },
  },
  watch: {
    filterChoice(newChoice) {
      const newFilterObj = {
        ...this.filterData,
      };
      // If the new choice doesn't have extra params
      if (Object.keys(this.allFilterData[newChoice]).length === 0) {
        delete newFilterObj.filter_params;
      } else {
        newFilterObj.filter_params = this.allFilterData[newChoice];
      }
      newFilterObj.filter_model = newChoice;
      this.$emit('updateFilter', newFilterObj);
    },
  },
};
</script>

<style>

</style>
