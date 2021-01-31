<template>
  <form novalidate>
    <md-field>
      <label>{{title}}</label>
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
      <md-checkbox
        v-if="typeof value === 'boolean'"
        class="md-primary"
        v-model="model.profile_params[param]"
      >
        {{param}}
      </md-checkbox>
      <double-field
        v-else
        :value="value"
        :param="param"
        range=false
        v-model="model.profile_params[param]"/>

      </div>
    </div>
  </form>
</template>

<script>
import DoubleField from '@/components/DoubleField.vue';
import BACKEND_CONSTANTS from '@/constants/backend_constants';
import clonedeep from 'lodash.clonedeep';

const profileParams = clonedeep(BACKEND_CONSTANTS.Profile_params);

const profileChoices = {
  'NFW (1997)': 'NFW',
  Hernquist: 'Hernquist',
  Moore: 'Moore',
  'Generalized NFW': 'GeneralizedNFW',
  Einasto: 'Einasto',
  'Cored NFW': 'CoredNFW',
};

export default {
  name: 'profile',
  model: {
    event: 'onChange',
    prop: 'parent_model',
  },
  props: ['parent_model', 'init', 'title'],
  data() {
    return {
      profileChoices,
      model: {
        profile_model: null,
        profile_params: null,
      },
      actualModel: this.init,
      choices: profileChoices,
    };
  },
  created() {
    if (this.title === 'Tracer Profile') {
      this.model.profile_model = this.actualModel.tracer_profile_model;
      this.model.profile_params = this.actualModel.tracer_profile_params;
    } else {
      this.model.profile_model = this.actualModel.halo_profile_model;
      this.model.profile_params = this.actualModel.halo_profile_params;
    }
  },
  updated() {
    if (this.title === 'Tracer Profile') {
      this.actualModel.tracer_profile_model = this.model.profile_model;
      this.actualModel.tracer_profile_params = this.model.profile_params;
    } else {
      this.actualModel.halo_profile_model = this.model.profile_model;
      this.actualModel.halo_profile_params = this.model.profile_params;
    }
    this.$emit('onChange', this.actualModel);
  },
  watch: {
    'model.profile_model': function updateOptions(val) {
      this.model.profile_params = null;
      this.$nextTick(function saveNewOptions() {
        this.model.profile_params = profileParams[val];
        this.defaults = profileParams[val];
      });
    },
  },
  components: {
    DoubleField,
  },
};
</script>
