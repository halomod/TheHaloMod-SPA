<template>
  <form novalidate>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>Bias</label>
          <md-select v-model="model.bias_model">
            <md-option
              v-for="(value, choice) in choices"
              :key="choice"
              :value="value">
              {{choice}}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item">
        <double-field
          v-for="(value, param) in model.bias_params"
          :value="value"
          :key="param"
          :param="param"
          range=false
          v-model="model.bias_params[param]"/>
      </div>
    </div>
  </form>
</template>

<script>
import DoubleField from '@/components/DoubleField.vue';
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import clonedeep from 'lodash.clonedeep';

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

export default {
  name: 'BiasForm',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model', 'init', 'subform_id'],
  data() {
    return {
      model: clonedeep(this.init),
      choices: biasChoices,
    };
  },
  updated() {
    this.$emit('onChange', clonedeep(this.model));
  },
  activated() {
    this.model = clonedeep(this.init);
  },
  watch: {
    'model.bias_model': function updateOptions(val) {
      this.model.bias_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.bias_params = clonedeep(BACKEND_CONSTANTS.Bias_params[val]);
      });
    },
  },
  components: {
    DoubleField,
  },
};
</script>
