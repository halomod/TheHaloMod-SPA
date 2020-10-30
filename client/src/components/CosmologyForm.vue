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

    <FormNumberField
      v-for="(input, inputName) in inputs"
      :labelHtml="input.html"
      :key="inputName"
      :step="input.step"
      :currentValue="cosmoValues[inputName]"
      :min="input.min"
      :max="input.max"
      :setCurrentValue="createSetCurrentValueFunc(inputName)"
    />
    <p>The current value of cosmoValues is {{cosmoValues}}</p>
    <p>The current value of cosmoValues.h0 is {{cosmoValues.h0}}</p>
    <p>The current value of hmfDefaults is {{hmfDefaults}}</p>
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
const cosmologyChoices = [
  'Planck15',
  'Planck13',
  'WMAP9',
  'WMAP7',
  'WMAP5',
];
export default {
  name: 'CosmologyForm',
  props: {
    hmfDefaults: Object,
    cosmoValues: Object,
    setCosmo: Function,
  },
  data: () => ({
    inputs: {
      h0: {
        html: '<label>H<sub>0</sub></label>',
        min: 10,
        max: 500,
        step: 1,
      },
      Ob0: {
        html: '<label>&#937;<sub>b</sub></label>',
        min: 0.005,
        max: 0.65,
        step: 0.001,
      },
      Om0: {
        html: '<label>&#937;<sub>m</sub></label>',
        min: 0.02,
        max: 2,
        step: 0.01,
      },
    },
    cosmologyChoices,
    cosmologyChoice: cosmologyChoices[0],
  }),
  components: {
    FormNumberField,
  },
  methods: {
    createSetCurrentValueFunc(inputType) {
      return (newValue) => {
        // Set the new value temporarily
        this.cosmoValues[inputType] = newValue;

        // Set the value for good.
        this.setCosmo(this.cosmoValues);
      };
    },
  },
};
</script>

<style>

</style>
