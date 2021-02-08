<template>
    <md-card class="md-accent">
        <md-card-header>
            <md-icon>error_outline</md-icon>
            <div class="md-title">Graph Error</div>
        </md-card-header>
        <md-card-content>{{ message }}</md-card-content>
    </md-card>
</template>

<script>
export default {
  name: 'Error',
  props: {
    message: String,
  },
};
</script>

<style scoped>
  .md-card-header {
    display: inline-flex;
  }
  .md-card {
    width: 40vw;
    height: 15vh;
    margin: 20px auto;
  }
</style>
