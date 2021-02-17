<template>
  <md-app id="create" md-mode="fixed" md-waterfall>
    <Navbar slot='md-app-toolbar'/>
    <md-app-drawer
      md-permanent="clipped"
      class="md-primary"
      md-fixed>
      <md-list>
        <md-list-item v-for="(form, index) in forms" :key="index"
          :class="{'router-link-active': currentlyVisible == form.title}"
          :to="`#${form.id}`">
          {{form.title}}
        </md-list-item>
      </md-list>
    </md-app-drawer>
    <md-app-content>
      <div class="md-layout">
        <div class="md-layout-item md-size-15 md-small-size-5 md-xsmall-size-0"/>
        <div class="md-layout-item">
          <div class="banner">
            <h1>{{contextPrimary}}</h1>
            <h2 class="md-title">{{contextSecondary}}</h2>
          </div>
          <md-divider/>
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
            <md-divider/>
          </div>
        </div>
        <div class="md-layout-item md-size-30 md-small-size-0"/>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
import FormWrapper from '@/components/FormWrapper.vue';
import Navbar from '@/components/Navbar.vue';
import clonedeep from 'lodash.clonedeep';
import Debug from 'debug';
import FORMS from '@/constants/forms';

const debug = Debug('Create.vue');
debug.enabled = true;
export default {
  name: 'Forms',
  components: {
    FormWrapper,
    Navbar,
  },
  model: {
    event: 'onChange',
  },
  props: {
    init: {
      type: Object,
      required: true,
    },
    contextPrimary: {
      type: String,
      required: true,
    },
    contextSecondary: {
      type: String,
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
  activated() {
    this.currentlyVisible = null;
  },
  watch: {
    params: {
      deep: true,
      handler() { this.$emit('onChange', clonedeep(this.params)); },
    },
    init: {
      deep: true,
      handler() {
        this.params = clonedeep(this.init);
        this.default = clonedeep(this.init);
      },
    },
  },
  methods: {
    setCurrentlyVisible(id, title) {
      this.currentlyVisible = title;
      window.history.replaceState({}, '', `#${id}`);
    },
    buildProps(form) {
      // console.log(this.default[form.id]);
      return {
        ...form.props, init: this.default[form.id], title: form.title, subform_id: form.id,
      };
    },
  },
};
</script>

<style scoped>
  #create {
    height: 100vh;
  }
  #banner {
    padding-top: 5vh;
    padding-bottom: 5vh;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
