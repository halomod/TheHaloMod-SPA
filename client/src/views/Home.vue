<template>
  <div class="home">
    <Top/>
    <HaloModelForm
      :hmfDefaults="hmfDefaults"
      :setForm="createParamsSetFunction('haloModel')"
      :formValues="params.haloModel"/>
    <CosmologyForm
      :hmfDefaults="hmfDefaults"
      :setCosmo="createParamsSetFunction('cosmo_params')"
      :cosmoValues="params.cosmo_params"
    />
    <TransferForm
      :setTakahashi="createParamsSetFunction('takahashi')"
      :setTransferModel="createParamsSetFunction('transfer_model')"
      :setTransferParams="createParamsSetFunction('transfer_params')"
      :transferParams="params.transfer_params"
      :takahashi="params.takahashi"
      :transferModel="params.transfer_model"
    />
    <HaloProfileForm
      :haloProfileModel="params.halo_profile_model"
      :setHaloProfileModel="createParamsSetFunction('halo_profile_model')"
      :haloProfileParams="params.halo_profile_params"
      :setHaloProfileParams="createParamsSetFunction('halo_profile_params')"
    />
    <FilterForm
      :filterModel="params.filter_model"
      :setFilterModel="createParamsSetFunction('filter_model')"
      :deltaC="params.delta_c"
      :setDeltaC="createParamsSetFunction('delta_c')"
      :filterParams="params.filter_params"
      :setFilterParams="createParamsSetFunction('filter_params')"
    />
    <tracer-concentration-form v-model="modelData.bias_params"/>
  </div>
</template>

<script>
import Debug from 'debug';
import Top from '../components/top.vue';
import TracerConcentrationForm from '../components/TracerConcentration.vue';
import HaloModelForm from '../components/HaloModelForm.vue';
import TransferForm from '../components/TransferForm.vue';
import HaloProfileForm from '../components/HaloProfileForm.vue';
import FilterForm from '../components/FilterForm.vue';
import constants from '../constants/backend_constants';

const debug = Debug('Home.vue');
// Enable or disble debugging 🙂
debug.enabled = false;

export default {
  name: 'Home',
  // TODO: Make the data at the app level and learn how to pass this to routes
  data: () => ({
    modelData: {
      bias: {
        bias_model: null,
        bias_params: null,
      },
      cosmo: {
        h0: 0,
        Ob0: 0,
        Om0: 0,
      },
    },
    params: {
      cosmo_model: 'Planck15',
      cosmo_params: {
        H0: 0,
        Ob0: 0,
        Om0: 0,
      },
      haloModel: {
        log_r_range: 0,
        rnum: 0,
        log_k_range: 0,
        hm_dlog10k: 0,
        hc_spectrum: '',
        force_1halo_turnover: 0,
      },
      transfer_params: {
        BBKS: constants.TransferComponent_params.BBKS,
        BondEfs: constants.TransferComponent_params.BondEfs,
      },
      takahashi: true,
      transfer_model: 'CAMB',
      halo_profile_model: constants.halo_profile_model,
      halo_profile_params: {
        GeneralizedNFW: {
          alpha: constants.Profile_params.GeneralizedNFW.alpha,
        },
        Einasto: {
          alpha: constants.Profile_params.Einasto.alpha,
          use_interp: constants.Profile_params.Einasto.use_interp,
        },
      },
      filter_model: constants.filter_model,
      filter_params: {
        SharpK: {
          c: 2,
        },
        SharpKEllipsoid: {
          c: 2.5,
        },
      },
      delta_c: constants.delta_c,
    },
    hmfDefaults: null,
    defaultModel: null,
    baseServerURL: 'http://localhost:5000',

  }),
  components: {
    HaloModelForm,
    TracerConcentrationForm,
    Top,
    TransferForm,
    HaloProfileForm,
    FilterForm,
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
      debug('json.constantsFromHMF.cosmo is currently: ', json.constantsFromHMF.cosmo);

      /* Set the default values for cosmo. This is done in this way so that
      * the observers are held. If the entire object is changed, it seems
      * that the observers are removed. This can be done in a similar way
      * for other default values. */
      const cosmoModel = this.params.cosmo_model;
      Object.keys(this.params.cosmo_params).forEach((key) => {
        this.params.cosmo_params[key] = json.constantsFromHMF.cosmo[cosmoModel][key];
      });

      debug('params is now: ', this.params);
    });
  },
};
</script>
