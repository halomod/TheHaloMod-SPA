<template>
  <div class="wrapper">
    <div v-observe-visibility="visibilityChanged">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formWrapper',
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
