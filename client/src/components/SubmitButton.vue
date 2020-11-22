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
import baseurl from '@/env';

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
      const params = this.payload;
      /* creates model on server */
      try {
        await this.$http.post(`${baseurl}/create`, {
          params: { ...params },
          label: this.meta.model_name,
        });
        /* saves serialized object locally */
        this.getFigure();
      } catch (e) {
        console.error(e);
      }
    },
    async getFigure() {
      this.image = null;
      this.showDialog = true;
      /* gets figure from server */
      try {
        const { data } = await this.$http.post(`${baseurl}/plot`, {
          fig_type: this.meta.fig_type,
          img_type: 'png',
        });
        /* saves image src as string */
        this.image = `data:image/png;base64,${data.figure}`;
        await this.$db.put(this.meta.model_name, {
          name: this.meta.model_name,
          image: `data:image/png;base64,${data.figure}`,
          model: this.model,
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
