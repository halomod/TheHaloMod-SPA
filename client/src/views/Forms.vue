<template>
<div>
  <Alert
    :showAlert="showAlert"
    :title="READ_ONLY.errorType"
    :message="READ_ONLY.errorMessage"
    @close="closeAlertDialog"
    @focusout="closeAlertDialog"
    @change="closeAlertDialog"/>
  <Forms
    :initialFormState="initialFormState"
    :contextPrimary="contextPrimary"
    :modelName="name"
    @onChange="(data) => currentFormState = data" v-if="initialFormState"
    @is-valid="isValid"
    @activate-save="activateSaveDialog"/>
  <div id="float">
    <md-button @click="showCancelDialog = true" class="md-raised">Cancel</md-button>
    <div style="display: inline-block">
      <md-button :disabled="!valid"  @click="activateSaveDialog" class="md-raised md-primary">
        {{saveButton}} (Enter)
      </md-button>
      <md-tooltip v-if="!valid" md-direction="top">
        <span class="md-body-1">
          Fix errors in red
        </span>
      </md-tooltip>
    </div>
  </div>
  <div v-if="!loading">

    <!-- Confirm Edits Dialog -->
    <md-dialog :md-active.sync="showSaveDialog" v-if="edit" @keyup.enter="save">
      <md-dialog-title>Confirm Edits</md-dialog-title>
      <md-dialog-content>
        {{`Are you sure you want to overwrite '${name}?`}}
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="save">Confirm (Enter)</md-button>
        <md-button @click="showSaveDialog = false">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!-- Confirm New Model Dialog -->
    <md-dialog :md-active.sync="showSaveDialog" v-else @keyup.enter="save">
      <md-dialog-title>Save Model</md-dialog-title>
      <md-dialog-content>
        <md-field :class="validationClass">
          <label>Model Name</label>
          <md-input ref="saveInput" v-model="name" :value="name"/>
          <div class="md-error" v-if="invalidName">Name is already in use.</div>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button :disabled="invalidName" @click="save">Save Model (Enter)</md-button>
        <md-button @click="showSaveDialog = false">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>

  <!-- Loading Dialog -->
  <md-dialog v-else
    :md-active.sync="showSaveDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false">
    <md-dialog-title>{{loadingTitle}}</md-dialog-title>
    <md-dialog-content><md-progress-bar md-mode="indeterminate"/></md-dialog-content>
  </md-dialog>

  <!-- Cancel Confirmation Dialog -->
  <md-dialog :md-active.sync="showCancelDialog">
    <md-dialog-title>{{cancelTitle}}</md-dialog-title>
    <md-dialog-content>
      {{cancelMessage}}
    </md-dialog-content>
    <md-dialog-actions>
      <md-button @click="leave">Confirm</md-button>
      <md-button @click="showCancelDialog = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>

</div>
</template>

<script>
import clonedeep from 'lodash.clonedeep';
import Forms from '@/components/Forms';
import { DEFAULT_FORM_STATE } from '@/constants/backend_constants';
import Alert from '@/components/Alert';
import Debug from 'debug';

const debug = Debug('Forms.vue');
debug.enabled = false;

/**
 * Represents the view of the forms for each type of data entered into halomod.
 *
 * This component changes based on the context, being an "Edit" operation or
 * a "Create" operation.
 */
export default {
  name: 'FormView',
  components: {
    Forms,
    Alert,
  },
  data() {
    return {
      /**
       * Holds the currently edited model if there is one.
       */
      initialFormState: null,
      currentFormState: null,
      loading: false,
      showSaveDialog: false,
      showCancelDialog: false,
      edit: false,
      name: null,
      saveButton: 'Create',
      cancelMessage: 'Are you sure you want to leave the page without creating a new model?',
      cancelTitle: 'Discard Model',
      loadingTitle: 'Creating your model...',
      contextPrimary: 'Create',
      valid: true,
      READ_ONLY: this.$store.state,
      showAlert: false,
    };
  },
  async activated() {
    window.addEventListener('keypress', this.enterListener);
    if (this.$route.name === 'Edit') {
      this.edit = true;
      this.initialFormState = await this.$store.getModel(this.$route.params.id);
      this.name = this.$route.params.id;
      this.saveButton = 'Save';
      this.cancelMessage = `Are you sure you want to discard your changes to '${this.name}?`;
      this.cancelTitle = 'Discard Edits';
      this.loadingTitle = 'Updating your Model';
      this.contextPrimary = 'Edit';
    } else {
      this.edit = false;
      this.name = null;
      this.saveButton = 'Create';
      this.cancelMessage = 'Are you sure you want to leave the page without creating a new model?';
      this.cancelTitle = 'Discard Model';
      this.loadingTitle = 'Creating your model...';
      this.contextPrimary = 'Create';
      this.initialFormState = DEFAULT_FORM_STATE;
    }
    this.currentFormState = clonedeep(this.initialFormState);
  },
  deactivated() {
    window.removeEventListener('keypress', this.enterListener);
  },
  updated() {
    this.scrollToAnchor();
  },
  computed: {
    invalidName() {
      if (this.edit) return false;
      const invalid = this.$store.state.modelNames
        .includes(this.name ? this.name.trim() : undefined);
      return invalid;
    },
    validationClass() { return { 'md-invalid': this.invalidName }; },
  },
  methods: {
    scrollToAnchor() {
      this.$nextTick(() => {
        if (this.$route.hash) {
          document
            .getElementById(this.$route.hash.slice(1))
            .scrollIntoView({
              behavior: 'smooth',
            });
        }
      });
    },
    leave() {
      this.closeAlertDialog();
      this.showCancelDialog = false;
      this.$forceUpdate();
      this.$router.push('/');
    },
    async save() {
      if (this.edit) {
        this.loading = true;

        // Check to see if the name was changed
        if (this.name !== this.$route.params.id) {
          await this.$store.renameModel(this.$route.params.id, this.name);
        }

        await this.$store.updateModel(this.name, this.currentFormState);
      } else {
        if (this.invalidName) return;
        this.loading = true;
        await this.$store.createModel(this.currentFormState, this.name);
      }
      this.loading = false;
      this.showSaveDialog = false;
      if (this.$store.state.error) {
        // Show the error alert dialog
        this.showAlert = true;
      } else {
        this.$router.push('/');
      }
    },
    isValid(valid) {
      this.valid = valid;
      this.$forceUpdate();
    },
    /**
     * Activates the save dialog or just saves if the model name is already
     * correct. This depends on the user calling this function to provide
     * a valid name as a string or some other data type if it is not valid.
     */
    async activateSaveDialog(newModelName) {
      if (!this.showSaveDialog && this.valid) {
        if (typeof newModelName === 'string') {
          // If the name was supplied in the form and is valid
          this.name = newModelName;
        }
        this.showSaveDialog = true;
        if (!this.edit) {
          setTimeout(() => { this.$refs.saveInput.$el.focus(); }, 300);
        }
      }
    },
    closeAlertDialog() {
      this.showAlert = false;
      // Error has been shown so mark as false
      this.$store.state.error = false;
    },
  },
};
</script>

<style scoped>
#float {
  position: fixed;
  z-index: 1;
  display: block;
  bottom: 10px;
  right: 10px
}
</style>
