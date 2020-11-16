<template>
  <form novalidate>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
        <label>Growth</label>
          <md-select
          v-model="model.growth_model"
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
        v-for="(value, param) in model.growth_params"
        class="md-layout-item"
        :value="value"
        :key="param"
        :param="param"
        range=false
        :placeholder="String(defaults[param])"
        v-model="model.growth_params[param]"/>
    </div>
  </form>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';

const growthChoices = {
  Integral: 'GrowthFactor',
  GenMF: 'GenMFGrowth',
  'Carroll (1992)': 'Carroll1992',
};

// Objects used in the html
export default {
  name: 'GrowthForm',
  title: 'Growth',
  id: 'growth',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model'],
  data() {
    return {
      model: {
        growth_model: 'GrowthFactor',
        growth_params: BACKEND_CONSTANTS.GrowthFactor_params.GrowthFactor,
      },
      defaults: { ...BACKEND_CONSTANTS.GrowthFactor_params.GrowthFactor },
      choices: growthChoices,
    };
  },
  updated() {
    this.$emit('onChange', this.model);
  },
  watch: {
    'model.growth_model': function updateOptions(val) {
      this.model.growth_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.growth_params = BACKEND_CONSTANTS.GrowthFactor_params[val];
        this.defaults = BACKEND_CONSTANTS.GrowthFactor_params[val];
      });
    },
  },
  components: {
    DoubleField,
  },
};
</script>
