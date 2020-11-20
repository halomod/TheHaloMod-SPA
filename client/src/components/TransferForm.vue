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

    <div v-if="Object.keys(allTransferData[transferChoice]).length !== 0 &&
      transferChoice !=='CAMB'">
      <InputField
        v-for="(input, inputName) in allTransferData[transferChoice]"
        :labelHtml="'<label>' + inputName + '</label>'"
        :key="inputName"
        :step="1"
        :currentValue="allTransferData[transferChoice][inputName]"
        v-on:updateCurrentValue="createSetCurrentValueFunc(transferChoice, inputName)($event)"
      />
    </div>

    <DoubleField
      :param="'lnk_min'"
      v-model="transferData.lnk_min"
      :min="Math.log(1 * Math.pow(10, -10))"
    />
    <DoubleField
      :param="'lnk_max'"
      v-model="transferData.lnk_max"
      :max="Math.log(2 * Math.pow(10, 6))"
    />
    <DoubleField
      :param="'dlnk'"
      :min="0.005"
      :max="0.5"
      v-model="transferData.dlnk"
    />

    <md-checkbox v-model="transferData.takahashiChoice">
      Use Takahashi (2012) nonlinear P(k)?
    </md-checkbox>

  </div>
</template>

<script>
import InputField from './InputField.vue';
import DoubleField from './DoubleField.vue';
import BACKEND_CONSTANTS from '../constants/backend_constants';

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
      allTransferData: {
        ...BACKEND_CONSTANTS.TransferComponent_params,
      },
    };
  },
  components: {
    InputField,
    DoubleField,
  },
  methods: {
    /**
     * Creates a current value setter for the given transfer type and variable
     * name. This just applies to two transfer types at the moment.
     */
    createSetCurrentValueFunc(transferType, varName) {
      return (newValue) => {
        // Set the new value temporarily
        this.allTransferData[transferType][varName] = newValue;
        this.transferData[varName] = newValue;

        // Set the value for good.
        this.$emit('updateTransfer', this.transferData);
      };
    },
  },
  watch: {
    transferChoice(newChoice) {
      this.transferData.transfer_model = newChoice;
      this.transferData = {
        ...this.transferData,
        ...this.allTransferData[newChoice],
      };
      this.$emit('updateTransfer', this.transferData);
    },

  },
};
</script>

<style>

</style>
