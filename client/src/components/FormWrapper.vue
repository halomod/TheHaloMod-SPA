<template>
  <div class="wrapper">
    <div>
      <h2 class="md-title"
        v-observe-visibility="{
          callback: visibilityChanged,
          intersection: {
            rootMargin: '0px 0px -70% 0px',
            threshold: '.1',
          },

      }">
      {{title}}
    </h2>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formWrapper',
  props: ['title'],
  methods: {
    visibilityChanged(isVisible) {
      if (isVisible) this.$emit('currently-visible', this.title);
    },
  },
};
</script>

<style scoped>
.wrapper {
  margin: 10px;
  margin-bottom: 10vh;
}
</style>
