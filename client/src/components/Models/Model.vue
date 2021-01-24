<template>
  <md-list-item>
    <div class="md-list-item-text">
      <span>{{name}}</span>
    </div>

    <md-button
      class="md-icon-button"
      @click="$emit('edit-click', name)"
      :disabled="buttonsDisabled"
    >
      <md-icon>edit</md-icon>
      <md-tooltip>Edit</md-tooltip>
    </md-button>
    <md-button
      class="md-icon-button"
      @click="$emit('copy-click', name)"
      :disabled="buttonsDisabled"
    >
      <md-icon>content_copy</md-icon>
      <md-tooltip>Copy</md-tooltip>
    </md-button>
    <md-button
      class="md-icon-button"
      @click="$emit('delete-click', name)"
      :disabled="buttonsDisabled"
    >
      <md-icon>delete</md-icon>
      <md-tooltip>Delete</md-tooltip>
    </md-button>

  </md-list-item>
</template>

<script>
export default {
  name: 'Model',
  props: {
    name: {
      type: String,
    },
    /**
     * Used to disable the buttons, like if the model is loading.
     */
    buttonsDisabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>

</style>
