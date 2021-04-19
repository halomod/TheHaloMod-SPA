<template>
  <div>
    <md-dialog :md-active.sync="showAlert">
      <md-dialog-title>{{ title }}</md-dialog-title>
      <md-divider></md-divider>
      <md-card-content>{{ message }}</md-card-content>
      <md-divider></md-divider>

      <md-dialog-actions>
        <md-button class="md-primary" @click="$emit('close')">Okay</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: ['showAlert', 'title', 'message'],
  methods: {
    tmpClose() {
      this.$emit('input', false);
    },
  },
};
</script>
