<template>
  <form novalidate>
    <div class='md-layout md-gutter'>
      <div class='md-layout-item'>
        <md-field>
          <label>{{title}}</label>
          <md-select v-model="model[model_key]">
            <md-option
              v-for="(value, choice) in choices"
              :key="choice"
              :value="value">
              {{choice}}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class='md-layout-item'>
        <div :key="param" v-for="(value, param) in model[params_key]">
          <md-checkbox
            v-if="typeof value === 'boolean'"
            class="md-primary"
            v-model="model[params_key][param]">
            {{param}}
          </md-checkbox>
          <double-field
            v-else
            :init="defaults[params_key][param]"
            :param="param"
            range=false
            v-model="model[params_key][param]"/>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
import DoubleField from '@/components/DoubleField.vue';

export default {
  name: 'GenericForm',
  model: {
    event: 'onChange',
  },
  /**
   * See `forms.js` for descriptions on what each of these props are for.
   */
  props: [
    'title',
    'initial_data',
    'model_key',
    'params_key',
    'choices',
    'all_data',
  ],
  components: {
    DoubleField,
  },
  data() {
    return {
      model: clonedeep(this.initial_data),
      defaults: clonedeep(this.initial_data),
      cache: clonedeep(this.all_data),
    };
  },
  created() {
    this.$watch(
      function toWatch() {
        return this.model[this.model_key];
      },
      function updateParams(newVal, oldVal) {
        if (oldVal === newVal) return;
        this.cache[oldVal] = clonedeep(this.model[this.params_key]);
        this.model[this.params_key] = clonedeep(this.cache[newVal]);
        this.defaults[this.params_key] = clonedeep(this.cache[newVal]);
      },
    );
  },
  watch: {
    model: {
      deep: true,
      handler() {
        this.$emit('onChange', clonedeep(this.model));
      },
    },
    initial_data: {
      deep: true,
      handler() {
        this.model = clonedeep(this.initial_data);
        this.defaults = clonedeep(this.initial_data);
        this.cache = clonedeep(this.all_data);
      },
    },
  },
};
</script>
