<template>
  <div class='md-layout md-gutter'>
    <div class='md-layout-item'>
      <md-subheader>Growth</md-subheader>
      <md-divider></md-divider>
      <div class='md-layout md-gutter'>
        <div class='md-layout-item'>
          <md-field>
            <label for='Growth'>Growth*</label>
            <md-select v-model='selectedGrowth' name='Growth' id='Growth' md-dense>
              <md-option
                v-for='(name, value) in growthChoices'
                :key='value'
                :value='value'
                >{{ name }}</md-option
              >
            </md-select>
          </md-field>
        </div>
        <div class='md-layout-item'>
          <md-field :class="dlnaInputClass">
            <label for='dlna'>dlna</label>
            <md-input v-model='selectedDlna' id='dlna'></md-input>
            <span class="md-error">Please input a valid number</span>
          </md-field>
        </div>
        <div class='md-layout-item'>
          <md-field :class="aminInputClass">
            <label for='amin'>amin</label>
            <md-input v-model='selectedAmin' id='amin'></md-input>
            <span class="md-error">Please input a valid number</span>
          </md-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const growthChoices = {
  GrowthFactor: 'Integral',
  GenMFGrowth: 'GenMF',
  Carroll1992: 'Carroll (1992)',
};
const defaultValues = {
  dlna: '0.01',
  amin: '1e-08',
};

// Objects used in the html
export default {
  name: 'GrowthForm',
  data: () => ({
    growthChoices,
    selectedGrowth: Object.keys(growthChoices)[0], // Sets the default value
    selectedDlna: defaultValues.dlna,
    selectedAmin: defaultValues.amin,
  }),
  computed: {
    // Validation classes
    dlnaInputClass() {
      return {
        // sets md-invalid to true if not a num, this makes md-error mark the input box
        'md-invalid': this.isNotNum(this.selectedDlna),
      };
    },
    aminInputClass() {
      return {
        'md-invalid': this.isNotNum(this.selectedAmin),
      };
    },
    // Getters
    growth_model: {
      get() {
        return this.selectedMassDefinition;
      },
    },
    growth_params: {
      get() {
        return {
          dlna: this.selectedDlna,
          amin: this.selectedAmin,
        };
      },
    },
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
.growth-selector {
  padding: 5px;
}
.growth-input1 {
  padding: 5px;
}
</style>
