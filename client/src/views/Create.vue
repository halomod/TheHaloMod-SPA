<template>
<div>
  <Forms :init="initial" v-model="current"/>
  <div
  :style="{ position: 'fixed', zIndex: 1, display: 'block', bottom: '10px', right: '10px' }">
  <md-button @click="showCancelDialog = true" class="md-raised">Cancel</md-button>
  <md-button @click="showCreateDialog = true" class="md-raised md-primary">Create</md-button>
  </div>
  <md-dialog :md-active.sync="showCreateDialog">
    <md-dialog-title>Save Model</md-dialog-title>
    <md-content :style="{margin: '0 15px 0 15px'}">
      <md-field>
        <label>Model Name</label>
        <md-input v-model="name" :value="name"/>
      </md-field>
    </md-content>
    <md-dialog-actions>
      <md-button @click="save">Save Model</md-button>
      <md-button @click="showCreateDialog = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
  <md-dialog :md-active.sync="showCancelDialog">
    <md-dialog-title>Discard Model</md-dialog-title>
    <md-content :style="{margin: '0 15px 0 15px'}">
      {{`Are you sure you want to leave the page without creating a new model?`}}
    </md-content>
    <md-dialog-actions>
      <md-button @click="$router.push('/')">Confirm</md-button>
      <md-button @click="showCancelDialog = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
import INITIAL_STATE from '@/constants/initial_state.json';
import clonedeep from 'lodash.clonedeep';
import Forms from '@/components/Forms.vue';

export default {
  name: 'Create',
  components: {
    Forms,
  },
  data: () => ({
    initial: clonedeep(INITIAL_STATE),
    current: null,
    loading: false,
    showCreateDialog: false,
    showCancelDialog: false,
    name: null,
  }),
  created() {
    this.current = this.initial;
  },
  methods: {
    async save() {
      this.loading = true;
      await this.$store.createModel(this.current, this.name);
      this.loading = false;
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
</style>
