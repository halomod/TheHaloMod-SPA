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
        v-model="model.growth_params[param]"/>
    </div>
  </form>
</template>

<script>
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import DoubleField from '@/components/DoubleField.vue';
import clonedeep from 'lodash.clonedeep';

const growthChoices = {
  Integral: 'GrowthFactor',
  GenMF: 'GenMFGrowth',
  'Carroll (1992)': 'Carroll1992',
};

// Objects used in the html
export default {
  name: 'GrowthForm',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model', 'init'],
  data() {
    return {
      model: clonedeep(this.init),
      choices: growthChoices,
    };
  },
  updated() {
    this.$emit('onChange', clonedeep(this.model));
  },
  activated() {
    this.model = clonedeep(this.init);
  },
  watch: {
    'model.growth_model': function updateOptions(val) {
      this.model.growth_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.growth_params = clonedeep(BACKEND_CONSTANTS._GrowthFactor_params[val]); // eslint-disable-line
      });
    },
  },
  components: {
    DoubleField,
  },
};
</script>
