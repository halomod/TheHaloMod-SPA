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
      <FormNumberField
        v-for="(input, inputName) in filterParams[filterModel]"
        :labelHtml="'<label>' + inputName + '</label>'"
        :key="inputName"
        :step="1"
        :currentValue="filterParams[filterModel][inputName]"
        :setCurrentValue="createSetCurrentValueFunc(filterModel, inputName)"
      />
    </div>

    <FormNumberField
      :labelHtml="'<label>&#948;<sub>c</sub></label>'"
      :step=".1"
      :min="1"
      :max="3"
      :currentValue="deltaC"
      :setCurrentValue="setDeltaC"
    />

  </div>
</template>

<script>
import FormNumberField from './FormNumberField.vue';

const filterChoices = {
  TopHat: 'Top-hat',
  Gaussian: 'Gaussian',
  SharpK: 'Sharp-k',
  SharpKEllipsoid: 'Sharp-k with ellipsoidal correction',
};
export default {
  name: 'FilterForm',
  props: {
    deltaC: Number,
    setDeltaC: Function,
    filterModel: String,
    setFilterModel: Function,
    filterParams: Object,
    setFilterParams: Function,
  },
  data: () => ({
    filterChoices,
    filterChoice: '',
  }),
  components: {
    FormNumberField,
  },
  methods: {
    createSetCurrentValueFunc(filterType, varName) {
      return (newValue) => {
        // Set the new value temporarily
        this.filterParams[filterType][varName] = newValue;

        // Set the value for good.
        this.setFilterParams(this.filterParams);
      };
    },
  },
  mounted() {
    this.filterChoice = this.filterModel;
  },
  watch: {
    filterChoice() {
      this.setFilterModel(this.filterChoice);
    },
  },
};
</script>

<style>

</style>
