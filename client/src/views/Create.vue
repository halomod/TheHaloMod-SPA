<template>
  <md-app id="create" md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <md-list v-for="(form, index) in forms" :key="index">
        <md-list-item
          :class="{'router-link-active': currentlyVisible == form.title}"
          :to="`#${form.id}`">
          {{form.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>

      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          :id="form.id"
          :title="form.title"
          @currently-visible="() => setCurrentlyVisible(form.id, form.title)">
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
</template>

<script>
import FormWrapper from '@/components/FormWrapper.vue';
import Debug from 'debug';
import FORMS from '@/constants/forms.js';

const debug = Debug('Create.vue');
debug.enabled = true;
export default {
  name: 'Create',
  components: {
    FormWrapper,
  },
  props: {
    params: {
      type: Object,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    forms: FORMS,
    currentlyVisible: null,
  }),
  methods: {
    updateModelName(updatedName) {
      this.$emit('update-model-name', updatedName);
    },
    setCurrentlyVisible(id, title, prefix = '/create') {
      this.currentlyVisible = title;
      window.history.replaceState({}, '', `${prefix}#${id}`);
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
