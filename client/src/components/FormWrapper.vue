<template>
  <div v-observe-visibility="visibilityChanged">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'formWrapper',
  props: ['y'],
  methods: {
    visibilityChanged(isVisible, entry) {
      if (isVisible) this.$emit(entry.boundingClientRect.y.toString(), 'y');
      console.log(entry.boundingClientRect.y, this.$attrs.id, isVisible);
    },
  },
};
</script>
