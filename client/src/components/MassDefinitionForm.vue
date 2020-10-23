<template>
  <div class='md-layout md-gutter'>
    <div class='md-layout-item'>
      <md-subheader>Mass Definition</md-subheader>
      <md-divider></md-divider>
      <md-field>
        <label for='MassDefinition'>Mass Definition*</label>
        <md-select
          v-model='selectedMassDefinition'
          name='MassDefinition'
          id='MassDefinition'
          md-dense
        >
          <md-option
            v-for='(name, value) in massDefinitionChoices'
            :key='value'
            :value='value'
            >{{ name }}</md-option
          >
          <!--<md-option value='None'>Use native definition of mass function</md-option>
          <md-option value='SOMean'>Spherical Overdensity wrt mean</md-option>
          <md-option value='SOCritical'>Spherical Overdensity wrt critical</md-option>
          <md-option value='SOVirial'>Virial Spherical Overdensity (Bryan and Norman)</md-option>
          <md-option value='FOF'>Friends-of-Friends</md-option>-->
        </md-select>
      </md-field>
    </div>
  </div>
</template>

<script>
const massDefinitionChoices = {
  None: 'Use native definition of mass function',
  SOMean: 'Spherical Overdensity wrt mean',
  SOCritical: 'Spherical Overdensity wrt critical',
  SOVirial: 'Virial Spherical Overdensity (Bryan and Norman)',
  FOF: 'Friends-of-Friends',
};

// Objects used in the html
export default {
  name: 'MassDefinitionForm',
  data: () => ({
    massDefinitionChoices,
    selectedMassDefinition: Object.keys(massDefinitionChoices)[0], // Sets the default value
  }),
  computed: {
    mdef_model: {
      // getter
      get() {
        return this.selectedMassDefinition;
      },
    },
  },
};
</script>

<style lang='css' scoped>
.md-field {
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
