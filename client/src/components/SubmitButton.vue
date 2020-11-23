<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-content style="width: 1028px; height: 750px">
        <img v-if="image !== null" :src="image" style="width: 100%; margin: auto"/>
        <div v-else
          style="display: grid; height: 100%">
          <md-progress-spinner
            :md-diameter="100"
            :md-stroke="10"
            md-mode="indeterminate"
            style="margin: auto;"/>
        </div>
      </md-content>
    </md-dialog>
    <md-button
      v-if="!showDialog"
      style="position: fixed; bottom: 15px; right: 15px; z-index: 10;"
      class="md-primary md-raised"
      @click="createObject">
      Calculate
    </md-button>
  </div>
</template>

<script>
// import baseurl from '@/env';

export default {
  name: 'SubmitButton',
  props: ['model', 'meta'],
  data() {
    return {
      showDialog: false,
      image: null,
    };
  },
  computed: {
    payload() {
      let dict = {};
      /* eslint-disable */
      for (const [key, value] of Object.entries(this.model)) {
        dict = { ...dict, ...value };
      }
      /* eslint-enable */
      return dict;
    },
  },
  methods: {
    async createObject() {
      this.image = null;
      this.showDialog = true;
      await this.$http.createObject(this.model, this.meta.model_name);
      // should redirect to home. Image should be requested when at home component
      this.image = await this.$http.getPlot(this.meta.fig_type);
    },
  },
};
</script>
