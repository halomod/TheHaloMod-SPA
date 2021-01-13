<template>
  <md-app id="create" md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <scrollactive
        active-class="router-link-active"
        ref="scrollactive"
        :offset="offset"
        :always-track="alwaysTrack"
        :duration="duration"
        :click-to-scroll="clickToScroll"
        :bezier-easing-value="easing"
      >
      <md-list v-for="(form, index) in forms" :key="index">
        <md-list-item
          :href="`#${form.props ? form.props.id : form.component.id}`">
            {{form.props ? form.props.title : form.component.title}}
        </md-list-item>
      </md-list>
      </scrollactive>
    </md-app-drawer>
    <md-app-content>

      <div>
        <section :id="`${form.props ? form.props.id : form.component.id}`"
          v-for="(form, index) in forms" :key="index">
          <FormWrapper
            :name="form.props ? form.props.title : form.component.title"
          >
            <component v-if="form.isMeta"
              :is="form.component"
              :parent_model="model_metadata"
              @onChange="updateModelMetaData"
            />
            <component v-else
              v-bind="form.props"
              :is="form.component"
              v-model="params[form.model]"/>
          </FormWrapper>
        </section>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
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
  props: {
    params: {
      type: Object,
      required: true,
    },
    model_metadata: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    forms: [
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
    ],
  }),
  methods: {
    updateModelMetaData(updatedMetaData) {
      this.$emit('update-metadata', updatedMetaData);
    },
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
