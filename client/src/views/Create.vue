<template>
  <div>
  <md-progress-bar md-mode="indeterminate" v-if="loading"/>
  <md-app id="create" md-mode="fixed" v-if="!loading">
    <md-app-toolbar>
      <span class="md-title">{{modelName}}</span>
      <div class="md-toolbar-section-end">
          <md-button class="md-primary" @click="handleSave">
            Save
          </md-button>
          <md-button href="/" class="md-primary">
            Close
          </md-button>
        </div>
    </md-app-toolbar>
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <md-list v-for="(form, index) in forms" :key="index">
        <md-list-item
          :class="{'router-link-active': currentlyVisible == form.name}"
          v-bind:to="`#${form.props ? form.props.id : form.component.id}`">
          {{form.props ? form.props.title : form.component.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>

      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          :name="form.name"
          :id="form.id"
          @currently-visible="() => setCurrentlyVisible(form.name, form.id)">
          <component v-if="form.isMeta"
            :is="form.component"
            :modelName="modelName"
            @onChange="updateModelName"
          />
          <component v-else
            v-bind="form.props"
            :is="form.component"
            v-model="params[form.model]"/>
        </FormWrapper>
      </div>
    </md-app-content>
  </md-app>
  </div>
</template>

<script>
import Debug from 'debug';
import clonedeep from 'lodash.clonedeep';

import FormWrapper from '@/components/FormWrapper.vue';
import Concentration from '@/components/Concentration.vue';
import HaloExclusion from '@/components/HaloExclusion.vue';
import BiasForm from '@/components/BiasForm.vue';
import HMFForm from '@/components/HMFForm.vue';
import HODForm from '@/components/HODForm.vue';
import Profile from '@/components/Profile.vue';
import ModelMetadataForm from '@/components/ModelMetadataForm.vue';
import CosmologyForm from '@/components/CosmologyForm.vue';
import MassDefinitionForm from '@/components/MassDefinitionForm.vue';
import GrowthForm from '@/components/GrowthForm.vue';
import HaloModelForm from '@/components/HaloModelForm.vue';
import FilterForm from '@/components/FilterForm.vue';
import TransferForm from '@/components/TransferForm.vue';
import INITIAL_STATE from '@/constants/initial_state.json';

const debug = Debug('Create.vue');
debug.enabled = true;

export default {
  name: 'Create',
  components: {
    FormWrapper,
    Concentration,
    HaloExclusion,
    HODForm,
    BiasForm,
    Profile,
    MassDefinitionForm,
    GrowthForm,
    HaloModelForm,
    FilterForm,
    TransferForm,
  },
  data: () => ({
    loading: false,
    forms: null,
    currentlyVisible: null,
    params: clonedeep(INITIAL_STATE),
    modelName: 'New Model',
  }),
  async mounted() {
    if (this.$route.name === 'Edit') {
      this.modelName = this.$route.params.id;
      this.params = await this.$store.getModel(this.modelName);
      this.$forceUpdate();
    }
    this.createForms();
    this.loading = false;
  },
  methods: {
    createForms() {
      // Add forms to this list, and remove the example form.
      // make sure you have a "title" and "id" property.
      const forms = [
        {
          component: ModelMetadataForm,
          isMeta: true,
        },
        {
          component: MassDefinitionForm,
          model: 'mass_definition',
        },
        {
          component: Concentration,
          model: 'tracer_concentration',
          props: {
            title: 'Tracer Concentration',
            id: 'tracer-concentration',
            defaultModel: 'Bullock01',
          },
        },
        {
          component: Concentration,
          model: 'halo_concentration',
          props: {
            title: 'Halo Concentration',
            id: 'halo-concentration',
            defaultModel: 'Duffy08',
          },
        },
        {
          component: HaloExclusion,
          model: 'exclusion',
        },
        {
          component: BiasForm,
          model: 'bias',
        },
        {
          component: HMFForm,
          model: 'hmf',
        },
        {
          component: HODForm,
          model: 'hod',
        },
        {
          component: Profile,
          model: 'tracer_profile',
          props: {
            title: 'Tracer Profile',
            id: 'tracer_profile',
          },
        },
        {
          component: Profile,
          model: 'halo_profile',
          props: {
            title: 'Halo Profile',
            id: 'Halo_profile',
          },
        },
        {
          component: CosmologyForm,
          model: 'cosmo',
        },
        {
          component: HaloModelForm,
          model: 'halo_model',
        },
        {
          component: GrowthForm,
          model: 'growth',
        },
        {
          component: FilterForm,
          model: 'filter',
        },
        {
          component: TransferForm,
          model: 'transfer',
        },
      ];
      forms.forEach((form) => {
        const lForm = form;
        lForm.name = lForm.props ? lForm.props.title : lForm.component.title;
        lForm.id = lForm.props ? lForm.props.id : lForm.component.id;
      });
      this.forms = forms;
      this.$forceUpdate();
    },
    updateModelName(name) {
      this.modelName = name;
    },
    setCurrentlyVisible(name, id, prefix = '/create') {
      this.currentlyVisible = name;
      window.history.replaceState({}, '', `${prefix}#${id}`);
    },
    async handleSave() {
      this.loading = true;
      if (this.$route.name === 'Edit') {
        await this.$store.updateModel(this.$route.params.id,
          this.modelName, this.params);
      } else {
        await this.$store.createModel(this.params, this.modelName);
      }
      this.loading = false;
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
  #create {
    padding-top: 7vh; /*needs better styling here*/
    height: 100vh;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
