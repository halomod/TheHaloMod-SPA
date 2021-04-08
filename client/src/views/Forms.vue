<template>
<div>
  <Forms
    :initialFormState="initialFormState"
    :contextPrimary="contextPrimary"
    :contextSecondary="contextSecondary"
    @onChange="(data) => currentFormState = data" v-if="initialFormState"
    @is-valid="isValid"/>
  <div id="float">
    <md-button @click="showCancelDialog = true" class="md-raised">Cancel</md-button>
    <div style="display: inline-block">
      <md-button :disabled="!valid"  @click="activateSaveDialog" class="md-raised md-primary">
        {{saveButton}}
      </md-button>
      <md-tooltip v-if="!valid" md-direction="top">
        <span class="md-body-1">
          Fix errors in red
        </span>
      </md-tooltip>
    </div>
  </div>
  <div v-if="!loading">
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
    <md-dialog :md-active.sync="showSaveDialog" v-else  @keyup.enter="save">
      <md-dialog-title>Save Model</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Model Name</label>
          <md-input ref="saveInput" v-model="name" :value="name"/>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="save">Save Model (Enter)</md-button>
        <md-button @click="showSaveDialog = false">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
  <md-dialog v-else
    :md-active.sync="showSaveDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false">
    <md-dialog-title>{{loadingTitle}}</md-dialog-title>
    <md-dialog-content><md-progress-bar md-mode="indeterminate"/></md-dialog-content>
  </md-dialog>
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
      contextSecondary: 'New Model',
      valid: true,
    };
  },
  async activated() {
    if (this.$route.name === 'Edit') {
      this.edit = true;
      this.initialFormState = await this.$store.getModel(this.$route.params.id);
      this.name = this.$route.params.id;
      this.saveButton = 'Save';
      this.cancelMessage = `Are you sure you want to discard your changes to '${this.name}?`;
      this.cancelTitle = 'Discard Edits';
      this.loadingTitle = 'Updating your Model';
      this.contextPrimary = 'Edit';
      this.contextSecondary = this.name;
    } else {
      this.edit = false;
      this.name = null;
      this.saveButton = 'Create';
      this.cancelMessage = 'Are you sure you want to leave the page without creating a new model?';
      this.cancelTitle = 'Discard Model';
      this.loadingTitle = 'Creating your model...';
      this.contextPrimary = 'Create';
      this.contextSecondary = 'New Model';
      this.initialFormState = DEFAULT_FORM_STATE;
    }
    this.currentFormState = clonedeep(this.initialFormState);
  },
  updated() {
    this.scrollToAnchor();
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
      this.showCancelDialog = false;
      this.$router.push('/');
    },
    async save() {
      this.loading = true;
      if (this.edit) {
        await this.$store.updateModel(this.name, this.currentFormState);
      } else {
        await this.$store.createModel(this.currentFormState, this.name);
      }
      this.loading = false;
      this.showSaveDialog = false;
      this.$router.push('/');
    },
    isValid(valid) {
      this.valid = valid;
      this.$forceUpdate();
    },
    activateSaveDialog() {
      this.showSaveDialog = true;
      if (!this.edit) {
        setTimeout(() => { this.$refs.saveInput.$el.focus(); }, 300);
      }
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
