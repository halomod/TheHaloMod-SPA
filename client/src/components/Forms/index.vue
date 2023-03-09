<template>
  <md-app id="create" md-mode="fixed" md-waterfall >
    <Navbar slot='md-app-toolbar'/>
    <md-app-drawer
      md-permanent="clipped"
      class="md-primary"
      md-fixed>
      <md-list>
        <md-list-item v-for="(form, index) in Object.values(forms)" :key="index"
          :class="{ 'router-link-active': currentlyVisible == form.title }"
          :to="`#${form.id}`">
          <span :style="{'color': !form.valid ? 'red' : null }">{{form.title}}</span>
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <div class="md-layout">
        <div class="md-layout-item md-size-15 md-small-size-5 md-xsmall-size-0"/>
        <div class="md-layout-item">
          <div class="banner">
            <h1>{{contextPrimary}}</h1>
            <md-field :class="validationClass">
              <label>Model Name</label>
              <md-input v-model="localName"/>
              <span class="md-error">Name is already in use</span>
            </md-field>
          </div>
          <md-divider/>
          <div v-for="(form, index) in Object.values(forms)" :key="index">
            <FormWrapper
              :id="form.id"
              :title="form.title"
              @currently-visible="() => setCurrentlyVisible(form.id, form.title)">
              <GenericForm
                v-if="initialFormState"
                :formId="form.id"
                :initialSubformState="initialFormState[form.id]"
                @is-valid="(valid) => setValid(form, valid)"
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
import Debug from 'debug';

const debug = Debug('Forms/index.vue');
debug.enabled = false;

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
    /**
     * The heading of the forms view
     */
    contextPrimary: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      forms: clonedeep(FORMS),
      currentlyVisible: null,
      currentFormState: clonedeep(this.initialFormState),
      localName: this.modelName ? this.modelName : '',
      originalModelName: this.modelName,
      localNameValid: true,
    };
  },
  updated() {
    console.log('form got updated');
  },
  created() {
    document.addEventListener('keyup', this.enterListener);
  },
  activated() {
    this.currentlyVisible = null;
    document.addEventListener('keyup', this.enterListener);
  },
  deactivated() {
    document.removeEventListener('keyup', this.enterListener);
  },
  destroyed() {
    document.removeEventListener('keyup', this.enterListener);
  },
  watch: {
    '$store.state.hmfcalcMode': {
      handler(newmode) {
        console.log('In the mode handler for the form...');
        // this.$nextTick(() => {
        if (newmode) {
          console.log('doing the filter');
          this.forms = {};
          Object.values(FORMS).forEach((key) => {
            console.log('key', key);
            if (key.hmfcalc) {
              this.forms[key.id] = key;
            }
          });
          console.log('finished the filter, got', this.forms, 'from', FORMS);
        } else {
          this.forms = clonedeep(FORMS);
        }
      //  });
      },
    },
    /**
     * If state is propogated up, then pass it along to this components parent.
     */
    currentFormState: {
      deep: true,
      handler() {
        this.$emit('onChange', clonedeep(this.currentFormState));
      },
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
    /**
     * If the parent model name changes, like when a new form is brought up,
     * update the local model name.
     */
    modelName(newName) {
      if (this.localName !== newName) {
        this.originalModelName = newName;
        if (newName !== null) {
          this.localName = newName;
        } else {
          this.localName = '';
        }
      }
    },
    localName(newName) {
      const valid = !(this.$store.state.modelNames.includes(newName.trim())
                      && newName.trim() !== this.originalModelName);
      if (this.localNameValid !== valid) {
        this.localNameValid = valid;
        this.$emit('is-valid', this.testValid());
      }
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
    enterListener(keyEvent) {
      if (keyEvent.keyCode === 13) {
        let returnModelNameVal;
        if (this.invalidName || this.modelName === '') {
          returnModelNameVal = false;
        } else {
          returnModelNameVal = this.localName;
        }
        this.$emit('activate-save', returnModelNameVal);
      }
    },
    setValid(f, valid) {
      const form = f;
      form.valid = valid;
      this.$emit('is-valid', this.testValid());
      this.$forceUpdate();
    },
    testValid() {
      // Test if the model name is valid first.
      if (!this.localNameValid) {
        return false;
      }
      // Test each form and return false when reaching the first invalid form.
      const valid = Object.keys(this.forms).every(
        (formKey) => this.forms[formKey].valid,
      );
      return valid;
    },
  },
  computed: {
    validationClass() { return { 'md-invalid': !this.localNameValid }; },
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
