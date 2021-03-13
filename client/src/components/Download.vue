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
import baseUrl from '@/env';
import axios from 'axios';

const downloadChoiceObjs = {
  PlotImage: {
    displayName: 'Image of Plot',
    name: 'PlotImage',
    downloadName: 'PlotImage',
    loadingTitle: 'Creating plot image...',
  },
  Ascii: {
    displayName: 'ASCII',
    name: 'Ascii',
    downloadName: 'AllData.zip',
    loadingTitle: 'Retrieving ASCII data...',
  },
  ParamVals: {
    displayName: 'Parameter Values',
    name: 'ParamVals',
    downloadName: 'ParameterValues.json',
    loadingTitle: 'Loading parameter values...',
  },
  Data: {
    displayName: 'Vector Data',
    name: 'Data',
    downloadName: 'ModelVectorData.json',
    loadingTitle: 'Getting key vectors for all models',
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
      downloadChoices: Object.values(downloadChoiceObjs),
      downloadChoice: Object.values(downloadChoiceObjs)[0].name,
      loading: false,
      loadingTitle: '',
      asciiDialogVisible: false,
    };
  },
  methods: {
    async handleClick() {
      console.log('happening');
      console.log('here');
      const downloadNode = document.getElementById('download-element');
      console.log('here');
      const { downloadName, name, loadingTitle } = downloadChoiceObjs[this.downloadChoice];
      console.log('here');
      this.loadingTitle = loadingTitle;
      this.loading = true;
      console.log('here');
      const href = await this[`download${name}`]();
      downloadNode.setAttribute('href', href);
      downloadNode.setAttribute('download', downloadName);
      downloadNode.click();
      console.log('happening');
      this.loading = false;
    },
    async downloadData() {
      const result = await axios.post(`${baseUrl}/get_object_data`, {
        param_names: ['m', 'k', 'r', 'k_hm'],
      });
      return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result.data, null, 2))}`;
    },
    async downloadPlotImage() {
      await this.$store.createPlot();
      return this.$store.state.plot;
    },
    async downloadAscii() {
      this.asciiDialogVisible = true;
      return `${baseUrl}/ascii`;
    },
    async downloadParamVals() {
      const modelsJsonString = JSON.stringify(await this.$store.getAllModels(), null, 2);
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(modelsJsonString)}`;
      return dataStr;
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
