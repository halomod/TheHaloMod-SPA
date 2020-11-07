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
    <p>cosmoDefaults are {{hmfDefaults.cosmo}}</p>
    <p>allCosmoData is {{allCosmoData}}</p>

    <FormNumberField
      :labelHtml="'<label>Something</label>'"
    />

    <InputField
      v-for="(input, inputName) in inputs"
      :labelHtml="input.html"
      :key="inputName"
      :step="input.step"
      :currentValue="cosmoData.cosmo_params[inputName]"
      v-on:updateCurrentValue="createSetCurrentValueFunc(inputName)($event)"
      :min="input.min"
      :max="input.max"
    />

    <!--
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
    -->
  </div>
</template>

<script>
import FormNumberField from './FormNumberField.vue';
import InputField from './InputField.vue';

export default {
  name: 'CosmologyForm',
  title: 'Cosmology',
  id: 'cosmology',
  props: {
    hmfDefaults: {
      type: Object,
      required: true,
    },
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
      /**
       * Represents the different selections of the cosmo model and saves the
       * users' inputs for each.
       */
      allCosmoData: JSON.parse(JSON.stringify(this.hmfDefaults.cosmo)),
      cosmologyChoices: Object.keys(this.hmfDefaults.cosmo),
      cosmologyChoice: this.cosmoData.cosmo_model,
    };
  },
  components: {
    FormNumberField,
    InputField,
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
     * made, then all the stored values are copied over
     */
    cosmologyChoice(newChoice) {
      this.cosmoData.cosmo_model = newChoice;
      Object.keys(this.cosmoData.cosmo_params).forEach((param) => {
        this.cosmoData.cosmo_params[param] = this.allCosmoData[newChoice][param];
      });
      this.$emit('updateCosmo', this.cosmoData);
    },
  },
};
</script>

<style>

</style>
