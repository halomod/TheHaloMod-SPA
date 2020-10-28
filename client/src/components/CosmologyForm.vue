<template>
  <div>
    <md-field>
      <label for="cosmologyChoices">Cosmology</label>
      <md-select v-model="cosmologyChoice" id="cosmologyChoices" name="cosmologyChoice">
        <md-option
          v-for="choice in cosmologyChoices"
          :key="choice"
          :value="choice"
        >
          {{choice}}
        </md-option>
      </md-select>
    </md-field>

<!--
    <md-field v-for="(input, inputName) in inputs" :key="inputName">
      <div v-html="input.html"/>
      <md-input
        v-model="input.currentValue"
        type="number"
        :step="input.step"
        :min="input.min"
        :max="input.max"
      />
      <span class="md-error">There is an error</span>
    </md-field>
    -->

    <FormNumberField
      v-for="(input, inputName) in inputs"
      :labelHtml="input.html"
      :key="inputName"
      :step="input.step"
      :currentValue="input.currentValue"
      :min="input.min"
      :max="input.max"
      :setCurrentValue="createSetCurrentValueFunc(inputName)"
    />
    <p>The current value of h0 is {{inputs.h_0.currentValue}}</p>
  </div>
</template>

<script>
import FormNumberField from './FormNumberField.vue';
/**
 * The code from the form is below
 * choices = [
        ("Planck15", "Planck15"),
        ("Planck13", "Planck13"),
        ("WMAP9", "WMAP9"),
        ("WMAP7", "WMAP7"),
        ("WMAP5", "WMAP5"),
    ]

    label = "Cosmology"
    _initial = "Planck15"
    module = hmf.cosmo

    add_fields = dict(
        H0=forms.FloatField(
            label=mark_safe("H<sub>0</sub>"),
            initial=str(hmf.cosmo.Planck15.H0.value),
            min_value=10,
            max_value=500.0,
            localize=True,
        ),
        Ob0=forms.FloatField(
            label=mark_safe("&#937<sub>b</sub>"),
            initial=str(hmf.cosmo.Planck15.Ob0),
            min_value=0.005,
            max_value=0.65,
            localize=True,
        ),
        Om0=forms.FloatField(
            label=mark_safe("&#937<sub>m</sub>"),
            initial=str(hmf.cosmo.Planck15.Om0),
            min_value=0.02,
            max_value=2.0,
            localize=True,
        ),
    )
 */

/**
 * Creates an error message based on the minimum and maximum value.
 */
function createErrorMessage(minVal, maxVal) {
  return `Please enter a value between ${minVal} and ${maxVal}`;
}
const cosmologyChoices = [
  'Planck15',
  'Planck13',
  'WMAP9',
  'WMAP7',
  'WMAP5',
];
const inputs = {
  h_0: {
    html: '<label>H<sub>0</sub></label>',
    currentValue: 11,
    min: 10,
    max: 500,
    step: 1,
  },
  omega_b: {
    html: '<label>&#937;<sub>b</sub></label>',
    currentValue: 0.009,
    min: 0.005,
    max: 0.65,
    step: 0.001,
  },
  omega_m: {
    html: '<label>&#937;<sub>m</sub></label>',
    currentValue: 0.3,
    min: 0.02,
    max: 2,
    step: 0.01,
  },
};
export default {
  name: 'CosmologyForm',
  data: () => ({
    inputs,
    cosmologyChoices,
    createErrorMessage,
    cosmologyChoice: cosmologyChoices[0],
  }),
  components: {
    FormNumberField,
  },
  methods: {
    createSetCurrentValueFunc(inputType) {
      return (newValue) => {
        this.inputs[inputType].currentValue = newValue;
      };
    },
  },
};
</script>

<style>

</style>
