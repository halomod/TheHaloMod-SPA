<template>
  <div class="halo-exclusion">
    <md-field>
      <label for="movie">Halo Exclusion*</label>
      <md-select v-model="selection">
        <div v-for="(value) in values" :key="Object.keys(value)[0]">
          <md-option :value="Object.keys(value)[0]">{{Object.values(value)[0]}}</md-option>
        </div>
      </md-select>
    </md-field>
  </div>
</template>

<script>

export default {
  title: 'Halo Exclusion',
  name: 'HaloExclusion',
  id: 'halo-exclusion',
  props: ['parent_model'],
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  data() {
    return {
      selection: 'NoExclusion',
      values: [
        { NoExclusion: 'No Exclusion' },
        { Sphere: 'Spherical Halos' },
        { DblSphere_: 'Spherical Overlapping Halos' },
        { DblEllipsoid_: 'Ellipsoidal Halos' },
        { NgMatched_: 'Density-Matched (Tinker 2005)' },
      ],
    };
  },
  watch: {
    selection: {
      handler() {
        this.$emit('onChange', this.selection);
      },
    },
  },
};
</script>
