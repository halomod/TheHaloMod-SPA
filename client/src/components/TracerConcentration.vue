<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
      <md-field>
        <label>Tracer Concentration</label>
        <md-select v-model="model.tracer_concentration_model">
          <md-option
            v-for="(value, key) in options"
            :key="key"
            :value="key">
            {{value}}
          </md-option>
        </md-select>
      </md-field>
    </div>
    <div class="md-layout-item md-size-25">
      <div v-for="(value, key) in model.tracer_concentration_params" :key="key">
        <md-field v-if="key === 'sample'">
          <label>{{key}}</label>
          <md-select v-model="model.tracer_concentration_params.sample">
            <md-option value="relaxed">relaxed</md-option>
            <md-option value="full">full</md-option>
          </md-select>
        </md-field>
        <DoubleField
          v-model="model.tracer_concentration_params[key]"
          v-else
          :value="value"
          :param="key"
          range=false
          :placeholder="value"
        />
      </div>
    </div>
  </div>
</template>
<script>
import clonedeep from 'lodash.clonedeep';

import DoubleField from '@/components/DoubleField.vue';
import CONSTANTS from '@/constants/backend_constants';

const params = clonedeep(CONSTANTS.CMRelation_params);

export default {
  name: 'TracerConcentration',
  title: 'Tracer Concentration',
  id: 'tracer-concentration',
  components: {
    DoubleField,
  },
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      options: CONSTANTS.CMRelation_options,
      model: {
        tracer_concentration_model: 'Bullock01',
        tracer_concentration_params: params.Bullock01,
      },
    };
  },
  created() {
    this.$emit('onChange', this.model);
  },
  watch: {
    model: {
      deep: true,
      handler() {
        this.model.tracer_concentration_params = params[
          this.model.tracer_concentration_model
        ];
        this.$emit('onChange', this.model);
      },
    },
  },
};
</script>
