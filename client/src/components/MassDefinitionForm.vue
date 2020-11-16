<template>
  <div class='md-layout md-gutter'>
    <div class='md-layout-item'>
      <md-subheader>Mass Definition</md-subheader>
      <md-divider></md-divider>
      <div class="md-layout md-gutter">
        <label>Mass Definition</label>
        <md-select v-model="massDefinitionChoices" 
        id="massDefinitionChoices" name="massDefinitionChoice">
          <md-option
            v-for="choice in massDefinitionChoices"
            :key="choice"
            :value="choice"
          >
            {{choice}}
          </md-option>
        </md-select>
      </div>
      <div class="md-layout md-gutter">
        <!-- Here is where its repeating to load the input -->
        <!--<div v-for="(input, inputName) in inputs" :key="input.id" class="md-layout-item">
            <InputField
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
        </div>-->
        <div class="md-layout-item">
          <double-field
            v-for="(value, param) in model.mass_definition_params"
            :value="value"
            :key="param"
            :param="param"
            range=false
            :placeholder="String(defaults[param])"
            v-model="model.mass_definition_params[param]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BACKEND_CONSTANTS from '../constants/backend_constants';
import DoubleField from './DoubleField.vue';

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
    InputField,
    DoubleField,
  },
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model'],
  data() {
    return {
      model: {
        mass_definition_model: '',
        mass_definition_params: BACKEND_CONSTANTS.MassDefinition_params.SOGeneric,
      },
      defaults: { ...BACKEND_CONSTANTS.MassDefinition_params.SOGeneric },
      choices: massDefinitionChoices,
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
    };
  },
  updated() {
    console.log('MassDef-Updated');
    this.$emit('onChange', this.mass_definition);
  },
  watch: {
    'model.mass_definition_model': function updateOptions(val) {
      this.model.mass_definition_params = null;
      this.$nextTick(function saveNewOptions() {
        // TODO change these val to match massDefinitionChoices
        this.model.mass_definition_params = BACKEND_CONSTANTS.MassDefinition_params[val];
        this.defaults = BACKEND_CONSTANTS.MassDefinition_params[val];
      });
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
</style>
