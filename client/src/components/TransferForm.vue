<template>
  <div>
    <md-field>
      <label for="transferChoices">Transfer Model</label>
      <md-select
        v-model="transferChoice"
        id="transferChoices"
        name="transferChoice"
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

    <div v-if="transferData.transfer_params[transferChoice] !== undefined">
      <InputField
        v-for="(input, inputName) in transferData.transfer_params[transferChoice]"
        :labelHtml="'<label>' + inputName + '</label>'"
        :key="inputName"
        :step="1"
        :currentValue="transferData.transfer_params[transferChoice][inputName]"
        v-on:updateCurrentValue="createSetCurrentValueFunc(transferChoice, inputName)($event)"
      />
    </div>

    <md-checkbox v-model="transferData.takahashiChoice">
      Use Takahashi (2012) nonlinear P(k)?
    </md-checkbox>

  </div>
</template>

<script>
import InputField from './InputField.vue';

const transferChoices = {
  CAMB: 'CAMB',
  EH_BAO: 'Eisenstein-Hu (1998) (with BAO)',
  EH_NoBAO: 'Eisenstein-Hu (1998) (no BAO)',
  BBKS: 'BBKS (1986)',
  BondEfs: 'Bond-Efstathiou',
};
export default {
  name: 'TransferForm',
  title: 'Transfer',
  id: 'transfer',
  model: {
    prop: 'transferData',
    event: 'updateTransfer',
  },
  props: {
    transferData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      transferChoices,
      transferChoice: this.transferData.transfer_model,
    };
  },
  components: {
    InputField,
  },
  methods: {
    doSomething() {
      console.log('doing a thang');
    },
    /**
     * Creates a current value setter for the given transfer type and variable
     * name. This just applies to two transfer types at the moment.
     */
    createSetCurrentValueFunc(transferType, varName) {
      return (newValue) => {
        // Set the new value temporarily
        this.transferData.transfer_params[transferType][varName] = newValue;

        // Set the value for good.
        this.$emit('updateTransfer', this.transferData);
      };
    },
  },
  watch: {
    transferChoice(newChoice) {
      this.transferData.transfer_model = newChoice;
      this.$emit('updateTransfer', this.transferData);
    },
  },
};
</script>

<style>

</style>
