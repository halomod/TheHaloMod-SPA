<template>
  <div class="wrapper">
    <div>
      <h2
        class="md-title"
        v-observe-visibility="{
          callback: visibilityChanged,
          intersection: {
            rootMargin: '0px 0px -85% 0px',
            threshold: '.1',
          },
        }">
        {{title}}
      </h2>
      <slot />
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
  margin-bottom: 5vh;
  margin-top: 5vh
}
.md-title {
  padding-top: 10px;
}
</style>
