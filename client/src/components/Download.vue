<template>
  <div>
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
        id="download-button"
      >
        <md-icon>download</md-icon>
      </md-button>
    </div>
    <a id="download-element"/>
  </md-toolbar>
  <md-dialog v-if="loading"
    :md-active.sync="loading"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false">
    <md-dialog-title>{{loadingTitle}}</md-dialog-title>
    <md-dialog-content><md-progress-bar md-mode="indeterminate"/></md-dialog-content>
  </md-dialog>
  <md-dialog v-if="asciiDialogVisible"
    :md-active.sync="asciiDialogVisible">
    <md-dialog-title>ASCII data will download soon...</md-dialog-title>
    <md-button @click="asciiDialogVisible = false">Close</md-button>
  </md-dialog>
  </div>
</template>

<script>
import {
  downloadData,
  downloadPlotImage,
  downloadParamVals,
} from '@/utils/downloads.js';

const downloadOptions = {
  PlotImage: {
    name: 'PlotImage',
    displayName: 'Image of Plot',
    fileName: 'PlotImage.svg',
    loadingTitle: 'Creating plot image...',
  },
  ParamVals: {
    name: 'ParamVals',
    displayName: 'Parameter Values',
    fileName: 'ParameterValues.json',
    loadingTitle: 'Loading parameter values...',
  },
  Data: {
    name: 'Data',
    displayName: 'Vector Data',
    fileName: 'ModelVectorData.zip',
    loadingTitle: 'Getting all model data',
  },
};

/**
 * Represents the component which can be used to download things such as the
 * plot, model data, and parameter values.
 */
export default {
  name: 'Download',
  data() {
    return {
      downloadChoices: Object.values(downloadOptions),
      downloadChoice: Object.values(downloadOptions)[0].name,
      loading: false,
      loadingTitle: '',
      asciiDialogVisible: false,
    };
  },
  methods: {
    downloadData,
    downloadPlotImage,
    downloadParamVals,
    async handleClick() {
      const downloadNode = document.getElementById('download-element');
      const { fileName, name, loadingTitle } = downloadOptions[this.downloadChoice];
      this.loadingTitle = loadingTitle;
      this.loading = true;
      const href = await this[`download${name}`](this.$store);
      downloadNode.setAttribute('href', href);
      downloadNode.setAttribute('download', fileName);
      downloadNode.click();
      this.loading = false;
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
