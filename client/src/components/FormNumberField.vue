<template>
  <div>
  <md-field :class="fieldClass">
    <div v-html="labelHtml"/>
    <md-input
      :value="inputStr"
      v-on:input="handleInput"
      type="number"
      :step="step"
      :min="min"
      :max="max"
    />
    <span class="md-error">{{errorStr}}</span>
  </md-field>
  <p>The inputStr is: {{inputStr}}</p>
  <p>The currentValue is: {{currentValue}}</p>
  </div>
</template>

<script>
export default {
  name: 'FormNumberField',
  props: {
    step: Number,
    min: Number,
    max: Number,
    labelHtml: String,
    currentValue: Number,
    setCurrentValue: Function,
  },
  data: () => ({
    inputIsInvalid: false,
    inputStr: '',
    errorStr: '',
  }),
  computed: {
    fieldClass() {
      return {
        'md-invalid': this.inputIsInvalid,
      };
    },
  },
  watch: {
    currentValue() {
      if (this.currentValue !== this.inputStr) {
        this.inputStr = this.currentValue;
      }
    },
  },
  methods: {
    handleInput(value) {
      // Determine if the value is a number
      if (!Number.isNaN(value)) {
        const parsedNum = Number.parseFloat(value);

        // Determine if the number is within bounds
        if (parsedNum <= this.max && parsedNum >= this.min) {
          this.setCurrentValue(Number.parseFloat(value));
          this.inputIsInvalid = false;
        } else {
          this.inputIsInvalid = true;
        }
      } else {
        this.inputIsInvalid = true;
      }
    },
  },
  /**
   * Used to set the input string and error string when the component is
   * created.
   */
  created() {
    this.inputStr = this.currentValue;
    this.errorStr = `Please enter a number between ${this.min} and`
        + ` ${this.max}`;
  },
};
</script>

<style>

</style>
