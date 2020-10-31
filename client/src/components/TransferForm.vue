<template>
  <div>
    <md-field>
      <label for="transferChoices">Transfer Model</label>
      <md-select
        v-model="transferChoice"
        id="transferChoices"
        name="transferChoice"
        v-on:change="doSomething"
      >
        <md-option
          v-for="(value, key) in transferChoices"
          :key="key"
          :value="key"
        >
          {{value}}
        </md-option>
      </md-select>
    </md-field>

    <div v-if="transferParams[transferModel] !== undefined">
      <FormNumberField
        v-for="(input, inputName) in transferParams[transferModel]"
        :labelHtml="'<label>' + inputName + '</label>'"
        :key="inputName"
        :step="1"
        :currentValue="transferParams[transferModel][inputName]"
        :setCurrentValue="createSetCurrentValueFunc(transferModel, inputName)"
      />
    </div>

  </div>
</template>

<script>
import FormNumberField from './FormNumberField.vue';

const transferChoices = {
  CAMB: 'CAMB',
  EH_BAO: 'Eisenstein-Hu (1998) (with BAO)',
  EH_NoBAO: 'Eisenstein-Hu (1998) (no BAO)',
  BBKS: 'BBKS (1986)',
  BondEfs: 'Bond-Efstathiou',
};
export default {
  name: 'TransferForm',
  props: {
    transferParams: Object,
    setTransferParams: Function,
    takahashi: Boolean,
    setTakahashi: Function,
    transferModel: String,
    setTransferModel: Function,
  },
  data: () => ({
    transferChoices,
    transferChoice: '',
  }),
  components: {
    FormNumberField,
  },
  mounted() {
    this.transferChoice = this.transferModel;
  },
  methods: {
    /**
     * Creates a current value setter for the given transfer type and variable
     * name. This just applies to two transfer types at the moment.
     */
    createSetCurrentValueFunc(transferType, varName) {
      return (newValue) => {
        // Set the new value temporarily
        this.transferParams[transferType][varName] = newValue;

        // Set the value for good.
        this.setTransferParams(this.transferParams);
      };
    },
    doSomething() {
      console.log('Did something');
    },
  },
  watch: {
    transferChoice() {
      this.setTransferModel(this.transferChoice);
    },
  },
};
</script>

<style>

</style>
