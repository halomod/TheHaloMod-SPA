<template>
    <md-card class="md-accent">
        <md-card-header>
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
