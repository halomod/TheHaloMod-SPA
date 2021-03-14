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
          <div v-if="typeof value === 'object'">
            <div v-for="(subVal, subKey) in value" :key="subKey">
              <double-field
                :init="defaults[params_key][param][subKey]"
                :param="subKey"
                range=false
                v-model="model[params_key][param][subKey]"/>
            </div>
          </div>
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
import Debug from 'debug';

const debug = Debug('GenericForm.vue');
debug.enabled = false;

export default {
  name: 'GenericForm',
  model: {
    event: 'onChange',
  },

  props: {
    /**
     * This prop is special and not defined in `forms.js`. It is pulled in
     * from `initial_state.json`.
     */
    initial_data: {
      type: Object,
      required: false,
    },
    /**
     * See `forms.js` for descriptions on what each of the below props are for.
     */
    title: {
      type: String,
      required: true,
    },
    model_key: {
      type: String,
      required: true,
    },
    params_key: {
      type: String,
      required: true,
    },
    choices: {
      type: Object,
      required: true,
    },
    all_data: {
      type: Object,
      required: true,
    },
  },
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
