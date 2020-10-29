<template>
  <div class="home">
    <CosmologyForm
      :hmfDefaults="hmfDefaults"
      :setCosmo="createSetFormFunction('cosmo')"
      :cosmoValues="modelData.cosmo"
    />
  </div>
</template>

<script>
import Debug from 'debug';
import CosmologyForm from '../components/CosmologyForm.vue';

const debug = Debug('Home.vue');
// Enable or disble debugging 🙂
debug.disabled = true;

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
      this.modelData.cosmo = json.constantsFromHMF.cosmo.Planck15;
      debug(this.hmfDefaults);
      debug(this.defaultModel);
    });
  },
};
</script>
