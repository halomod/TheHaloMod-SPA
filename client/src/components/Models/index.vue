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
          <md-button @click="restart" class="md-accent">Restart</md-button>
          -->
          <md-button @click="create" class="md-primary">New Model</md-button>
        </div>
      </div>
      <md-list v-if="STORE_STATE.modelNames.length > 0" class="model-list">
        <Model
          v-for="modelName in STORE_STATE.modelNames"
          :key="modelName"
          :name="modelName"
          :blocked="blocked"
          @delete-click="del"
          @edit-click="edit"
          @copy-click="copy"
          @rename-click="(newName) => rename(modelName, newName)"
          @block="blocked = true"
          @release="blocked = false"
        />
      </md-list>
      <p v-else>No models created yet. Please click "New Model"</p>
    </md-toolbar>
    <div v-if="loading"
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
import Debug from 'debug';
import Model from './Model.vue';

const debug = Debug('Models');
debug.enabled = true;

export default {
  name: 'Models',
  data() {
    return {
      loading: false,
      blocked: false,

      /**
       * Needs to stay as a direct reference to the state of the store so that
       * it updates automatically.
       */
      STORE_STATE: this.$store.state,
    };
  },
  components: {
    Model,
  },
  methods: {
    async restart() {
      if (this.modelNames.length !== 0) {
        this.loading = true;
        this.blocked = true;
        await Promise.all(this.modelNames.map((modelName) => this.$store.deleteModel(modelName)));
        this.blocked = false;
        this.loading = false;
      }
    },
    create() {
      this.$router.push('/create');
    },
    async rename(oldName, newName) {
      if (oldName === newName) return;
      this.blocked = true;
      this.loading = true;
      await this.$store.renameModel(oldName, newName);
      this.loading = false;
      this.blocked = false;
    },
    async del(modelName) {
      await this.$store.deleteModel(modelName);
    },
    edit(modelName) {
      this.$router.push(`/edit/${modelName}`);
    },
    async copy(modelName) {
      this.loading = true;
      this.blocked = true;
      await this.$store.cloneModel(modelName, `${modelName} copy`);
      this.blocked = false;
      this.loading = false;
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
