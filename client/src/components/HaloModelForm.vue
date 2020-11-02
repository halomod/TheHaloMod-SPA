<template>
  <!-- These 2 divs are import to maintain a material design layout -->
  <!-- This div starts a flexable container -->
  <div class="md-layout md-gutter">
    <!-- This marks an item in the previous container -->
    <div class="md-layout-item">
      <md-subheader>Halo Model</md-subheader>
      <md-divider></md-divider>
      <!-- This div starts a new flex container with the HaloMod form inputs -->
      <div class="md-layout md-gutter">
        <!-- Here is where its repeating to load the input -->
        <div v-for="(input, inputName) in inputs" :key="input.id" class="md-layout-item">
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
    </div>
  </div>
</template>

<script>
import InputField from './InputField.vue';

// Objects used in the html
export default {
  name: 'HaloModelForm',
  components: {
    InputField,
  },
  props: {
    hmfDefaults: Object,
    formValues: Object,
    setForm: Function,
  },
  data: () => ({
    inputs: {
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
        max: 100.0,
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
      hc_spectrum: {
        label: 'Halo Centre Spectrum',
        options: {
          linear: 'linear',
          nonlinear: 'nonlinear',
          filtered_lin: 'filtered linear',
          filtered_n1: 'filtered non-linear',
        },
        value: 'linear',
        inputType: 'option',
      },
      force_1halo_turnover: {
        label: 'Force 1-halo turnover?',
        value: 1,
        inputType: 'checkbox',
      },
    },
  }),

  methods: {
    createSetCurrentValueFunc(inputType1) {
      return (newValue) => {
        console.log(inputType1);
        // Set the new value temporarily
        this.formValues[inputType1] = newValue;

        // Set the value for good.
        this.setForm(this.formValues);
      };
    },
  },
};
</script>

<style lang='css' scoped>
.md-layout-item {
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
