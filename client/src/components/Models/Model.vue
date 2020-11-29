<template>
  <md-list-item>
    <div class="md-list-item-text">
      <span>{{name}}</span>
    </div>

    <md-button class="md-icon-button">
      <md-icon>edit</md-icon>
      <md-tooltip>Edit</md-tooltip>
    </md-button>
    <md-button class="md-icon-button">
      <md-icon>content_copy</md-icon>
      <md-tooltip>Copy</md-tooltip>
    </md-button>
    <md-button class="md-icon-button">
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
  },
};
</script>

<style>

</style>
