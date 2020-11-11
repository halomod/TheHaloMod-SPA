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
          v-bind:to="`#${form.component.id}`">
          {{form.component.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          :name="form.component.title"
          v-bind:id="`${form.component.id}`"
          @toggle-highlight="(bool) => toggleHighlight(bool, form, index)">
          <component
            :is="form.component"
            v-model="params[form.model]"/>
        </FormWrapper>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
// @ is an alias to /src
import FormWrapper from '@/components/FormWrapper.vue';
import HaloExclusion from '@/components/HaloExclusion.vue';
import BiasForm from '@/components/BiasForm.vue';
import HODForm from '@/components/HODForm.vue';
import INITIAL_STATE from '@/constants/initial_state.json';

export default {
  name: 'Create',
  components: {
    FormWrapper,
    HaloExclusion,
    HODForm,
    BiasForm,
  },
  data: () => ({
    params: null,
    forms: null,
  }),
  methods: {
    createForms() {
      // Add forms to this list, and remove the example form.
      // make sure you have a "title" and "id" property.
      const forms = [
        {
          component: HaloExclusion,
          model: 'exclusion',
        },
        {
          component: BiasForm,
          model: 'bias',
        },
        {
          component: HODForm,
          model: 'hod',
        },
      ];
      forms.forEach((item) => {
        const i = item;
        i.highlight = false;
        i.isVisible = false;
      });
      this.forms = forms;
    },
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
      window.history.replaceState({}, '', `${prefix}#${form.component.id}`);
    },
  },
  created() {
    this.params = this.deepcopy(INITIAL_STATE);
    this.createForms();
  },
};
</script>

<style scoped>
  #create {
    height: 80vh;
  };
</style>
