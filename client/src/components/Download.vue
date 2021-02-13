<template>
  <md-toolbar class="md-large">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">Download</h3>
      </div>
    </div>
    <div class="download-container">
      <md-field class='download-select'>
        <md-select v-model="downloadChoice" id="downloadChoices">
          <md-option
            v-for="choice in downloadChoices"
            :key="choice.name"
            :value="choice.name"
          >
            {{choice.displayName}}
          </md-option>
        </md-select>
      </md-field>
      <md-button
        class="md-icon-button download-button md-raised md-primary"
        @click="handleClick"
      >
        <md-icon>download</md-icon>
      </md-button>
    </div>
    <a id="download-element"/>
  </md-toolbar>
</template>

<script>

const downloadChoiceObjs = {
  plotImage: {
    displayName: 'Image of Plot',
    name: 'plotImage',
    downloadName: 'plotImage',
  },
  ascii: {
    displayName: 'ASCII',
    name: 'ascii',
    downloadName: 'asciiThings',
  },
  paramVals: {
    displayName: 'Parameter Values',
    name: 'paramVals',
    downloadName: 'paramVals',
  },
};
export default {
  name: 'Download',
  props: {
    plotSvgElementId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      downloadChoices: Object.values(downloadChoiceObjs),
      downloadChoice: Object.values(downloadChoiceObjs)[0].name,
    };
  },
  methods: {
    async handleClick() {
      const downloadNode = document.getElementById('download-element');
      const { downloadName, name } = downloadChoiceObjs[this.downloadChoice];
      const href = await this[`download_${name}`]();
      downloadNode.setAttribute('href', href);
      downloadNode.setAttribute('download', downloadName);
      downloadNode.click();
    },
    async download_plotImage() {
      await this.$store.createPlot();
      return this.$store.state.plot;
    },
    async download_ascii() {
      console.log('Download ascii');
      return '';
    },
    async download_paramVals() {
      console.log('Download param vals');
      return '';
    },
  },
};
</script>

<style>
.download-container {
  margin-bottom: 16px;
  padding: 0 8px;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.download-button {
  margin-left: 16px;
}
#download-element {
  display: none;
}
</style>
