<template>
  <div class='md-layout md-gutter'>
    <div class='md-layout-item'>
      <md-subheader>Mass Definition</md-subheader>
      <md-divider></md-divider>
      <div class="md-layout md-gutter">
        <!-- Here is where its repeating to load the input -->
        <div v-for="(input, inputName) in inputs" :key="input.id" class="md-layout-item">
            <InputField2
            :key="inputName"
            :label="input.label"
            :step="input.step"
            :currentValue="input.value"
            :min="input.min"
            :max="input.max"
            :inputName="inputName"
            :inputType="input.inputType"
            :options="input.options"
            :hidden="input.hidden"
            v-model="mass_definition"
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputField2 from './InputField2.vue';

const massDefinitionChoices = {
  None: 'Use native definition of mass function',
  SOMean: 'Spherical Overdensity wrt mean',
  SOCritical: 'Spherical Overdensity wrt critical',
  SOVirial: 'Virial Spherical Overdensity (Bryan and Norman)',
  FOF: 'Friends-of-Friends',
};

/*
  MassDefinition_params: {
    SphericalOverdensity: {},
    SOGeneric: {},
    SOMean: {
      overdensity: 200,
    },
    SOCritical: {
      overdensity: 200,
    },
    SOVirial: {},
    FOF: {
      linking_length: 0.2,
    },
  },
*/
// Objects used in the html
export default {
  name: 'MassDefinitionForm',
  title: 'Halo Model',
  id: 'halo-model',
  components: {
    InputField2,
  },
  model: {
    event: 'onChange',
    prop: 'mass_definition',
  },
  props: {
    mass_definition: Object,
  },
  data() {
    return {
      inputs: {
        massDefinition: {
          label: 'Mass Definition',
          options: {
            massDefinitionChoices,
          },
          params: this.mass_definition.mass_definition_params,
          value: Object.keys(massDefinitionChoices)[0],
          inputType: 'option',
          hidden: false,
        },
        // Put another input here if you need
      },
      massDefinitionChoices,
      selectedMassDefinition: Object.keys(massDefinitionChoices)[0],
    };
  },
  updated() {
    console.log('MassDef-Updated');
    this.$emit('onChange', this.mass_definition);
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
</style>
