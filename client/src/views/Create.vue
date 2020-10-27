<template>
  <md-app id="create" md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <!-- TODO: remove index from id when there are more than 1 form -->
      <md-list v-for="(form, index) in forms" :key="index">
          <md-list-item>
            <span class="md-list-item-text">
              <router-link v-bind:to="`#${form.name}-${index}`">
                {{form.name}}
              </router-link>
            </span>
          </md-list-item>
        </md-list>
    </md-app-drawer>
    <!-- TODO: remove index from id when there are more than 1 form -->
    <md-app-content>
      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper v-bind:id="`${form.name}-${index}`">
          <component v-bind:is="form"/>
        </FormWrapper>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
// @ is an alias to /src
import FormWrapper from '@/components/FormWrapper.vue';
import ExampleForm from '@/components/ExampleForm.vue';

export default {
  name: 'Create',
  components: {
    FormWrapper,
    ExampleForm,
  },
  data() {
    return {
      // Add forms to this list, and remove the example form.
      // make sure you have a "name" property. That is used for the menu.
      forms: [
        ExampleForm,
        ExampleForm,
        ExampleForm,
      ],
    };
  },
};
</script>

<style scoped>
  #create {
    height: 80vh;
  }
</style>
