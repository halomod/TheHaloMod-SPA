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

    <div v-if="transferParams[transferModel] !== undefined">
      <InputField
        v-for="(input, inputName) in transferParams[transferModel]"
        :labelHtml="'<label>' + inputName + '</label>'"
        :key="inputName"
        :step="1"
        :currentValue="transferParams[transferModel][inputName]"
        v-on:updateCurrentValue="createSetCurrentValueFunc(transferModel, inputName)($event)"
      />
    </div>

    <md-checkbox v-model="takahashiChoice">
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
  id: 'tranfser',
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
    takahashiChoice: false,
  }),
  components: {
    InputField,
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
  },
  watch: {
    transferChoice() {
      this.setTransferModel(this.transferChoice);
    },
    takahashiChoice() {
      this.setTakahashi(this.takahashiChoice);
    },
  },
};
</script>

<style>

</style>
