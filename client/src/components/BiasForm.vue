<template>
  <form novalidate>
    <md-field>
      <label>Bias</label>
      <md-select v-on:md-selected="updateOptions" v-model="model.bias_model">
        <md-option
          v-for="(value, choice) in biasChoices"
          :key="choice"
          :value="value">
          {{choice}}
        </md-option>
      </md-select>
    </md-field>
    <double-field
      v-for="(value, param) in model.bias_params"
      :value="value"
      :key="param"
      :param="param"
      range=false
      :placeholder="String(defaults[param])"
      v-model="model.bias_params[param]"/>
  </form>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';

const biasChoices = {
  'Tinker (2010)': 'Tinker10',
  Unbiased: 'UnityBias',
  'Mo (1996)': 'Mo96',
  'Jing (1998)': 'Jing98',
  'Sheth-Tormen (1999)': 'ST99',
  'Sheth-Mo-Tormen (2001)': 'SMT01',
  'Seljak (2004) Without Cosmo': 'Seljak04',
  'Seljack (2004) With Cosmo': 'Seljak04Cosmo',
  'Mandelbaum (2005)': 'Mandelbaum05',
  'Pillepich (2010)': 'Pillepich10',
  'Manera (2010)': 'Manera10',
  'Tinker (2010) Peak-Background Split': 'Tinker10PBSplit',
};

const biasParams = BACKEND_CONSTANTS.Bias_params;

export default {
  name: 'BiasForm',
  data: () => ({
    biasChoices,
    model: {
      bias_model: 'Tinker10',
      bias_params: biasParams.Tinker10,
    },
    defaults: biasParams.Tinker10,
  }),
  components: {
    DoubleField,
  },
  updated() {
    console.log(this.model);
  },
  methods: {
    updateOptions() {
      this.model.bias_params = biasParams[this.model.bias_model];
      this.defaults = biasParams[this.model.bias_model];
    },
  },
};
</script>
