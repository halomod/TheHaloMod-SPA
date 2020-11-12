<template>
  <form novalidate>
    <md-field>
      <label>Profile</label>
      <md-select v-model="model.profile_model">
        <md-option
          v-for="(value, choice) in choices"
          :key="choice"
          :value="value">
          {{choice}}
        </md-option>
      </md-select>
    </md-field>
    <div class="md-layout-item">
      <div v-for="(value, param) in model.profile_params"
        :key="param"
      >
      <double-field
      v-if="typeof value === 'number'"
      :value="value"
      :param="param"
      range=false
      :placeholder="String(defaults[param])"
      v-model="model.profile_params[param]"/>
      <md-checkbox
        v-if="typeof value === 'boolean'"
        class="md-primary"
        v-model="model.profile_params[param]"
      >
      {{param}}
      </md-checkbox>
      </div>
    </div>
  </form>
</template>

<script>
import DoubleField from './DoubleField.vue';
import BACKEND_CONSTANTS from '../constants/backend_constants';

const profileChoices = {
  'NFW (1997)': 'NFW',
  Hernquist: 'Hernquist',
  Moore: 'Moore',
  'Generalized NFW': 'GeneralizedNFW',
  Einasto: 'Einasto',
  'Cored NFW': 'CoredNFW',
};

const profileParams = BACKEND_CONSTANTS.Profile_params;

export default {
  title: 'Profile',
  id: 'profile',
  name: 'ProfileForm',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model'],
  data: () => ({
    profileChoices,
    model: {
      profile_model: profileChoices[0],
      profile_params: profileParams.NFW,
    },
    defaults: { ...BACKEND_CONSTANTS.Profile_params.NFW },
    choices: profileChoices,
  }),
  updated() {
    this.$emit('onChange', this.model);
  },
  watch: {
    'model.profile_model': function updateOptions(val) {
      this.model.profile_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.profile_params = BACKEND_CONSTANTS.Profile_params[val];
        this.defaults = BACKEND_CONSTANTS.Profile_params[val];
      });
    },
  },
  components: {
    DoubleField,
  },
};
</script>
