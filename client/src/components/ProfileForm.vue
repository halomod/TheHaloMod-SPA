<template>
    <div>
        <md-field>
            <label for="profileChoices">Tracer Profile</label>
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
import BACKEND_CONSTANTS from '../constants/backend_constants';

const profileChoices = [
  'NFW 1997',
  'Hernquist',
  'Moore',
  'Generalized NFW',
  'Einasto',
  'Cored NFW',
];

const profileParams = BACKEND_CONSTANTS.Profile_params;

export default {
  name: 'ProfileForm',
  data: () => ({
    profileChoices,
    model: {
      profile_model: tracerProfileChoices[0],
      profile_params: profileParams.NFW,
    },
    defaults: profileParms.NFW,
  }),
  methods: {
    updateOptions() {
      const params = profileParams;
      this.model.profile_params = null;

      this.$nextTick(function() {
        this.model.profile_params = params[this.model.profile_model];
        this.defaults = profileParams[this.model.profile_model];
      });
    },
  },
};
</script>
