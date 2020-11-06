<template>
  <div>
    <md-field>
      <label for="cosmologyChoices">Cosmology</label>
      <md-select v-model="cosmologyChoice" id="cosmologyChoices" name="cosmologyChoice">
        <md-option
          v-for="choice in cosmologyChoices"
          :key="choice"
          :value="choice"
        >
          {{choice}}
        </md-option>
      </md-select>
    </md-field>

    <p>cosmoData is {{cosmoData}}</p>

    <FormNumberField
      :labelHtml="'<label>Something</label>'"
    />

    <FormNumberField
      v-for="(input, inputName) in inputs"
      :labelHtml="input.html"
      :key="inputName"
      :step="input.step"
      :currentValue="cosmoData.cosmo_params[inputName]"
      :min="input.min"
      :max="input.max"
      :setCurrentValue="createSetCurrentValueFunc(inputName)"
    />
  </div>
</template>

<script>
import FormNumberField from './FormNumberField.vue';

const cosmologyChoices = [
  'Planck15',
  'Planck13',
  'WMAP9',
  'WMAP7',
  'WMAP5',
];
export default {
  name: 'CosmologyForm',
  title: 'Cosmology',
  id: 'cosmology',
  props: {
    hmfDefaults: Object,
    /**
     * Has a general form like so:
     *
     * ```
     * cosmoData: {
        cosmo_model: 'Planck15',
        cosmo_params: {
          H0: 0,
          Ob0: 0,
          Om0: 0,
        },
      },
     * ```
     */
    cosmoData: Object,
  },
  model: {
    prop: 'cosmoData',
    event: 'updateCosmo',
  },
  data: () => ({
    inputs: {
      H0: {
        html: '<label>H<sub>0</sub></label>',
        min: 10,
        max: 500,
        step: 1,
      },
      Ob0: {
        html: '<label>&#937;<sub>b</sub></label>',
        min: 0.005,
        max: 0.65,
        step: 0.001,
      },
      Om0: {
        html: '<label>&#937;<sub>m</sub></label>',
        min: 0.02,
        max: 2,
        step: 0.01,
      },
    },
    cosmologyChoices,
    cosmologyChoice: cosmologyChoices[0],
  }),
  components: {
    FormNumberField,
  },
  methods: {
    createSetCurrentValueFunc(inputType) {
      return (newValue) => {
        // Set the new value temporarily
        this.cosmoData.cosmo_params[inputType] = newValue;

        // Set the value for good.
        this.$emit('updateCosmo', this.cosmoData);
      };
    },
  },
  watch: {
    /**
     * Watches for changes in the choice of cosmology. When a new choice is
     * made, then all the defaults are copied over.
     */
    cosmologyChoice() {
      const newCosmoDataObject = { ...this.cosmoData };
      Object.keys(this.cosmoData.cosmo_params).forEach((key) => {
        newCosmoDataObject.cosmo_params[key] = this.hmfDefaults.cosmo[this.cosmologyChoice][key];
      });
      this.$emit('updateCosmo', this.cosmoData);
    },
  },
};
</script>

<style>

</style>
