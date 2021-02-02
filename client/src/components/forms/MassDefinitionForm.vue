<template>
  <form novalidate>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
        <label>Mass Definition</label>
          <md-select
            v-model="model.mdef_model"
            md-dense>
            <md-option
              v-for="(value, choice) in choices"
              :key="choice"
              :value="value">
              {{choice}}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <double-field
        v-for="(value, param) in model.mdef_params"
        class="md-layout-item"
        :value="value"
        :key="param"
        :param="param"
        range=false
        :placeholder="String(defaults[param])"
        v-model="model.mdef_params[param]"/>
    </div>
  </form>
</template>

<script>

import BACKEND_CONSTANTS from '@/constants/backend_constants';
import DoubleField from '@/components/DoubleField.vue';
import clonedeep from 'lodash.clonedeep';

const massDefinitionChoices = {
  'Use native definition of mass function': 'SOGeneric',
  'Spherical Overdensity wrt mean': 'SOMean',
  'Spherical Overdensity wrt critical': 'SOCritical',
  'Virial Spherical Overdensity (Bryan and Norman)': 'SOVirial',
  'Friends-of-Friends': 'FOF',
};

// Objects used in the html
export default {
  name: 'MassDefinitionForm',
  components: {
    DoubleField,
  },
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['init'],
  data() {
    return {
      model: clonedeep(this.init),
      defaults: this.init.mdef_params,
      choices: massDefinitionChoices,
    };
  },
  updated() {
    this.$emit('onChange', clonedeep(this.model));
  },
  watch: {
    'model.mdef_model': function updateOptions(val) {
      this.model.mdef_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.mdef_params = clonedeep(BACKEND_CONSTANTS.MassDefinition_params[val]);
        this.defaults = clonedeep(BACKEND_CONSTANTS.MassDefinition_params[val]);
      });
    },
  },
};
</script>
