<template>
  <form novalidate>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>Halo Centre Spectrum</label>
          <md-select v-model="model.hc_spectrum" md-dense>
            <md-option
              v-for="(value, choice) in choices"
              :key="choice"
              :value="value">
              {{choice}}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div v-for="(input, inputName) in haloModelDefaultModel"
        :key="input.id" class="md-layout-item">
        <InputField v-if="inputName === 'force_1halo_turnover'"
          :key="inputName"
          :label="input.label"
          :step="input.step"
          :currentValue="input.value"
          :min="input.min"
          :max="input.max"
          :inputName="inputName"
          :inputType="input.inputType"
          :options="input.options"
          :setCurrentValue="null"
          v-model="model[inputName]"
        />
        <double-field v-else
          :key="inputName"
          :label="input.label"
          :step="input.step"
          :value="input.value"
          :min="input.min"
          :max="input.max"
          range=true
          v-model="model[inputName]"
          />
      </div>
    </div>
  </form>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';
import InputField from './InputField.vue';

const haloModelChoices = {
  linear: 'linear',
  nonlinear: 'nonlinear',
  'filtered linear': 'filtered_lin',
  'filtered non-linear': 'filtered_n1',
};

const haloModelDefaultModel = {
  rmin: {
    label: 'Scale Min (log10)',
    min: -3.0,
    max: 3.0,
    value: -2,
    step: 0.05,
  },
  rmax: {
    label: 'Scale Max (log10)',
    min: -3.0,
    max: 3.0,
    value: 2.1,
    step: 0.05,
  },
  rnum: {
    label: 'Number of r bins',
    min: 5.0,
    max: 100,
    value: 5,
    inputType: 'number',
  },
  hm_logk_min: {
    label: 'Wavenumber Min (log10)',
    min: -3.0,
    max: 100.0,
    value: -2,
    step: 0.05,
  },
  hm_logk_max: {
    label: 'Wavenumber Max (log10)',
    min: -3.0,
    max: 100.0,
    value: 2,
    step: 0.05,
  },
  hm_dlog10k: {
    label: 'Halo Model k bin size',
    min: 0.01,
    max: 1.0,
    value: 0.05,
    step: 0.01,
  },
  force_1halo_turnover: {
    label: 'Force 1-halo turnover?',
    value: 1,
    inputType: 'checkbox',
  },
};

// Objects used in the html
export default {
  name: 'HaloModelForm',
  title: 'Halo Model',
  id: 'halo_model',
  components: {
    InputField,
    DoubleField,
  },
  props: ['parent_model'],
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      choices: haloModelChoices,
      model: {
        hc_spectrum: 'linear',
        ...BACKEND_CONSTANTS.halo_model_params,
      },
      haloModelDefaultModel,
    };
  },
  updated() {
    this.$emit('onChange', this.model);
  },
};
</script>
