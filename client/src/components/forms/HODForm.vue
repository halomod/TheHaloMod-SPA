<template>
  <form novalidate>
    <md-field>
      <label>HOD</label>
      <md-select v-model="model.hod_model">
        <md-option
          v-for="(value, choice) in choices"
          :key="choice"
          :value="value">
          {{choice}}
        </md-option>
      </md-select>
    </md-field>
    <double-field
      v-for="(value, param) in model.hod_params"
      :value="value"
      :key="param"
      :param="param"
      range=false
      :placeholder="String(defaults[param])"
      v-model="model.hod_params[param]"/>
  </form>
</template>

<script>
import DoubleField from '@/components/DoubleField.vue';
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import clonedeep from 'lodash.clonedeep';

const hodChoices = {
  'Zehavi (3-param), 2005': 'Zehavi05',
  'Zheng (5-param), 2005': 'Zheng05',
  'Contreras (9-param), 2013': 'Contreras13',
  'Geach (8-param), 2012': 'Geach12',
  'Tinker (3-param), 2005': 'Tinker05',
  'Zehavi (2005) with max': 'Zehavi05WithMax',
  'Zehavi (2005) dimensional': 'Zehavi05Marked',
  'Continuous Power Law': 'ContinuousPowerLaw',
  'Constant Occupancy': 'Constant',
};

export default {
  name: 'HODForm',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model', 'init'],
  data() {
    return {
      model: clonedeep(this.init),
      defaults: this.init.hod_params,
      choices: hodChoices,
    };
  },
  updated() {
    this.$emit('onChange', clonedeep(this.model));
  },
  watch: {
    'model.hod_model': function updateOptions(val) {
      this.model.hod_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.hod_params = clonedeep(BACKEND_CONSTANTS.HOD_params[val]);
        this.defaults = clonedeep(BACKEND_CONSTANTS.HOD_params[val]);
      });
    },
  },
  components: {
    DoubleField,
  },
};
</script>
