<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item">
      <md-field>
        <label for="movies">Mass Definition</label>
        <md-select v-model="MassDefinition" name="MassDefinition" id="MassDefinition" md-dense>
          <md-option value="None">Use native definition of mass function</md-option>
          <md-option value="SOMean">Spherical Overdensity wrt mean</md-option>
          <md-option value="SOCritical">Spherical Overdensity wrt critical</md-option>
          <md-option value="SOVirial">Virial Spherical Overdensity (Bryan and Norman)</md-option>
          <md-option value="FOF">Friends-of-Friends</md-option>
        </md-select>
      </md-field>
    </div>
  </div>
</template>

<script>
// Sets the default value
export default {
  name: 'MassDefinitionForm',
  data: () => ({
    MassDefinition: 'None',
  }),
};
</script>

<style lang="css" scoped>
.md-field {
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
