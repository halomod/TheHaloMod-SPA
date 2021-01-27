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

const FORMS = [
  {
    component: ModelMetadataForm,
    isMeta: true,
    title: 'Model Metadata',
    id: 'model-metadata',

  },
  {
    component: MassDefinitionForm,
    model: 'mass-definition',
    title: 'Mass Definition',
    id: 'mass-definition',
  },
  {
    component: Concentration,
    model: 'tracer-concentration',
    title: 'Tracer Concentration',
    id: 'tracer-concentration',
    props: {
      defaultModel: 'Bullock01',
    },
  },
  {
    component: Concentration,
    model: 'halo-concentration',
    title: 'Halo Concentration',
    id: 'halo-concentration',
    props: {
      defaultModel: 'Duffy08',
    },
  },
  {
    component: HaloExclusion,
    model: 'exclusion',
    title: 'Halo Exclusion',
    id: 'halo-exclusion',
  },
  {
    component: BiasForm,
    model: 'bias',
    title: 'Bias',
    id: 'bias',
  },
  {
    component: HMFForm,
    model: 'hmf',
    title: 'HMF',
    id: 'hmf',
  },
  {
    component: HODForm,
    model: 'hod',
    title: 'HOD',
    id: 'hod',
  },
  {
    component: Profile,
    model: 'tracer-profile',
    title: 'Tracer Profile',
    id: 'tracer-profile',
  },
  {
    component: Profile,
    model: 'halo-profile',
    title: 'Halo Profile',
    id: 'Halo-profile',
  },
  {
    component: CosmologyForm,
    model: 'cosmo',
    title: 'Cosmology',
    id: 'cosmology',
  },
  {
    component: HaloModelForm,
    model: 'halo-model',
    title: 'Halo Model',
    id: 'halo-model',
  },
  {
    component: GrowthForm,
    model: 'growth',
    title: 'Growth',
    id: 'growth',
  },
  {
    component: FilterForm,
    model: 'filter',
    title: 'Filter',
    id: 'filter',
  },
  {
    component: TransferForm,
    model: 'transfer',
    title: 'Transfer',
    id: 'transfer',
  },
];

export default FORMS;
