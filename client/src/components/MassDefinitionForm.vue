<template>
  <form novalidate>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
        <label>Mass Definition</label>
          <md-select
          v-model="model.mass_definition_model"
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
        v-for="(value, param) in model.mass_definition_params"
        class="md-layout-item"
        :value="value"
        :key="param"
        :param="param"
        range=false
        :placeholder="String(defaults[param])"
        v-model="model.mass_definition_params[param]"/>
    </div>
  </form>
</template>

<script>

import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';

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
  title: 'Mass Definition',
  id: 'mass_definition',
  components: {
    DoubleField,
  },
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model'],
  data() {
    return {
      model: {
        mass_definition_model: 'SOGeneric',
        mass_definition_params: BACKEND_CONSTANTS.MassDefinition_params.SOGeneric,
      },
      defaults: { ...BACKEND_CONSTANTS.MassDefinition_params.SOGeneric },
      choices: massDefinitionChoices,
    };
  },
  updated() {
    this.$emit('onChange', this.model);
  },
  watch: {
    'model.mass_definition_model': function updateOptions(val) {
      this.model.mass_definition_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.mass_definition_params = BACKEND_CONSTANTS.MassDefinition_params[val];
        this.defaults = BACKEND_CONSTANTS.MassDefinition_params[val];
      });
    },
  },
};
</script>
