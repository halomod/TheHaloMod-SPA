<template>
<div>
  <Forms :init="initial" v-model="current"/>
  <div id="float">
    <md-button @click="showCancelDialog = true" class="md-raised">Cancel</md-button>
    <md-button @click="showSaveDialog = true" class="md-raised md-primary">
      {{saveButton}}
    </md-button>
  </div>
  <div v-if="!loading">
    <md-dialog :md-active.sync="showSaveDialog" v-if="edit">
      <md-dialog-title>Confirm Edits</md-dialog-title>
      <md-dialog-content>
        {{`Are you sure you want to overwrite '${name}?`}}
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="save">Confirm</md-button>
        <md-button @click="showSaveDialog = false">Cancel</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="showSaveDialog" v-else>
      <md-dialog-title>Save Model</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Model Name</label>
          <md-input v-model="name" :value="name"/>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="save">Save Model</md-button>
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
      <md-button @click="$router.push('/')">Confirm</md-button>
      <md-button @click="showCancelDialog = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
import INITIAL_STATE from '@/constants/initial_state.json';
import clonedeep from 'lodash.clonedeep';
import Forms from '@/components/forms/index.vue';

export default {
  name: 'Edit',
  components: {
    Forms,
  },
  data() {
    return {
      initial: clonedeep(INITIAL_STATE),
      current: null,
      loading: false,
      showSaveDialog: false,
      showCancelDialog: false,
      edit: false,
      name: null,
      saveButton: 'Create',
      cancelMessage: 'Are you sure you want to leave the page without creating a new model?',
      cancelTitle: 'Discard Model',
      loadingTitle: 'Creating your model...',
    };
  },
  beforeRouteEnter(to, _, next) {
    next(async (instance) => {
      const vm = instance;
      if (vm.$route.name === 'Edit') {
        vm.edit = true;
        vm.initial = await vm.$store.getModel(to.params.id);
        vm.name = vm.$route.params.id;
        vm.saveButton = 'Save';
        vm.cancelMessage = `Are you sure you want to discard your changes to '${vm.name}?`;
        vm.cancelTitle = 'Discard Edits';
        vm.loadingTitle = 'Updating your Model';
      }
      vm.current = vm.initial;
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    if (this.edit) {
      this.initial = await this.$store.getModel(this.$route.params.id);
    }
    this.current = this.initial;
    next();
  },
  methods: {
    async save() {
      this.loading = true;
      if (this.edit) {
        await this.$store.updateModel(this.name, this.current);
      } else {
        await this.$store.createModel(this.current, this.name);
      }
      this.loading = false;
      this.$router.push('/');
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
