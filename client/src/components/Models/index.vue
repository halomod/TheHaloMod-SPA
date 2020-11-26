<template>
  <div>
    <md-toolbar class="md-large">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <h3 class="md-title">Models</h3>
        </div>

        <div class="md-toolbar-section-end">
          <md-button class="md-accent">Restart</md-button>
          <md-button class="md-primary">New Model</md-button>
        </div>
      </div>
      <md-list class="full-width">
        <Model
          v-for="model in models"
          :key="model.id"
          :name="model.name"
        />
      </md-list>
    </md-toolbar>
  </div>
</template>

<script>
import Model from './Model';

export default {
  name: 'Models',
  props: {
    models: {
      type: Object,
    },
  },
  data() {
    return {
      stuff: 'something',
    };
  },
  components: {
    Model,
  },
};
</script>

<style>
  .full-width {
    width: 100%;
  }
</style>
