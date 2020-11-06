<template>
  <md-field :class="fieldClass">

    <!-- for sliders this adds the value under the slider -->
    <div v-if="inputType == 'range'">
      <label>{{label}}</label>
      <span class="md-helper-text">{{value}}</span>
    </div>
    <!-- no label for a checkbox -->
    <div v-if="inputType == 'checkbox'">
    </div>
    <!-- everything else gets a normal label -->
    <div v-else>
      <label>{{label}}</label>
    </div>

    <!-- this defines a material design checkbox -->
    <div v-if="inputType == 'checkbox'">
      <md-checkbox
        :value="inputStr"
        :type="inputType"
        v-on:input="handleInput"
        v-model="value"
        :id="inputName"
      />
      {{label}}
    </div>
    <!-- this is a dropdown menu -->
    <div v-else-if="inputType == 'option'">
      <md-select
        :value="inputStr"
        v-on:input="handleInput"
        :type="inputType"
        v-model="value"
        :id="inputName"
        md-dense
      >
        <!-- load the given options -->
        <md-option
          v-for='(name, value) in options'
          :key='value'
          :value='value'
        >
          {{ name }}
        </md-option>
      </md-select>
    </div>
    <!-- everything else like regular input boxes -->
    <div v-else>
      <div v-html="labelHtml"/>
      <md-input
        :value="inputStr"
        v-on:input="handleInput"
        :type="inputType"
        :step="step"
        :min="min"
        :max="max"
        :class="fieldClass"
      />
    </div>

    <!-- will only display error when md-invalid is set to true -->
    <span class="md-error">{{ errorStr }}</span>
  </md-field>
</template>

<script>
export default {
  name: 'InputField',
  model: {
    prop: 'currentValue',
    event: 'updateCurrentValue',
  },
  props: {
    step: Number,
    min: Number,
    max: Number,
    label: String,
    /**
     * Used to display the label for a number type field.
     */
    labelHtml: String,
    inputName: String,
    /**
     * Determines what type of input is displayed to the user for the
     * data for this field. This has all the normal input type options of an
     * `<input/>` HTML element, with the addition of `option`.
     *
     * To see the different type options, see
     * https://www.w3schools.com/tags/att_input_type.asp
     */
    inputType: String,
    /**
     * The different options if this is an `option` type. This will create
     * a drop-down menu.
     */
    options: Object,
    currentValue: [Number, String],
  },
  data: () => ({
    inputIsInvalid: false,
    inputStr: null,
    errorStr: null,
    value: null,
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
        if (this.max != null && this.min != null) {
          // Determine if the number is within bounds
          if (parsedNum <= this.max && parsedNum >= this.min) {
            this.$emit('updateCurrentValue', Number.parseFloat(value));
            this.inputIsInvalid = false;
          } else {
            this.inputIsInvalid = true;
          }
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
    this.value = this.currentValue;
    this.inputStr = this.currentValue;
    this.errorStr = `Please enter a number between ${this.min} and`
        + ` ${this.max}`;
  },
};
</script>

<style lang='css' scoped>
.md-input {
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}
.md-checkbox {
  margin-top: -10%;
}
.md-field {
max-width: 100%;
  max-height: 100%;
}
</style>
