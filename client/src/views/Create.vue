<template>
  <md-app id="create" md-mode="fixed">
    <md-app-drawer
      md-permanent="full"
      class="md-primary"
      md-fixed
    >
      <md-list v-for="(form, index) in forms" :key="index">
        <md-list-item
          :class="{'router-link-active': form.highlight}"
          v-bind:to="`#${form.component.name}`">
          {{form.component.name}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          v-bind:id="`${form.component.name}`"
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
import ExampleForm1 from '@/components/ExampleForm1.vue';
import ExampleForm2 from '@/components/ExampleForm2.vue';

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
        { component: ExampleForm1, highlight: false, isVisible: false },
        { component: ExampleForm2, highlight: false, isVisible: false },
      ],
    };
  },
  methods: {
    toggleHighlight(bool, form, index) {
      const f = form;
      if (!bool) {
        f.highlight = false;
        if (index + 1 < this.forms.length) {
          if (index === 0) {
            this.handleTopForm(this.forms[index + 1], index + 1);
          } else if (index - 1 >= 0 && !this.forms[index - 1].isVisible) {
            this.handleTopForm(this.forms[index + 1], index + 1);
          }
        }
      } else if (bool) {
        if (index - 1 >= 0) {
          if (!this.forms[index - 1].isVisible) {
            this.handleTopForm(f, index);
          }
        } else {
          this.handleTopForm(f, index);
        }
        if (index + 1 < this.forms.length) {
          this.forms[index + 1].highlight = false;
        }
      }
      f.isVisible = bool;
      this.forms[index] = f;
      this.$forceUpdate();
    },
    handleTopForm(form, index, prefix = '/create') {
      const f = form;
      f.highlight = true;
      window.history.replaceState({}, '', `${prefix}#${form.component.name}`);
    },
  },
};
</script>

<style scoped>
  #create {
    height: 80vh;
  };
</style>
