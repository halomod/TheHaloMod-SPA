<template>
  <div class="home">
    <Top/>
    <CosmologyForm
      :hmfDefaults="hmfDefaults"
      :setCosmo="createSetFormFunction('cosmo')"
      :cosmoValues="modelData.cosmo"
    />
    <tracer-concentration-form v-model="modelData.bias_params"/>
  </div>
</template>

<script>
import Debug from 'debug';
import Top from '../components/top.vue';
import CosmologyForm from '../components/CosmologyForm.vue';
import TracerConcentrationForm from '../components/TracerConcentration.vue';
import BACKEND_CONSTANTS from '../constants/backend_constants';

const debug = Debug('Home.vue');
// Enable or disble debugging 🙂
debug.enabled = false;

export default {
  name: 'Home',
  data: () => ({
    modelData: {
      bias: {
        bias_model: 'Tinker10',
        bias_params: BACKEND_CONSTANTS.Bias_params.Tinker10,
      },
      cosmo: {
        h0: 0,
        Ob0: 0,
        Om0: 0,
      },
    },
    hmfDefaults: null,
    defaultModel: null,
    baseServerURL: 'http://localhost:5000',

  }),
  components: {
    CosmologyForm,
    TracerConcentrationForm,
    Top,
  },
  methods: {
    /**
     * Creates a form data editor for the `model` part of the data for the
     * Home component. So this will create a function that can set any object
     * below the `model` part of the model data structure.
     *
     * @param {String} formName the name of the form to create the set function
     * for
     * @returns {(value: Object) => null} the function that will set the form
     * value to what is provided
     */
    createSetFormFunction(formName) {
      return (newObj) => {
        this.modelData[formName] = newObj;
      };
    },
  },
  created() {
    fetch(`${this.baseServerURL}/constants`).then((data) => data.json()).then((json) => {
      this.hmfDefaults = json.constantsFromHMF;
      this.defaultModel = json.defaultModel;
      debug('modelData.cosmo is currently: ', this.modelData.cosmo);
      debug('json.constantsFromHMF.cosmo is currently: ', json.constantsFromHMF.cosmo);

      /* Set the default values for cosmo. This is done in this way so that
      * the observers are held. If the entire object is changed, it seems
      * that the observers are removed. This can be done in a similar way
      * for other deafult values. */
      Object.keys(this.modelData.cosmo).forEach((key) => {
        this.modelData.cosmo[key] = json.constantsFromHMF.cosmo.Planck15[key];
      });

      debug('modelData.cosmo is now: ', this.modelData.cosmo);
    });
  },
};
</script>
