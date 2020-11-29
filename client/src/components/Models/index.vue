<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Models</h3>
        </div>

        <div class="md-toolbar-section-end">
          <md-button @click="handleRestartClick" class="md-accent">Restart</md-button>
          <md-button @click="handleNewModelClick" class="md-primary">New Model</md-button>
        </div>
      </div>
      <md-list class="model-list">
        <Model
          v-for="model in models"
          :key="model"
          :name="test"
        />
      </md-list>
    </md-toolbar>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>New Model</md-dialog-title>
      <Create
        :params="currentModelParams"
        :model_metadata="currentModelMetaData"
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

export default {
  name: 'Models',
  data() {
    return {
      showDialog: false,
      /**
       * Starts out as new model params. But when a model is selected, this
       * changes.
       */
      currentModelParams: clonedeep(INITIAL_STATE),
      currentModelMetaData: {
        model_name: 'Model',
        fig_type: 'dndm',
      },
    };
  },
  components: {
    Model,
    Create,
  },
  computed: {
    /**
     * A read-only set of models pulled in from the store.
     */
    models() {
      const { models } = this.$store.models;
      console.log(models);
      return models;
    },
  },
  methods: {
    handleRestartClick() {
      console.log('Restart was clicked');
    },
    handleNewModelClick() {
      this.showDialog = true;
    },
    async handleSaveClick() {
      const modelName = this.currentModelMetaData.model_name;
      this.showDialog = false;
      await this.$store.createModel(this.currentModelParams, modelName);
      this.$forceUpdate();
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
