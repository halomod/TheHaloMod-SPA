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

    <div v-if="filterParams[filterModel] !== undefined">
      <InputField
        v-for="(input, inputName) in filterParams[filterModel]"
        :labelHtml="'<label>' + inputName + '</label>'"
        :key="inputName"
        :step="1"
        :currentValue="filterParams[filterModel][inputName]"
        v-on:updateCurrentValue="createSetCurrentValueFunc(filterModel, inputName)($event)"
      />
    </div>

    <InputField
      :labelHtml="'<label>&#948;<sub>c</sub></label>'"
      :step=".1"
      :min="1"
      :max="3"
      :currentValue="deltaC"
      v-on:updateCurrentValue="setDeltaC($event)"
    />

  </div>
</template>

<script>
import InputField from './InputField.vue';

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
      filterChoices,
      filterChoice: this.filterData.filter_model,
    };
  },
  components: {
    InputField,
  },
  methods: {
    createSetCurrentValueFunc(filterType, varName) {
      return (newValue) => {
        // Set the new value temporarily
        this.filterData.filter_params[filterType][varName] = newValue;

        // Set the value for good.
        this.$emit('updateFilter', this.filterData);
      };
    },
  },
  watch: {
    filterChoice(newChoice) {
      this.filterData.filter_model = newChoice;
      this.$emit('updateFilter', this.filterData);
    },
  },
};
</script>

<style>

</style>
