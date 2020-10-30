<template>
  <div class="home">
    <CosmologyForm
      :hmfDefaults="hmfDefaults"
      :setCosmo="createSetFormFunction('cosmo')"
      :cosmoValues="modelData.cosmo"
    />
    <p>The modelData is: {{JSON.stringify(modelData, null, 2)}}</p>
  </div>
</template>

<script>
import Debug from 'debug';
import CosmologyForm from '../components/CosmologyForm.vue';

const debug = Debug('Home.vue');
// Enable or disble debugging 🙂
debug.disabled = false;

export default {
  name: 'Home',
  data: () => ({
    modelData: {
      cosmo: {
        h0: 0,
        Ob0: 0,
        Om0: 0,
      },
    },
    hmfDefaults: null,
    defaultModel: null,
  }),
  components: {
    CosmologyForm,
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
    // CHANGE TO ENV VARIABLE FOR HOST LOCATION
    fetch('http://localhost:5000/constants').then((data) => data.json()).then((json) => {
      this.hmfDefaults = json.constantsFromHMF;
      this.defaultModel = json.defaultModel;
      console.log('modelData.cosmo is currently: ', this.modelData.cosmo);
      console.log('json.constantsFromHMF.cosmo is currently: ', json.constantsFromHMF.cosmo);

      Object.keys(this.modelData.cosmo).forEach((key) => {
        this.modelData.cosmo[key] = json.constantsFromHMF.cosmo.Planck15[key];
      });

      // this.modelData.cosmo = json.constantsFromHMF.cosmo.Planck15;
      console.log('modelData.cosmo is now: ', this.modelData.cosmo);
    });
  },
};
</script>
