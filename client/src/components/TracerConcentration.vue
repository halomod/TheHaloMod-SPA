<template>
  <div class="container">
   <md-field class="selection">
      <label>Tracer Concentration</label>
      <md-select v-model="model.concentration_select">
        <div v-for="(value, key) in selection_values" :key="key">
          <md-option :value="key">{{value}}</md-option>
        </div>
      </md-select>
    </md-field>
    <div class="additional">
    </div>
  </div>
</template>
<script>
import { concentration as CONCENTRATION_CONSTANTS } from '@/constants/form_choices.json';

export default {
  name: 'TracerConcentration',
  title: 'Tracer Concentration',
  id: 'tracer-concentration',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      model: {
        concentration_select: 'Bullock01',
      },
      selection_values: CONCENTRATION_CONSTANTS.main,
      additional_values: CONCENTRATION_CONSTANTS.additional,
    };
  },
};
</script>

<style scoped>
.container {
  display:flex;
  flex-direction: row;
}
.selection {
  width: 50%;
};
.additional {
  padding-left: 80px;
  width: 50%;
}
</style>
