<template>
  <md-list-item>
    <div class="md-list-item-text">
      <span>{{name}}</span>
    </div>

    <md-button class="md-icon-button md-list-action">
      <md-icon class="md-primary">star</md-icon>
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
