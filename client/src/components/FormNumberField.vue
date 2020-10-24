<template>
  <md-field>
    <div v-html="labelHtml"/>
    <md-input
      :value="currentValue"
      v-on:input="handleInput"
      type="number"
      :step="step"
      :min="min"
      :max="max"
    />
    <span class="md-error">There is an error</span>
  </md-field>
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
  methods: {
    handleInput(value) {
      if (!Number.isNaN(value)) {
        this.setCurrentValue(Number.parseFloat(value));
      }
    },
    logThisStuff() {
      console.log('This is a test');
    },
  },
};
</script>

<style>

</style>
