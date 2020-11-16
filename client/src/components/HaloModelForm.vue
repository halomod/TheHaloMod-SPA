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
          :setCurrentValue="createSetCurrentValueFunc(inputName)"
        />
      </div>
    </div>
  </form>
</template>

<script>
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
        halo_model_params: {
          log_r_range: {
            label: 'Scale Range (log10)',
            min: -3.0,
            max: 3.0,
            value: -2,
            inputType: 'range',
            step: 0.05,
          },
          rnum: {
            label: 'Number of r bins',
            min: 5.0,
            max: 100,
            value: 5,
            inputType: 'number',
          },
          log_k_range: {
            label: 'Wavenumber Range (log10)',
            min: -3.0,
            max: 100.0,
            value: 3,
            inputType: 'range',
            step: 0.05,
          },
          hm_dlog10k: {
            label: 'Halo Model k bin size',
            min: 0.01,
            max: 1.0,
            value: 0.05,
            inputType: 'number',
            step: 0.01,
          },
          force_1halo_turnover: {
            label: 'Force 1-halo turnover?',
            value: 1,
            inputType: 'checkbox',
          },
        },
      },
      defaults: { },
    };
  },
  methods: {
    createSetCurrentValueFunc(inputType1) {
      return (newValue) => {
        // Set the new value temporarily
        this.formValues[inputType1] = newValue;
        // Set the value for good.
        this.setForm(this.formValues);
      };
    },
  },
};
</script>
