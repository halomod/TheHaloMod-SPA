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

export default {
  title: 'Halo Exclusion',
  name: 'HaloExclusion',
  id: 'halo-exclusion',
  props: ['parent_model'],
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      model: {
        exclusion_model: 'NoExclusion',
      },
      values: CONSTANTS.Exclusion_options,
    };
  },
  watch: {
    'model.exclusion_model': {
      handler() {
        this.$emit('onChange', this.model);
      },
    },
  },
};
</script>
