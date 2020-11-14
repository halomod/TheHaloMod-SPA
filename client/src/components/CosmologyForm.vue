<template>
  <div>
    <p>cosmoData is currently {{cosmoData}}</p>
    <p>allCosmoData is currently {{allCosmoData}}</p>
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

    <DoubleField
      v-for="(input, inputName) in inputs"
      :htmlParam="input.html"
      :key="inputName"
      :step="input.step"
      :value="cosmoData.cosmo_params[inputName]"
      v-on:input="createSetCurrentValueFunc(inputName)($event)"
      :min="input.min"
      :max="input.max"
    />
  </div>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';

export default {
  name: 'CosmologyForm',
  title: 'Cosmology',
  id: 'cosmology',
  props: {
    cosmoData: {
      type: Object,
      required: true,
    },
  },
  model: {
    prop: 'cosmoData',
    event: 'updateCosmo',
  },
  data() {
    return {
      inputs: {
        H0: {
          html: 'H<sub>0</sub>',
          min: 10,
          max: 500,
          step: 1,
        },
        Ob0: {
          html: '&#937;<sub>b</sub>',
          min: 0.005,
          max: 0.65,
          step: 0.001,
        },
        Om0: {
          html: '&#937;<sub>m</sub>',
          min: 0.02,
          max: 2,
          step: 0.01,
        },
        z: {
          html: 'Redshift',
          min: 0,
          max: 1100,
        },
        n: {
          html: 'n<sub>s</sub>',
          min: -4,
          max: 3,
          helpText: 'Spectral Index',
        },
        sigma_8: {
          html: '&#963<sub>8</sub>',
          min: 0.1,
          helpText: 'RMS Mass Fluctuations',
        },
      },
      /**
       * Represents the different selections of the cosmo model and saves the
       * users' inputs for each.
       */
      allCosmoData: JSON.parse(JSON.stringify(BACKEND_CONSTANTS.cosmo_params)),
      cosmologyChoices: Object.keys(BACKEND_CONSTANTS.cosmo_params),
      cosmologyChoice: this.cosmoData.cosmo_model,
    };
  },
  components: {
    DoubleField,
  },
  created() {
    if (this.cosmoData.cosmo_params === null) {
      const {
        H0, Ob0, Om0, z, n, sigma_8,
      } = BACKEND_CONSTANTS.cosmo_params.Planck13;
      this.cosmoData.cosmo_params = {
        H0,
        Ob0,
        Om0,
      };
      this.cosmoData.z = z;
      this.cosmoData.n = n;
      this.cosmoData.sigma_8 = sigma_8;
      this.cosmoData.cosmo_model = 'Planck13';
      this.cosmologyChoice = 'Planck13';
      this.$emit('updateCosmo', this.cosmoData);
    }
  },
  methods: {
    createSetCurrentValueFunc(inputType) {
      return (newValue) => {
        // Set the new value temporarily
        this.cosmoData.cosmo_params[inputType] = newValue;

        // Set the value in allCosmoData
        this.allCosmoData[this.cosmoData.cosmo_model][inputType] = newValue;

        // Set the value for good.
        this.$emit('updateCosmo', this.cosmoData);
      };
    },
  },
  watch: {
    /**
     * Watches for changes in the choice of cosmology. When a new choice is
     * made, then all the stored values are copied over.
     */
    cosmologyChoice(newChoice) {
      this.cosmoData.cosmo_model = newChoice;
      Object.keys(this.cosmoData.cosmo_params).forEach((param) => {
        this.cosmoData.cosmo_params[param] = this.allCosmoData[newChoice][param];
      });
      this.cosmoData.z = this.allCosmoData[newChoice].z;
      this.cosmoData.n = this.allCosmoData[newChoice].n;
      this.cosmoData.sigma_8 = this.allCosmoData[newChoice].sigma_8;
      this.$emit('updateCosmo', this.cosmoData);
    },
  },
};
</script>

<style>

</style>
