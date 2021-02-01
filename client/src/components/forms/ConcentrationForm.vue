<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
      <md-field>
        <label>{{title}}</label>
        <md-select v-model="model.concentration_model">
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
      <div v-for="(value, key) in model.concentration_params" :key="key">
        <md-field v-if="key === 'sample'">
          <label>{{key}}</label>
          <md-select v-model="model.concentration_params.sample">
            <md-option value="relaxed">relaxed</md-option>
            <md-option value="full">full</md-option>
          </md-select>
        </md-field>
        <DoubleField
          v-model="model.concentration_params[key]"
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

const concentrationParams = clonedeep(CONSTANTS.CMRelation_params);

export default {
  name: 'concentration',
  components: {
    DoubleField,
  },
  props: ['defaultModel', 'id', 'title'],
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      options: CONSTANTS.CMRelation_options,
      model: {
        concentration_model: this.defaultModel,
        concentration_params: concentrationParams[this.defaultModel],
      },
    };
  },
  updated() {
    const payload = {};
    if (this.id === 'tracer-concentration') {
      payload.tracer_concentration_model = this.model.concentration_model;
      payload.tracer_concentration_params = this.model.concentration_params;
    } else {
      payload.halo_concentration_model = this.model.concentration_model;
      payload.halo_concentration_params = this.model.concentration_params;
    }
    this.$emit('onChange', this.payload);
  },
  watch: {
    'model.concentration_model': function updateOptions(val) {
      this.model.concentration_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.concentration_params = concentrationParams[val];
        this.defaults = concentrationParams[val];
      });
    },
  },
};
</script>
