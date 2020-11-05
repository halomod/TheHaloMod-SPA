<template>
  <md-field :class="getValidationClass()">
    <label>{{param}}</label>
    <md-input
      v-model="my_value"
      :value="my_value"
      v-on:input="$emit('test', onInput($event))"/>
    <div class="md-error" v-if="!numeric">Value must be a decimal number.</div>
    <div class="md-error" v-else-if="!between">Value must be between {{min}} and {{max}}</div>
  </md-field>
</template>

<script>
import { between, numeric } from '../utils/validators';

export default {
  name: 'DoubleField',
  model: {
    prop: 'value',
    event: 'test',
  },
  props: ['value', 'min', 'max', 'placeholder', 'param', 'range'],
  data() {
    return {
      my_value: this.value,
      between: this.range ? between(this.value, this.min, this.max) : true,
      numeric: numeric(this.value),
      valid: true,
    };
  },
  methods: {
    getValidationClass() {
      return { 'md-invalid': !this.valid };
    },
    onInput(value) {
      this.numeric = numeric(value);
      this.between = this.range ? between(this.value, this.min, this.max) : true;
      this.valid = this.numeric && this.between;
      return value;
    },
  },
};
</script>
