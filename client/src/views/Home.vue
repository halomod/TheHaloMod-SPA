<template>
  <div class="home">
    <CosmologyForm
      :hmfDefaults="hmfDefaults"
      :setCosmo="createParamsSetFunction('cosmo_params')"
      :cosmoValues="params.cosmo_params"
    />
  </div>
</template>

<script>
import Debug from 'debug';
import CosmologyForm from '../components/CosmologyForm.vue';

const debug = Debug('Home.vue');
// Enable or disble debugging 🙂
debug.enabled = true;

export default {
  name: 'Home',
  // TODO: Make the data at the app level and learn how to pass this to routes
  data: () => ({
    params: {
      cosmo_model: 'Planck15',
      cosmo_params: {
        H0: 0,
        Ob0: 0,
        Om0: 0,
      },
      transfer: {
        FromArray: {
          k: null,
          T: null,
        },
        EH_BAO: {},
        EH_NoBAO: {},
        BBKS: {
          a: 2.34,
          b: 3.89,
          c: 16.1,
          d: 5.47,
          e: 6.71,
        },
        BondEfs: {
          a: 37.1,
          b: 21.1,
          c: 10.8,
          nu: 1.12,
        },
        EH: {},
      },
    },
    hmfDefaults: null,
    defaultModel: null,
    baseServerURL: 'http://localhost:5000',
  }),
  components: {
    CosmologyForm,
  },
  methods: {
    /**
     * Creates a form data editor for the `params` part of the data for the
     * Home component. So this will create a function that can set any object
     * below the `params` part of the params data structure.
     *
     * @param {String} objectName the name of the object to create the set
     * function for
     * @returns {(value: Object) => null} the function that will set the form
     * value to what is provided
     */
    createParamsSetFunction(objectName) {
      return (newObj) => {
        this.params[objectName] = newObj;
      };
    },
  },
  created() {
    fetch(`${this.baseServerURL}/constants`).then((data) => data.json()).then((json) => {
      this.hmfDefaults = json.constantsFromHMF;
      this.defaultModel = json.defaultModel;
      debug('json.constantsFromHMF.cosmo is currently: ', json.constantsFromHMF.cosmo);

      /* Set the default values for cosmo. This is done in this way so that
      * the observers are held. If the entire object is changed, it seems
      * that the observers are removed. This can be done in a similar way
      * for other deafult values. */
      const cosmoModel = this.params.cosmo_model;
      Object.keys(this.params.cosmo_params).forEach((key) => {
        this.params.cosmo_params[key] = json.constantsFromHMF.cosmo[cosmoModel][key];
      });

      debug('params is now: ', this.params);
    });
  },
};
</script>
