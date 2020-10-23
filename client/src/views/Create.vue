<template>
  <md-app md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <md-list>
          <md-list-item>
            <span class="md-list-item-text">Inbox</span>
          </md-list-item>

          <md-list-item>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>

          <md-list-item>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>

          <md-list-item>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
    </md-app-drawer>

    <md-app-content>
      <div class="content">
        asdfasdf
      </div>
      <div class="content">
        twaetwt
      </div>
      <div class="content">
        wpeoropwirpoew
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Create',
  components: {
  },
};
</script>

<style scoped>
  .md-app {
    height: 80vh;
  }
  .content {
    height: 80vh;
  }
</style>
