<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-50">
      <md-field>
        <label>Tracer Concentration</label>
        <md-select v-model="model.concentration_select">
          <div v-for="(value, key) in selection_values" :key="key">
            <md-option :value="key">{{value}}</md-option>
          </div>
        </md-select>
      </md-field>
    </div>
    <div class="md-layout-item md-size-25">
      <div
        v-for="(value, key) in additional_values.fields"
        :key="key"
      >
        <DoubleField
          v-if="additionalFormControl(key)"
          :param="key"
          :value="value"
          v-model="additional_values.fields[key]"
        />
      </div>
      <md-field v-if="additionalFormControl('sample')">
        <label>sample</label>
        <md-select v-model="additional_values.selection.select">
          <div v-for="(value, key) in additional_values.selection.values" :key="key">
            <md-option :value="key">{{value}}</md-option>
          </div>
        </md-select>
      </md-field>
    </div>
  </div>
</template>
<script>
import clonedeep from 'lodash.clonedeep';

import { concentration as CONCENTRATION_CONSTANTS } from '@/constants/form_choices.json';
import DoubleField from '@/components/DoubleField.vue';

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
      model: {
        concentration_select: 'Bullock01',
      },
      selection_values: CONCENTRATION_CONSTANTS.main,
      additional_values: {
        fields: null,
        selection: {
          select: null,
          values: null,
        },
      },
    };
  },
  mounted() {
    this.additional_values.selection.values = clonedeep(CONCENTRATION_CONSTANTS.additional.sample);
    this.additional_values.selection.select = CONCENTRATION_CONSTANTS.additional.sample.relaxed;
    this.additional_values.fields = CONCENTRATION_CONSTANTS.additional;
    delete CONCENTRATION_CONSTANTS.additional.sample;
  },
  methods: {
    additionalFormControl(form) {
      switch (this.model.concentration_select) {
        case ('Bullock01'):
          return form === 'F' || form === 'K';
        case ('Bullock01Power'):
          return form === 'a' || form === 'b' || form === 'c';
        case ('Duffy08'):
          return form === 'ms' || form === 'sample';
        case ('Zehavi11'):
          return form === 'a' || form === 'b' || form === 'c' || form === 'ms';
        case ('Ludlow16'):
          return form === 'f' || form === 'C';
        case ('Ludlow16Empirical'):
          return form === 'c0_0' || form === 'c0_z'
            || form === 'beta_0'
            || form === 'beta_z'
            || form === 'gamma1_0'
            || form === 'gamma1_z'
            || form === 'gamma2_0'
            || form === 'gamma2_z';
        default:
          return false;
      }
    },
    emit() {
      this.$emit('onChange', {
        tracer_concentration_model: this.model.concentration_select,
        tracer_concentration_params: {
          ...this.additional_values.fields,
          sample: this.additional_values.selection.select,
        },
      });
    },
  },
  watch: {
    'model.concentration_select': {
      deep: true,
      handler() {
        this.emit();
      },
    },
    additional_values: {
      deep: true,
      handler() {
        this.emit();
      },
    },
  },
};
</script>
