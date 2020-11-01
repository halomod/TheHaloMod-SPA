<template>
  <div class="wrapper">
    <div v-observe-visibility="visibilityChanged">
      <h2 class="md-title">{{name}}</h2>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formWrapper',
  props: ['name'],
  methods: {
    visibilityChanged(isVisible) {
      this.$emit('toggle-highlight', isVisible);
    },
  },
};
</script>

<style scoped>
.wrapper {
  margin: 10px;
}
</style>
