<template>
  <md-app id="create" md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <md-list v-for="(form, index) in forms" :key="index">
        <md-list-item
          :class="{'router-link-active': form.highlight}"
          v-bind:to="`#${form.component.id}`">
          {{form.component.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          :name="form.component.title"
          v-bind:id="`${form.component.id}`"
          @toggle-highlight="(bool) => toggleHighlight(bool, form, index)">
          <component v-bind:is="form.component" v-bind="form.props" v-model="form.model"/>
        </FormWrapper>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
// @ is an alias to /src
import Debug from 'debug';
import FormWrapper from '@/components/FormWrapper.vue';
import CosmologyForm from '@/components/CosmologyForm.vue';
import TransferForm from '@/components/TransferForm.vue';
import FilterForm from '@/components/FilterForm.vue';
import HaloExclusion from '@/components/HaloExclusion.vue';
import HaloProfileForm from '@/components/HaloProfileForm.vue';
import HaloModelForm from '@/components/HaloModelForm.vue';
import constants from '@/constants/backend_constants';
import baseURL from '@/env';

const debug = Debug('Create.vue');

export default {
  name: 'Create',
  components: {
    FormWrapper,
    CosmologyForm,
    TransferForm,
    FilterForm,
    HaloExclusion,
    HaloProfileForm,
  },
  data() {
    return {
      payload: Object.assign(constants),
      forms: null,
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
    };
  },
  methods: {
    createForms() {
      // Add forms to this list, and remove the example form.
      // make sure you have a "title" and "id" property.
      const forms = [
        {
          component: CosmologyForm,
          props: {
            hmfDefaults: this.hmfDefaults,
            setCosmo: this.createParamsSetFunction('cosmo_params'),
            cosmoValues: this.params.cosmo_params,
          },
        },
        {
          component: TransferForm,
          props: {
            setTakahashi: this.createParamsSetFunction('takahashi'),
            setTransferModel: this.createParamsSetFunction('transfer_model'),
            setTransferParams: this.createParamsSetFunction('transfer_params'),
            transferParams: this.params.transfer_params,
            takahashi: this.params.takahashi,
            transferModel: this.params.transfer_model,
          },
        },
        {
          component: FilterForm,
          props: {
            filterModel: this.params.filter_model,
            setFilterModel: this.createParamsSetFunction('filter_model'),
            deltaC: this.params.delta_c,
            setDeltaC: this.createParamsSetFunction('delta_c'),
            filterParams: this.params.filter_params,
            setFilterParams: this.createParamsSetFunction('filter_params'),
          },
        },
        {
          component: HaloModelForm,
          props: {
            hmfDefaults: this.hmfDefaults,
            setForm: this.createParamsSetFunction('haloModel'),
            formValues: this.params.haloModel,
          },
        },
        {
          component: HaloProfileForm,
          props: {
            haloProfileModel: this.params.halo_profile_model,
            setHaloProfileModel: this.createParamsSetFunction('halo_profile_model'),
            haloProfileParams: this.params.halo_profile_params,
            setHaloProfileParams: this.createParamsSetFunction('halo_profile_params'),
          },
        },
        { component: HaloExclusion, model: this.payload.exclusion_model },
      ];
      forms.forEach((item) => {
        const i = item;
        i.highlight = false;
        i.isVisible = false;
      });
      this.forms = forms;
    },
    toggleHighlight(bool, form, index) {
      const f = form;
      if (!bool) {
        f.highlight = false;
        if (index + 1 < this.forms.length) {
          if (index === 0) {
            this.handleTopForm(this.forms[index + 1], index + 1);
          } else if (index - 1 >= 0 && !this.forms[index - 1].isVisible) {
            this.handleTopForm(this.forms[index + 1], index + 1);
          }
        }
      } else if (bool) {
        if (index - 1 >= 0) {
          if (!this.forms[index - 1].isVisible) {
            this.handleTopForm(f, index);
          }
        } else {
          this.handleTopForm(f, index);
        }
        if (index + 1 < this.forms.length) {
          this.forms[index + 1].highlight = false;
        }
      }
      f.isVisible = bool;
      this.forms[index] = f;
      this.$forceUpdate();
    },
    handleTopForm(form, index, prefix = '/create') {
      const f = form;
      f.highlight = true;
      window.history.replaceState({}, '', `${prefix}#${form.component.id}`);
    },
    createParamsSetFunction(keyName) {
      return (newVal) => {
        this.params[keyName] = newVal;
      };
    },
  },
  mounted() {
    fetch(`${baseURL}/constants`).then((data) => data.json()).then((json) => {
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
  created() {
    this.createForms();
  },
  watch: {
    value() {
      console.log('///////', this.payload.exclusion_model);
    },
  },
};
</script>

<style scoped>
  #create {
    height: 80vh;
  };
</style>
