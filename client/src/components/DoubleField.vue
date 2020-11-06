<template>
  <md-field :class="validationClass">
    <label>{{param}}</label>
    <md-input
      type="number"
      v-model="my_value"
      :value="my_value"
      v-on:input="$emit('input', $event)"/>
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
    event: 'input',
  },
  props: ['value', 'min', 'max', 'placeholder', 'param', 'range'],
  data() {
    return {
      my_value: this.value,
    };
  },
  computed: {
    between() { return this.range ? between(this.my_value, this.min, this.max) : true; },
    numeric() { return numeric(this.value); },
    valid() { return this.numeric && this.between; },
    validationClass() { return { 'md-invalid': !this.valid }; },
  },
};
</script>
