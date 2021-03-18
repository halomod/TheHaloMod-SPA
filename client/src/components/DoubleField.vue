<template>
  <md-field :class="validationClass">
    <label v-if="html !== undefined" v-html="html"/>
    <label v-else>{{param}}</label>
    <md-input
      v-model="current"/>
    <div class="md-error" v-if="!isDefined">Value must be defined</div>
    <div class="md-error" v-else-if="!isNumeric">Value must be numeric</div>
    <div class="md-error" v-else-if="!isBetween">Value must be between {{min}} and {{max}}</div>
  </md-field>
</template>

<script>
import { between, numeric, defined } from '../utils/validators';

/**
 * Needs to be updated to support just a min value and just a max
 * value.
 */
export default {
  name: 'DoubleField',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: [
    'init', // the default value for the field
    'range', // boolean indicating whether it has a range
    'min', // minimum of the range (if exists)
    'max', // maximum of the range (if exists)
    'param', // string name of the field
    'html', // html name of the field
  ],
  data() {
    return {
      current: this.init,
    };
  },
  computed: {
    isBetween() { return this.range ? between(this.current, this.min, this.max) : true; },
    isNumeric() { return numeric(this.current); },
    isDefined() { return defined(this.current); },
    isValid() { return this.isDefined && this.isNumeric && this.isBetween; },
    validationClass() { return { 'md-invalid': !this.isValid }; },
  },
  watch: {
    current() {
      if (this.isValid) {
        this.$emit('input', Number(this.current));
      }
    },
    /* handles case where init has been updated to a new value during a switch to a new route */
    init() {
      this.current = this.init;
    },
  },
  /* handles case where values need to be reset because of a return to old route */
  activated() {
    this.current = this.init;
  },
};
</script>
