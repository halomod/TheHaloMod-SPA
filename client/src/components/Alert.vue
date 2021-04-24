<template>
  <div>
    <md-dialog
    :md-active.sync="showAlert"
    @md-closed="$emit('close')"
    @md-clicked-outside="$emit('close')">
      <md-dialog-title>{{ title }} Error</md-dialog-title>
      <md-divider></md-divider>
      <md-dialog-content class="text-block">{{ message }}</md-dialog-content>
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
  computed: {
    withBrTags() {
      const doc = this.item.licensedocument.legal.documentText;
      return doc.replace(/(\\r)*\\n/g, '<br>');
    },
  },
};
</script>

<style scoped>
  .text-block {
    white-space: pre;
  }
</style>
