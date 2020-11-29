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
          :name="model"
        />
      </md-list>
    </md-toolbar>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Preferences</md-dialog-title>
      <Create/>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="showDialog = false">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import Create from '@/views/Create';
import Model from './Model';

export default {
  name: 'Models',
  data() {
    return {
      showDialog: false,
    };
  },
  components: {
    Model,
    Create,
  },
  computed: {
    models() {
      const { models } = this.$store;
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
  },
};
</script>

<style>
  .model-list {
    width: 100%;
    margin-bottom: 16px;
  }
</style>
