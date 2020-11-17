<template>
  <form novalidate>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>Halo Model</label>
          <md-select v-model="model.halo_model" md-dense>
            <md-option
              v-for="(value, choice) in choices"
              :key="choice"
              :value="value">
              {{choice}}
            </md-option>
          </md-select>
        </md-field>
      </div>
      <div v-for="(input, inputName) in model.halo_model_params"
      :key="input.id" class="md-layout-item">
        <InputField
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
          v-model="model.halo_model_params"
        />
      </div>
    </div>
  </form>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
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
        halo_model: 'linear',
        halo_model_params: BACKEND_CONSTANTS.halo_model_params,
      },
      defaults: { },
    };
  },
  updated() {
    this.$emit('onChange', this.model);
  },
};
</script>
