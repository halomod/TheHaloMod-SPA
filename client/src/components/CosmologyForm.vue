<template>
  <div>
    <md-field>
      <label for="cosmologyChoices">Cosmology</label>
      <md-select v-model="cosmologyChoice" id="cosmologyChoices">
        <md-option
          v-for="choice in cosmologyChoices"
          :key="choice"
          :value="choice"
        >
          {{choice}}
        </md-option>
        <md-option value="test">
          Test
        </md-option>
      </md-select>
    </md-field>

    <md-field>
      <label>H<sub>0</sub></label>
      <md-input v-model="h_0" type="number"></md-input>
    </md-field>
    <md-field>
      <label>&#937;<sub>b</sub></label>
      <md-input v-model="omega_b" type="number"></md-input>
    </md-field>
    <md-field>
      <label>&#937;<sub>m</sub></label>
      <md-input v-model="omega_m" type="number"></md-input>
    </md-field>
  </div>
</template>

<script>
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
  data: () => ({
    h_0: 0.2,
    omega_b: 0.3,
    omega_m: 0.4,
    cosmologyChoices,
    cosmologyChoice: cosmologyChoices[0],
  }),
};
</script>

<style>

</style> */
