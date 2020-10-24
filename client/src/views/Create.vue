<template>
  <md-app md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <md-list v-for="(form, index) in forms" :key="index">
          <md-list-item>
            <span class="md-list-item-text">
              <router-link v-bind:to="`#${index}`">{{form.component.name}}</router-link>
            </span>
          </md-list-item>
        </md-list>
    </md-app-drawer>
    <md-app-content v-for="(form, index) in forms" :key="index">
      <component v-bind:is="form.component" v-bind:id="index"/>
    </md-app-content>
  </md-app>
</template>

<script>
// @ is an alias to /src
import ExampleForm from '@/components/ExampleForm.vue';

export default {
  name: 'Create',
  components: {
    ExampleForm,
  },
  data() {
    return {
      forms: [
        { component: ExampleForm },
        { component: ExampleForm },
        { component: ExampleForm },
      ],
    };
  },
};
</script>

<style scoped>
  .md-app {
    height: 80vh;
  }
</style>
