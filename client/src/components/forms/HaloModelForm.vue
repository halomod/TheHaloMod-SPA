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
      <div class="md-layout-item">
        <div v-for="(input, inputName) in haloModelDefaultModel"
          :key="input.id">
          <div v-if="inputName === 'log_r_range' || inputName === 'log_k_range'">
            <label style="font-size:12px;opacity:1;color:rgba(0,0,0,0.54)">
              {{input.label}}
            </label>
            <ejs-slider
              style="width:300px;min-height:45px;padding-top:16px;"
              :value="input.value"
              :tooltip="{ showOn: 'Hover', isVisible: true }"
              :min="input.min"
              :max="input.max"
              :step="input.step"
              :ticks="{ placement: 'Before', largeStep: 1, smallStep: 0.5, showSmallTicks: true }"
              :type="'Range'"
              v-model="input.model"
            />
          </div>
          <md-checkbox
            v-else-if="inputName === 'force_1halo_turnover'"
            v-model="model[inputName]">
            Force 1-halo turnover?
          </md-checkbox>
          <DoubleField v-else
            :key="inputName"
            :param="input.label"
            :value='input.value'
            :min="input.min"
            :max="input.max"
            range=true
            v-model="model[inputName]"
            />
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import DoubleField from '@/components/DoubleField.vue';
import clonedeep from 'lodash.clonedeep';

const haloModelChoices = {
  linear: 'linear',
  nonlinear: 'nonlinear',
  'filtered linear': 'filtered_lin',
  'filtered non-linear': 'filtered_n1',
};

const haloModelDefaultModel = {
  log_r_range: {
    label: 'Scale (log10)',
    min: -3.0,
    max: 3.0,
    value: [-2.0, 2.1],
    step: 0.05,
    model: 'log_r_model',
  },
  rnum: {
    label: 'Number of r bins',
    min: 5.0,
    max: 100,
    value: 5,
  },
  log_k_range: {
    label: 'Wavenumber (log10)',
    min: -3.0,
    max: 3.0,
    value: [-2.0, 2.0],
    step: 0.05,
    model: 'log_k_model',
  },
  hm_dlog10k: {
    label: 'Halo Model k bin size',
    min: 0.01,
    max: 1.0,
    value: 0.05,
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
  components: {
    DoubleField,
  },
  props: ['parent_model', 'init', 'subform_id'],
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      choices: haloModelChoices,
      model: clonedeep(this.init),
      haloModelDefaultModel,
    };
  },
  updated() {
    this.$emit('onChange', clonedeep(this.model));
  },
  activated() {
    this.model = clonedeep(this.init);
  },
  computed: {
    log_r_model: {
      get() {
        return [this.model.rmin, this.model.rmax];
      },
      set(newValue) {
        const [one, two] = newValue;
        this.model.rmin = one;
        this.model.rmax = two;
      },
    },
    log_k_model: {
      get() {
        return [this.model.hm_logk_min, this.model.hm_logk_max];
      },
      set(newValue) {
        const [one, two] = newValue;
        this.model.hm_logk_min = one;
        this.model.hm_logk_max = two;
      },
    },
  },
};
</script>

<style scoped>
  @import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
  @import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
  @import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
  @import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
</style>
