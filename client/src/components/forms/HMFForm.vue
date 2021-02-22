<template>
  <form novalidate>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <double-field
          param="Mass Range Min (log10)"
          v-model="model.Mmin"
          :value="model.Mmin"
          :placeholder="core_defaults.Mmin"
          range=true min=0 max=20 />
        <double-field
          param="Mass Range Max (log10)"
          v-model="model.Mmax"
          :value="model.Mmax"
          :placeholder="core_defaults.Mmax"
          range=true min=0 max=20 />
        <double-field
          param="Mass resolution (log10)"
          v-model="model.dlog10m"
          :value="model.dlog10m"
          :placeholder="core_defaults.dlog10m"
          range=true min=0.005 max=1 />
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>HMF</label>
              <md-select v-model="model.hmf_model">
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
            <double-field
              v-for="(value, param) in model.hmf_params"
              :value="value"
              :key="param"
              :param="param"
              range=false
              v-model="model.hmf_params[param]"/>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import DoubleField from '@/components/DoubleField.vue';
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import clonedeep from 'lodash.clonedeep';

const hmfChoices = {
  'Press-Schechter (1974)': 'PS',
  'Sheth-Mo-Tormen (2001)': 'SMT',
  'Jenkins (2001)': 'Jenkins',
  'Reed (2003)': 'Reed03',
  'Warren (2006)': 'Warren',
  'Reed (2007)': 'Reed07',
  'Peaock (2007)': 'Peacock',
  'Tinker (2008)': 'Tinker08',
  'Crocce (2010)': 'Crocce',
  'Courtin (2010)': 'Courtin',
  'Tinker (2010)': 'Tinker10',
  'Bhattacharya (2011)': 'Bhattacharya',
  'Angulo (2012)': 'Angulo',
  'Angulo (Subhaloes) (2012)': 'AnguloBound',
  'Watson (FoF Universal) (2012)': 'Watson_FoF',
  'Watson (Redshift Dependent) (2012)': 'Watson',
  'Behroozi (Tinker Extension to High-z) (2013)': 'Behroozi',
  'Pillepich (2010)': 'Pillepich',
  'Manera (2010)': 'Manera',
  'Ishiyama (2015)': 'Ishiyama',
};

export default {
  name: 'HMFForm',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model', 'init'],
  data() {
    return {
      model: clonedeep(this.init),
      core_defaults: {
        Mmin: this.init.Mmin,
        Mmax: this.init.Mmax,
        dlog10m: this.init.dlog10m,
      },
      choices: hmfChoices,
    };
  },
  activated() {
    this.model = clonedeep(this.init);
  },
  updated() {
    this.$emit('onChange', clonedeep(this.model));
  },
  watch: {
    'model.hmf_model': function updateOptions(val) {
      this.model.hmf_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.hmf_params = clonedeep(BACKEND_CONSTANTS.FittingFunction_params[val]);
      });
    },
  },
  components: {
    DoubleField,
  },
};
</script>
