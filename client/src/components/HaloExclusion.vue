<template>
  <div class="halo-exclusion">
    <md-field>
      <label>Halo Exclusion*</label>
      <md-select v-model="model.exclusion_model">
        <div v-for="(value, key) in values" :key="key">
          <md-option :value="key">{{value}}</md-option>
        </div>
      </md-select>
    </md-field>
  </div>
</template>

<script>
import { exclusion as EXCLUSION_CONSTANTS } from '@/constants/form_choices.json';

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
      values: EXCLUSION_CONSTANTS.main,
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
