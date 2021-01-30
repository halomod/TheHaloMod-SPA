<template>
<div>
  <div
    :style="{ position: 'fixed', zIndex: 1, display: 'block', bottom: '10px', right: '10px' }">
    <md-button @click="showCancelDialog = true" class="md-raised">Cancel</md-button>
    <md-button @click="showSaveDialog = true" class="md-raised md-primary">Save</md-button>
  </div>
  <Forms :init="initial" v-model="current"/>
  <md-dialog :md-active.sync="showSaveDialog">
    <md-dialog-title>Confirm Edits</md-dialog-title>
    <md-content :style="{margin: '0 15px 0 15px'}">
      {{`Are you sure you want to overwrite '${name}?`}}
    </md-content>
    <md-dialog-actions>
      <md-button @click="save">Confirm</md-button>
      <md-button @click="showSaveDialog = false">Cancel</md-button>
    </md-dialog-actions>
  </md-dialog>
  <md-dialog :md-active.sync="showCancelDialog">
    <md-dialog-title>Discard Edits</md-dialog-title>
    <md-content :style="{margin: '0 15px 0 15px'}">
      {{`Are you sure you want to discard your changes to '${name}?`}}
    </md-content>
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
      vm.initial = await vm.$store.getModel(to.params.id);
      vm.current = vm.initial;
      next();
    });
  },
  async beforeRouteUpdate(to, from, next) {
    this.initial = await this.$store.getModel(this.$route.params.id);
    this.current = this.initial;
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
