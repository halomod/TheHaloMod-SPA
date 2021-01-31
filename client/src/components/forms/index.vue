<template>
  <md-app id="create" md-mode="fixed" md-waterfall>
    <Navbar slot='md-app-toolbar'/>
    <md-app-drawer
      md-permanent="clipped"
      class="md-primary"
      md-fixed
    >
      <md-list v-for="(form, index) in forms" :key="index">
        <md-list-item
          :class="{'router-link-active': currentlyVisible == form.title}"
          :to="`#${form.id}`">
          {{form.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <div v-for="(form, index) in forms" :key="index">
        <FormWrapper
          :id="form.id"
          :title="form.title"
          @currently-visible="() => setCurrentlyVisible(form.id, form.title)">
          <component
            v-bind="buildProps(form)"
            :is="form.component"
            v-model="params[form.model]"/>
        </FormWrapper>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
import FormWrapper from '@/components/FormWrapper.vue';
import Navbar from '@/components/Navbar.vue';
import clonedeep from 'lodash.clonedeep';
import Debug from 'debug';
import FORMS from '@/constants/forms.js';

const debug = Debug('Create.vue');
debug.enabled = true;
export default {
  name: 'Forms',
  components: {
    FormWrapper,
    Navbar,
  },
  props: {
    init: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      forms: FORMS,
      currentlyVisible: null,
      params: clonedeep(this.init),
      default: clonedeep(this.init),
    };
  },
  watch: {
    params() {
      this.$emit('onChange', clonedeep(this.params));
    },
    init() {
      this.params = this.init;
    },
  },
  methods: {
    setCurrentlyVisible(id, title) {
      this.currentlyVisible = title;
      window.history.replaceState({}, '', `#${id}`);
    },
    buildProps(form) {
      // console.log(this.default[form.id]);
      return { ...form.props, init: this.default[form.id] };
    },
  },
};
</script>

<style scoped>
  #create {
    height: 100vh;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
