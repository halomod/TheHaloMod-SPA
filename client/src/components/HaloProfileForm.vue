<template>
  <div>
    <md-field>
      <label for="haloProfileChoices">Halo Profile Model</label>
      <md-select
        v-model="haloProfileChoice"
        id="haloProfileChoices"
        name="haloProfileChoice"
      >
        <md-option
          v-for="(value, key) in haloProfileChoices"
          :key="key"
          :value="key"
        >
          {{value}}
        </md-option>
      </md-select>
    </md-field>

    <div v-if="haloProfileParams[haloProfileModel] !== undefined">
      <div
        v-for="(input, inputName) in haloProfileParams[haloProfileModel]"
        :key="inputName"
      >
        <div v-if="typeof input === 'number'">
          <FormNumberField
            :labelHtml="'<label>' + inputName + '</label>'"
            :step="1"
            :currentValue="haloProfileParams[haloProfileModel][inputName]"
            :setCurrentValue="createSetCurrentValueFunc(haloProfileModel, inputName)"
          />
        </div>
        <div v-if="typeof input === 'boolean'">
          <md-checkbox v-model="useInterpChoice">
            Use Interp
          </md-checkbox>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import FormNumberField from './FormNumberField.vue';

const haloProfileChoices = {
  NFW: 'NFW (1997)',
  Hernquist: 'Hernquist',
  Moore: 'Moore',
  GeneralizedNFW: 'Generalized NFW',
  Einasto: 'Einasto',
  CoredNFW: 'Cored NFW',
};
export default {
  name: 'HaloProfileForm',
  title: 'Halo Profile',
  id: 'halo-profile',
  props: {
    haloProfileParams: Object,
    setHaloProfileParams: Function,
    haloProfileModel: String,
    setHaloProfileModel: Function,
  },
  data: () => ({
    haloProfileChoices,
    haloProfileChoice: '',
    useInterpChoice: false,
  }),
  components: {
    FormNumberField,
  },
  mounted() {
    this.haloProfileChoice = this.haloProfileModel;
    this.useInterpChoice = this.haloProfileParams.Einasto.use_interp;
  },
  methods: {
    /**
     * Creates a current value setter for the given transfer type and variable
     * name. This just applies to two transfer types at the moment.
     */
    createSetCurrentValueFunc(haloProfileType, varName) {
      return (newValue) => {
        // Set the new value temporarily
        this.haloProfileParams[haloProfileType][varName] = newValue;

        // Set the value for good.
        this.setHaloProfileParams(this.haloProfileParams);
      };
    },
  },
  watch: {
    haloProfileChoice() {
      this.setHaloProfileModel(this.haloProfileChoice);
    },
    useInterpChoice() {
      this.haloProfileParams.Einasto.use_interp = this.useInterpChoice;
      this.setHaloProfileParams(this.haloProfileParams);
    },
  },
};
</script>

<style>

</style>
