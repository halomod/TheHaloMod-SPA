<template>
  <div class='md-layout md-gutter'>
    <div class='md-layout-item'>
      <md-subheader>Halo Model</md-subheader>
      <md-divider></md-divider>
      <div class='md-layout md-gutter'>
        <div class='md-layout-item'>
          <md-field>
            <label for='log_r_range'>Scale Range (log10)</label>
            <!-- TODO Add slider-->
          </md-field>
        </div>
        <div class='md-layout-item'>
          <md-field :class="log_r_rangeClass">
            <label for='rnum'>Number of r bins</label>
            <!-- TODO add min and max values -->
            <md-input v-model='selectedRnum' id='rnum'></md-input>
            <span class="md-error">Please input a valid number</span>
          </md-field>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// const defaultValues = {
// default values
// };

// Objects used in the html
export default {
  name: 'HaloModelForm',
  data: () => ({

  }),
  computed: {
    // Validation classes

    // Getters

  },
  methods: {
    // works for scientific notation, negative number, and decimals
    // Valid: 1, 1.0, -2.0e-8, etc
    // Invalid: -1e1.0, -e00001, etc
    isNotNum(num) {
      return num.replace(/-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?/g, '') !== '';
    },
  },
};
</script>

<style lang='css' scoped>
.md-layout-item {
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 5px;
  margin-bottom: 5px;
}
.range-selector {
  padding: 5px;
}
.range-input1 {
  padding: 5px;
}
</style>
