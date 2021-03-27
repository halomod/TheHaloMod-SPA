<template>
  <md-app id="create" md-mode="fixed" md-waterfall>
    <Navbar slot='md-app-toolbar'/>
    <md-app-drawer
      md-permanent="clipped"
      class="md-primary"
      md-fixed>
      <md-list>
        <md-list-item v-for="(form, index) in Object.values(forms)" :key="index"
          :class="{'router-link-active': currentlyVisible == form.title}"
          :to="`#${form.id}`">
          {{form.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <div class="md-layout">
        <div class="md-layout-item md-size-15 md-small-size-5 md-xsmall-size-0"/>
        <div class="md-layout-item">
          <div class="banner">
            <h1>{{contextPrimary}}</h1>
            <h2 class="md-title">{{contextSecondary}}</h2>
          </div>
          <md-divider/>
          <div v-for="(form, index) in Object.values(forms)" :key="index">
            <FormWrapper
              :id="`form_wrapper_${form.id}`"
              :title="form.title"
              @currently-visible="() => setCurrentlyVisible(form.id, form.title)">
              <GenericForm
                v-if="initialFormState"
                :formId="form.id"
                :initialSubformState="initialFormState[form.id]"
                v-model="currentFormState[form.id]"/>
            </FormWrapper>
            <md-divider/>
          </div>
        </div>
        <div class="md-layout-item md-size-30 md-small-size-0"/>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
import FormWrapper from '@/components/FormWrapper.vue';
import Navbar from '@/components/Navbar.vue';
import clonedeep from 'lodash.clonedeep';
import FORMS from '@/constants/forms';
import GenericForm from '@/components/Forms/GenericForm.vue';

export default {
  name: 'Forms',
  components: {
    FormWrapper,
    Navbar,
    GenericForm,
  },
  model: {
    event: 'onChange',
  },
  props: {
    /**
     * The state of the model.
     */
    initialFormState: {
      type: Object,
      required: true,
    },
    contextPrimary: {
      type: String,
      required: true,
    },
    contextSecondary: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      forms: FORMS,
      currentlyVisible: null,
      currentFormState: clonedeep(this.initialFormState),
    };
  },
  activated() {
    this.currentlyVisible = null;
  },
  watch: {
    /**
     * If state is propogated up, then pass it along to this components parent.
     */
    currentFormState: {
      deep: true,
      handler() { this.$emit('onChange', clonedeep(this.currentFormState)); },
    },
    /**
     * If state is propogated down, then pass it along to the children.
     */
    initialFormState: {
      deep: true,
      handler() {
        this.currentFormState = clonedeep(this.initialFormState);
      },
    },
  },
  methods: {
    /**
     * At the moment, this function triggers a re-render of the forms.
     * It might be good to find a way to make this not happen. This can be
     * seen by setting up a debugging statement in a lifecycle hook for a
     * re-render in the generic form.
     */
    setCurrentlyVisible(id, title) {
      this.currentlyVisible = title;
      window.history.replaceState({}, '', `#${id}`);
    },
  },
};
</script>

<style scoped>
  #create {
    height: 100vh;
  }
  #banner {
    padding-top: 5vh;
    padding-bottom: 5vh;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
