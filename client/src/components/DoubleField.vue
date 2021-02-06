<template>
  <md-field :class="validationClass">
    <label v-if="html !== undefined" v-html="html"/>
    <label v-else>{{param}}</label>
    <md-input
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
  props: ['value', 'min', 'max', 'html', 'placeholder', 'param', 'range'],
  data() {
    return {
      my_value: this.value,
    };
  },
  computed: {
    between() { return this.range ? between(this.my_value, this.min, this.max) : true; },
    numeric() { return numeric(this.my_value); },
    valid() { return this.numeric && this.between; },
    validationClass() { return { 'md-invalid': !this.valid }; },
  },
  watch: {
    /**
     * Used for the situation where the value to the input changes without the
     * user entering a new value directy. Like when a model changes.
     */
    value() {
      if (this.my_value !== this.value) {
        this.my_value = this.value;
      }
    },
  },
};
</script>
