<template>
  <md-field :class="getValidationClass()">
    <label>{{param}}</label>
    <md-input type="number"
      v-model="my_value"
      :value="my_value"
      v-on:input="$emit('input', onInput($event))"/>
    <div
      class="md-error"
      v-if="!$v.my_value.numeric">Value must be a decimal
    </div>
    <div
      class="md-error"
      v-else-if="!$v.my_value.between">Value must be between {{minimum}} and {{maximum}}
    </div>
  </md-field>
</template>

<script>
import { required, helpers } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';

const range = (minimum, maximum) => (value) => Number(value) >= minimum && Number(value) <= maximum;
const numeric = helpers.regex('numeric', /(^[0-9]*.?[0-9]*$)|(^-[0-9]*.?[0-9]*$)/);

let minValue = Number.MIN_SAFE_INTEGER;
let maxValue = Number.MAX_SAFE_INTEGER;

export default {
  name: 'doublefield',
  mixins: [validationMixin],
  model: {
    prop: 'value',
    event: 'input',
  },
  props: ['value', 'min', 'max', 'placeholder', 'param'],
  data() {
    return {
      my_value: this.value,
      minimum: minValue,
      maximum: maxValue,
    };
  },
  mounted() {
    minValue = this.min != null ? this.min : minValue;
    maxValue = this.max != null ? this.max : maxValue;
  },
  methods: {
    onInput(event) {
      const field = this.$v.my_value;
      field.$touch();
      return event;
    },
    getValidationClass() {
      const field = this.$v.my_value;
      if (field) {
        return {
          'md-invalid': field.$invalid,
        };
      }
      return null;
    },
  },
  validations: {
    my_value: {
      required,
      numeric,
      between: range(minValue, maxValue),
    },
  },
};
</script>
