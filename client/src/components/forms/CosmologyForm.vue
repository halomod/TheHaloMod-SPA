<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <DoubleField v-for="(input, key) in inputs.core"
          :key="key"
          :html="input.html"
          :step="input.step"
          :min="input.min"
          :max="input.max"
          :value="model[key]"
          v-model="model[key]"
          />
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label for="cosmologyChoices">Cosmology</label>
              <md-select v-model="model.cosmo_model" id="cosmologyChoices" name="cosmologyChoice">
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
            <DoubleField v-for="(input, key) in inputs.sub"
              :key="key"
              :html="input.html"
              :step="input.step"
              :min="input.min"
              :max="input.max"
              :value="model.cosmo_params[key]"
              v-model="model.cosmo_params[key]"
              />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import DoubleField from '@/components/DoubleField.vue';
import clonedeep from 'lodash.clonedeep';

const cosmoChoices = {
  Planck13: 'Planck13',
  Planck15: 'Planck15',
  WMAP5: 'WMAP5',
  WMAP7: 'WMAP7',
  WMAP9: 'WMAP9',
};

export default {
  name: 'CosmologyForm',
  props: ['init', 'subform_id'],
  model: {
    prop: 'cosmoData',
    event: 'updateCosmo',
  },
  data() {
    return {
      inputs: {
        sub: {
          H0: {
            html: 'H<sub>0</sub>',
            min: 10,
            max: 500,
            step: 1,
            path: 'H0',
          },
          Ob0: {
            html: '&#937;<sub>b</sub>',
            min: 0.005,
            max: 0.65,
            step: 0.001,
            path: 'Ob0',
          },
          Om0: {
            html: '&#937;<sub>m</sub>',
            min: 0.02,
            max: 2,
            step: 0.01,
            path: 'Om0',
          },
        },
        core: {
          z: {
            html: 'Redshift',
            min: 0,
            max: 1100,
            path: 'cosmo_params.z',
          },
          n: {
            html: 'n<sub>s</sub>',
            min: -4,
            max: 3,
            helpText: 'Spectral Index',
            path: 'cosmo_params.n',
          },
          sigma_8: {
            html: '&#963<sub>8</sub>',
            min: 0.1,
            helpText: 'RMS Mass Fluctuations',
            path: 'cosmo_params.sigma_8',
          },
        },
      },
      model: clonedeep(this.init),
      /**
       * Represents the different selections of the cosmo model and saves the
       * users' inputs for each.
       */
      allCosmoData: clonedeep(BACKEND_CONSTANTS.Cosmo_params),
      choices: cosmoChoices,
    };
  },
  components: {
    DoubleField,
  },
  activated() {
    this.model = clonedeep(this.init);
    this.allCosmoData = clonedeep(BACKEND_CONSTANTS.Cosmo_params);
  },
  watch: {
    'model.cosmo_model': function updateOptions(newValue, oldValue) {
      this.allCosmoData[oldValue] = clonedeep(this.model);
      this.model.cosmo_params = this.allCosmoData[newValue].cosmo_params;
      this.model.z = this.allCosmoData[newValue].z;
      this.model.n = this.allCosmoData[newValue].n;
      this.model.sigma_8 = this.allCosmoData[newValue].sigma_8;
    },
  },
  updated() {
    this.$emit('updateCosmo', clonedeep(this.model));
  },
};
</script>
