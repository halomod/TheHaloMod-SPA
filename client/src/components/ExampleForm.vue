<template>
  <div class="content">
    {{id}}
  </div>
</template>

<script>
export default {
  name: 'exampleform',
  props: ['id'],
};
</script>

<style scoped>
.content {
  height: 80vh;
}
</style>
