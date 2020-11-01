<template>
  <div class="halo-exclusion">
    <md-field>
      <label for="movie">Halo Exclusion*</label>
      <md-select v-model="selection">
        <md-option value="no-exclusion">No Exclusion</md-option>
        <md-option value="spherical-halos">Spherical Halos</md-option>
        <md-option value="spherical-overlapping-halos">Spherical Overlapping Halos</md-option>
        <md-option value="ellipsoidal-halos">Ellipsoidal Halos</md-option>
        <md-option value="density-matched">Density-Matched (Tinker 2005)</md-option>
      </md-select>
    </md-field>
  </div>
</template>

<script>
export default {
  name: 'Halo Exclusion',
  id: 'halo-exclusion',
  data() {
    return {
      selection: 'no-exclusion',
    };
  },
};
</script>

<style scoped>
  .halo-exclusion {
    margin: 10vh;
  };
</style>
