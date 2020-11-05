<template>
  <form novalidate>
    <md-field>
      <label>Tracer Concentration</label>
      <md-select v-on:md-selected="updateOptions" v-model="model.tracer_concentration_model">
        <md-option
          v-for="(value, choice) in tracerConcentrationChoices"
          :key="choice"
          :value="value">
          {{choice}}
        </md-option>
      </md-select>
    </md-field>
    <double-field
      v-for="(value, param) in model.tracer_concentration_params"
      :value="value"
      :key="param"
      :param="param"
      range=false
      :placeholder="String(defaults[param])"
      v-model="model.tracer_concentration_params[param]"/>
  </form>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';

const tracerConcentrationChoices = {
  'Bullock (2001) Physical Form': 'Bullock01',
  'Bullock (2001) Power-Law': 'Bullock01Power',
  'Duffy (2008) Power-Law': 'Duffy08',
  'Zehavi (2011) Power-Law': 'Zehavi11',
  'Ludlow (2016)': 'Ludlow16',
  'Ludlow (2016) Empirical': 'Ludlow16Empirical',
};

const tracerConcentrationParams = BACKEND_CONSTANTS.CMRelation_params;

export default {
  name: 'TracerConcentrationForm',
  data: () => ({
    tracerConcentrationChoices,
    model: {
      tracer_concentration_model: 'Bullock01',
      tracer_concentration_params: tracerConcentrationParams.Bullock01,
    },
    defaults: tracerConcentrationParams.Bullock01,
  }),
  components: {
    DoubleField,
  },
  updated() {
    console.log(this.model);
  },
  methods: {
    updateOptions() {
      const params = tracerConcentrationParams;
      this.model.tracer_concentration_params = null;
      // eslint-disable-next-line
      this.$nextTick(function () {
        this.model.tracer_concentration_params = params[this.model.tracer_concentration_model];
        this.defaults = tracerConcentrationParams[this.model.tracer_concentration_model];
      });
    },
  },
};
</script>
