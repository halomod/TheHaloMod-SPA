<template>
<div>
  <div id="float">
    <md-button @click="showCancelDialog = true" class="md-raised">Cancel</md-button>
    <md-button @click="showSaveDialog = true" class="md-raised md-primary">Save</md-button>
  </div>
  <Forms :init="initial" @onChange="(data) => current = data"/>
  <md-dialog v-if="!loading"
    :md-active.sync="showSaveDialog">
    <md-dialog-title>Confirm Edits</md-dialog-title>
    <md-dialog-content>
      {{`Are you sure you want to overwrite '${name}?`}}
    </md-dialog-content>
    <md-dialog-actions>
      <md-button @click="save">Confirm</md-button>
      <md-button @click="showSaveDialog = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
  <md-dialog v-else
    :md-active.sync="showSaveDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false">
    <md-dialog-title>Updating your Model</md-dialog-title>
    <md-dialog-content><md-progress-bar md-mode="indeterminate"/></md-dialog-content>
  </md-dialog>
  <md-dialog :md-active.sync="showCancelDialog">
    <md-dialog-title>Discard Edits</md-dialog-title>
    <md-dialog-content>
      {{`Are you sure you want to discard your changes to '${name}?`}}
    </md-dialog-content>
    <md-dialog-actions>
      <md-button @click="$router.push('/')">Confirm</md-button>
      <md-button @click="showCancelDialog = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
// import clonedeep from 'lodash.clonedeep';
import Forms from '@/components/forms';
import clonedeep from 'lodash.clonedeep';

export default {
  name: 'Edit',
  components: {
    Forms,
  },
  data() {
    return {
      initial: null,
      current: null,
      loading: false,
      showSaveDialog: false,
      showCancelDialog: false,
      name: this.$route.params.id,
    };
  },
  beforeRouteEnter(to, _, next) {
    next(async (instance) => {
      const vm = instance;
      const initial = await vm.$store.getModel(to.params.id);
      vm.initial = clonedeep(initial);
      vm.current = clonedeep(vm.initial);
      console.log('Entering route');
      console.log(vm.initial);
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    console.log('happening');
    const updated = await this.$store.getModel(this.$route.params.id);
    Object.assign(this.initial, updated);
    Object.assign(this.current, updated);
    console.log(this.initial);
    next();
  },
  methods: {
    async save() {
      this.loading = true;
      await this.$store.updateModel(this.name, this.current);
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
