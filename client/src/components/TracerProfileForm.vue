<template>
    <div>
        <md-field>
            <label for="tracerProfileChoices">Tracer Profile</label>
            <md-select v-model="tracerChoice" id="tracerProfileChoices"  name="tracerProfile">
                <md-option
                    v-for="choice in tracerProfileChoices"
                    :key="choice"
                    :value="choice"
                >
                    {{choice}}
                </md-option>
            </md-select>
        </md-field>

      <div v-if="tracerParams[tracerProfile] !== undefined">
        <FormNumberField
          v-for="(input, inputName) in tracerParams[tracerProfile]"
          :labelHtml="'<label>' + inputName + '</label>'"
          :key="inputName"
          :step="1"
          :currentValue="tracerParams[tracerProfile][inputName]"
          :setCurrentValue="createSetCurrentValueFunc(tracerProfile, inputName)"
        />
      </div>
    </div>
</template>

<script>

const tracerProfileChoices = [
  'NFW 1997',
  'Hernquist',
  'Moore',
  'Generalized NFW',
  'Einasto',
  'Cored NFW',
];

export default {
  name: 'TracerProfileForm',
  props: {
    tracerParams: Object,
    setTracerParams: Function,
    tracerProfile: String,
    setTracerProfile: Function,
  },
  data: () => ({
    tracerProfileChoices,
    tracerChoice: tracerProfileChoices[0],
  }),
  mounted() {
    this.tracerChoice = this.tracerProfile;
  }
};
</script>
