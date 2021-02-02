<template>
  <div class="halo-exclusion">
    <md-field>
      <label>Halo Exclusion</label>
      <md-select v-model="model.exclusion_model">
        <div v-for="(value, key) in values" :key="key">
          <md-option :value="key">{{value}}</md-option>
        </div>
      </md-select>
    </md-field>
  </div>
</template>

<script>
import CONSTANTS from '@/constants/backend_constants';
import clonedeep from 'lodash.clonedeep';

export default {
  name: 'HaloExclusion',
  props: ['parent_model', 'init'],
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      model: this.init,
      values: CONSTANTS.Exclusion_options,
    };
  },
  watch: {
    'model.exclusion_model': {
      handler() {
        this.$emit('onChange', clonedeep(this.model));
      },
    },
  },
};
</script>
