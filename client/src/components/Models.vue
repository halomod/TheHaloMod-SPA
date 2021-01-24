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
          <md-button href="/create" class="md-primary">New Model</md-button>
        </div>
      </div>
      <md-list v-if="READ_ONLY.modelNames.length > 0" class="model-list">
        <md-list-item v-for="name in READ_ONLY.modelNames" :key="name">
          <div class="md-list-item-text">
            <span>{{name}}</span>
          </div>

          <md-button class="md-icon-button" :href="`/edit/${name}`">
            <md-icon>edit</md-icon>
            <md-tooltip>Edit</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click="() => handleCopyClick(name)">
            <md-icon>content_copy</md-icon>
            <md-tooltip>Copy</md-tooltip>
          </md-button>
          <md-button class="md-icon-button" @click="() => handleDeleteClick(name)">
            <md-icon>delete</md-icon>
            <md-tooltip>Delete</md-tooltip>
          </md-button>
      </md-list-item>
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
  </div>
</template>

<script>
import INITIAL_STATE from '@/constants/initial_state.json';
import clonedeep from 'lodash.clonedeep';

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
  methods: {
    async handleRestartClick() {
      if (this.modelNames.length !== 0) {
        this.loadingModel = true;
        await Promise.all(this.modelNames.map((modelName) => this.$store.deleteModel(modelName)));
        this.loadingModel = false;
      }
    },
    async handleDeleteClick(modelName) {
      await this.$store.deleteModel(modelName);
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
