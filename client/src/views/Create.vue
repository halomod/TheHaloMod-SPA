<template>
  <md-app id="create" md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <!-- TODO: remove index from id when there are more than 1 form -->
      <md-list v-for="(form, index) in forms" :key="index">
        <router-link v-bind:to="`#${form.component.name}-${index}`">
          <md-list-item>
            <!-- replace highlight with styles -->
            {{form.highlight}}
            {{form.component.name}}
          </md-list-item>
        </router-link>
      </md-list>
    </md-app-drawer>
    <!-- TODO: remove index from id when there are more than 1 form -->
    <md-app-content>
      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          v-bind:id="`${form.component.name}-${index}`"
          @toggle-highlight="(bool) => toggleHighlight(bool, form, index)">
          <component v-bind:is="form.component"/>
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
        { component: ExampleForm, highlight: false, isVisible: false },
        { component: ExampleForm, highlight: false, isVisible: false },
        { component: ExampleForm, highlight: false, isVisible: false },
      ],
    };
  },
  methods: {
    toggleHighlight(bool, form, index) {
      const formcpy = { ...form };
      if (!bool) {
        formcpy.highlight = false;
        if (index + 1 < this.forms.length) {
          if (index === 0) {
            this.forms[index + 1].highlight = true;
          } else if (index - 1 >= 0 && !this.forms[index - 1].isVisible) {
            this.forms[index + 1].highlight = true;
          }
        }
      } else if (bool) {
        if (index - 1 >= 0) {
          if (!this.forms[index - 1].isVisible) {
            formcpy.highlight = true;
          }
        } else {
          formcpy.highlight = true;
        }
        if (index + 1 < this.forms.length) {
          this.forms[index + 1].highlight = false;
        }
      }
      formcpy.isVisible = bool;
      this.forms[index] = formcpy;
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
  #create {
    height: 80vh;
  }
</style>
