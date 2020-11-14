<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-content style="width: 1028px; height: 750px">
        <img v-if="image !== null" :src="image" style="width: 100%; margin: auto"/>
        <div v-else
          style="display: flex; justify-content: center; height: 100%; align-tems: center;">
        <md-progress-spinner
          :md-diameter="100"
          :md-stroke="10"
          md-mode="indeterminate"
          style="margin: 24px;"/>
        </div>
      </md-content>
    </md-dialog>
    <md-button class="md-primary md-raised" @click="createObject">
      Calculate
    </md-button>
  </div>
</template>

<script>
import baseurl from '../env';

export default {
  name: 'SubmitButton',
  props: ['model'],
  data() {
    return {
      showDialog: false,
      object: null,
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
      console.log(dict);
      return dict;
    },
  },
  methods: {
    createObject() {
      const params = this.payload;
      this.$http.post(`${baseurl}/create`, {
        params: { ...params },
        label: 'New Model',
      }).then((response) => {
        this.object = response.data['New Model'];
        this.getFigure();
      });
    },
    getFigure() {
      this.image = null;
      this.showDialog = true;
      this.$http.post(`${baseurl}/plot`, {
        fig_type: 'dndm',
        image_type: 'png',
        models: { 'New Model': this.object },
      }).then((response) => {
        this.image = `data:image/png;base64,${response.data.figure}`;
      });
    },
  },
};
</script>
