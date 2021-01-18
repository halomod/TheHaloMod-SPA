<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Models</h3>
        </div>

        <div class="md-toolbar-section-end">
          <!-- At this moment, restarting causes some inconsistencies between
          the state held on the server and the state in the browser.
          <md-button @click="handleRestartClick" class="md-accent">Restart</md-button>
          -->
          <md-button @click="handleNewModelClick" class="md-primary">New Model</md-button>
        </div>
      </div>
      <md-list v-if="READ_ONLY.modelNames.length > 0" class="model-list">
        <Model
          v-for="modelName in READ_ONLY.modelNames"
          :key="modelName"
          :name="modelName"
          @delete-click="handleDeleteClick"
          @edit-click="handleEditClick"
          @copy-click="handleCopyClick"
        />
      </md-list>
      <p v-else>No models created yet. Please click "New Model"</p>
    </md-toolbar>
    <div v-if="loadingModel"
      style="display: grid; height: 100%">
      <md-progress-spinner
        :md-diameter="100"
        :md-stroke="10"
        md-mode="indeterminate"
        style="margin: auto;"/>
    </div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>{{
        currentOperation === OPERATIONS.create ?
        'New Model' :
        'Edit Model'
      }}</md-dialog-title>
      <Create
        :params="currentModelParams"
        @update-params="updateParams"
        :model_metadata="currentModelMetaData"
        @update-metadata="updateModelMetaData"
      />

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="handleSaveClick">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import Create from '@/views/Create';
import INITIAL_STATE from '@/constants/initial_state.json';
import clonedeep from 'lodash.clonedeep';
import Model from './Model';

const OPERATIONS = {
  edit: 'edit',
  create: 'create',
};

export default {
  name: 'Models',
  data() {
    return {
      showDialog: false,
      loadingModel: false,
      currentOperation: OPERATIONS.create,
      OPERATIONS,
      /**
       * Starts out as new model params. But when a model is selected, this
       * changes.
       */
      currentModelParams: clonedeep(INITIAL_STATE),
      currentModelMetaData: {
        model_name: 'Model',
        fig_type: 'dndm',
      },
      /**
       * Used to determine what the model's name used to be if the name is
       * updated.
       */
      currentModelStoredName: 'Model',
      READ_ONLY: this.$store.state,
    };
  },
  components: {
    Model,
    Create,
  },
  methods: {
    async handleRestartClick() {
      if (this.modelNames.length !== 0) {
        this.loadingModel = true;
        await Promise.all(this.modelNames.map((modelName) => this.$store.deleteModel(modelName)));
        this.loadingModel = false;
      }
    },
    handleNewModelClick() {
      this.currentOperation = OPERATIONS.create;
      this.showDialog = true;
    },
    async handleSaveClick() {
      this.showDialog = false;
      this.loadingModel = true;

      const modelName = this.currentModelMetaData.model_name;
      if (this.currentOperation === OPERATIONS.edit) {
        if (this.currentModelMetaData.model_name !== this.currentModelStoredName) {
          // Changing the name of the model, once there is logic built into the
          // API with this functionality, this process can be changed to that.
          const oldName = this.currentModelStoredName;
          const newName = this.currentModelMetaData.model_name;
          await this.$store.cloneModel(oldName, newName);
          await this.$store.deleteModel(oldName);
        } else {
          await this.$store.updateModel(this.currentModelStoredName, this.currentModelParams);
        }
      } else if (this.currentOperation === OPERATIONS.create) {
        await this.$store.createModel(this.currentModelParams, modelName);
      }
      this.loadingModel = false;
    },
    async handleDeleteClick(modelName) {
      await this.$store.deleteModel(modelName);
    },
    async handleEditClick(modelName) {
      this.loadingModel = true;
      this.currentModelParams = await this.$store.getModel(modelName);
      this.currentModelMetaData.model_name = modelName;
      this.currentModelStoredName = modelName;
      this.currentOperation = OPERATIONS.edit;
      this.loadingModel = false;
      this.showDialog = true;
    },
    async handleCopyClick(modelName) {
      this.loadingModel = true;
      await this.$store.cloneModel(modelName, `${modelName} copy`);
      this.loadingModel = false;
    },
    updateModelMetaData(newModelMetaData) {
      this.currentModelMetaData = newModelMetaData;
    },
    updateParams(newParams) {
      this.currentModelParams = newParams;
    },
  },
};
</script>

<style>
  .model-list {
    width: 100%;
    margin-bottom: 16px;
  }
</style>
