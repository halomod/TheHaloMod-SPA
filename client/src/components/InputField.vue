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
      />{{label}}
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
      > <!-- load the given options -->
        <md-option
          v-for='(name, value) in options'
          :key='value'
          :value='value'
          >{{ name }}</md-option
        >
      </md-select>
    </div>
    <!-- everything else like regular input boxes -->
    <div v-else>
      <md-input
      :value="inputStr"
      v-on:input="handleInput"
      :type="inputType"
      :step="step"
      :min="min"
      :max="max"
      :class="fieldClass"
      v-model="value"
      />
    </div>
    <!-- will only display error when md-invalid is set to true -->
    <span class="md-error">{{ errorStr }}</span>
  </md-field>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    step: Number,
    min: Number,
    max: Number,
    label: String,
    inputName: String,
    inputType: String,
    options: Object,
    currentValue: [Number, String],
    setCurrentValue: Function,
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
      if (!Number.isNaN(value)) {
      // Determine if the value is a number
        const parsedNum = Number.parseFloat(value);

        if (this.max != null && this.min != null) {
          // Determine if the number is within bounds
          if (parsedNum <= this.max && parsedNum >= this.min) {
            this.setCurrentValue(Number.parseFloat(value));
            // this.currentValue = Number.parseFloat(value);
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
    this.setCurrentValue(this.currentValue);
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
