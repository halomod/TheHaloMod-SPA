<template>
  <div class="home">
    You're home!
  </div>
</template>

<script>

export default {
  name: 'Home',
  // TODO: Make the data at the app level and learn how to pass this to routes
  data: () => ({
    hmfDefaults: null,
    defaultModel: null,
    baseServerURL: 'http://localhost:5000',

  }),
  components: {
  },
  methods: {
    /**
     * Creates a form data editor for the `params` part of the data for the
     * Home component. So this will create a function that can set any value
     * for a key below the `params` part of the params data structure.
     *
     * @param {String} keyName the name of the key to create the set
     * function for
     * @returns {(value: any) => null} the function that will set the form
     * value to what is provided
     */
    createParamsSetFunction(keyName) {
      return (newVal) => {
        this.params[keyName] = newVal;
      };
    },
  },
  created() {
    fetch(`${this.baseServerURL}/constants`).then((data) => data.json()).then((json) => {
      this.hmfDefaults = json.constantsFromHMF;
      this.defaultModel = json.defaultModel;

      /* Set the default values for cosmo. This is done in this way so that
      * the observers are held. If the entire object is changed, it seems
      * that the observers are removed. This can be done in a similar way
      * for other default values. */
      const cosmoModel = this.params.cosmo_model;
      Object.keys(this.params.cosmo_params).forEach((key) => {
        this.params.cosmo_params[key] = json.constantsFromHMF.cosmo[cosmoModel][key];
      });
    });
  },
};

</script>
