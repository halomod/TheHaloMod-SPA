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
      haloModelDefaultModel: BACKEND_CONSTANTS.halo_model_options,
    };
  },
  updated() {
    this.$emit('onChange', this.model);
  },
};
</script>
