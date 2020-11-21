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
          v-bind:to="`#${form.props ? form.props.id : form.component.id}`">
          {{form.props ? form.props.title : form.component.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <submit-button :model="params" :meta="model_metadata"/>
      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          :name="form.props ? form.props.title : form.component.title"
          v-bind:id="`${form.props ? form.props.id : form.component.id}`"
          @toggle-highlight="(bool) => toggleHighlight(bool, form, index)">
          <component v-if="form.isMeta"
            :is="form.component"
            v-model="model_metadata"
          />
          <component v-else
            v-bind="form.props"
            :is="form.component"
            v-model="params[form.model]"/>
        </FormWrapper>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
// @ is an alias to /src
import clonedeep from 'lodash.clonedeep';

import FormWrapper from '@/components/FormWrapper.vue';
import Concentration from '@/components/Concentration.vue';
import HaloExclusion from '@/components/HaloExclusion.vue';
import BiasForm from '@/components/BiasForm.vue';
import HMFForm from '@/components/HMFForm.vue';
import HODForm from '@/components/HODForm.vue';
import Profile from '@/components/Profile.vue';
import INITIAL_STATE from '@/constants/initial_state.json';
import SubmitButton from '@/components/SubmitButton.vue';
import ModelMetadataForm from '@/components/ModelMetadataForm.vue';
import CosmologyForm from '@/components/CosmologyForm.vue';
import MassDefinitionForm from '@/components/MassDefinitionForm.vue';
import GrowthForm from '@/components/GrowthForm.vue';
import HaloModelForm from '@/components/HaloModelForm.vue';
import TransferForm from '@/components/TransferForm.vue';

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
    SubmitButton,
    HaloModelForm,
    TransferForm,
  },
  data: () => ({
    params: null,
    forms: null,
    model_metadata: {
      model_name: 'Model',
      fig_type: 'dndm',
    },
  }),
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
          component: TransferForm,
          model: 'transfer',
        },
      ];
      forms.forEach((item) => {
        const i = item;
        i.highlight = false;
        i.isVisible = false;
      });
      this.forms = forms;
      this.$forceUpdate();
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
      window.history.replaceState({}, '', `${prefix}#${form.props ? form.props.id : form.component.id}`);
    },
    createParamsSetFunction(keyName) {
      return (newVal) => {
        this.params[keyName] = newVal;
      };
    },
  },
  created() {
    this.params = clonedeep(INITIAL_STATE);
    this.createForms();
  },
};
</script>

<style scoped>
  #create {
    height: 80vh;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
