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
import JSZip from 'jszip';

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
    downloadName: 'ModelVectorData.zip',
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
      const downloadNode = document.getElementById('download-element');
      const { downloadName, name, loadingTitle } = downloadChoiceObjs[this.downloadChoice];
      this.loadingTitle = loadingTitle;
      this.loading = true;
      const href = await this[`download${name}`]();
      downloadNode.setAttribute('href', href);
      downloadNode.setAttribute('download', downloadName);
      downloadNode.click();
      this.loading = false;
    },
    async downloadData() {
      const result = await axios.post(`${baseUrl}/get_object_data`, {
        param_names: ['m', 'k', 'r', 'k_hm'],
      });
      const json = result.data;
      const zip = new JSZip();
      Object.entries(json).forEach(([name, parameters]) => {
        Object.entries(parameters).forEach(([parameter, data]) => {
          const { vector } = data;
          const vectorString = vector.join('\n');
          const csv = `${vectorString}`;
          zip.file(`${name}${parameter}vector.txt`, csv);
        });
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      return window.URL.createObjectURL(blob);
    },
    async download_plotImage() {
      const svgNode = document.getElementById('svg-plot');
      const serializer = new XMLSerializer();
      let plotString = serializer.serializeToString(svgNode);
      if (!plotString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        plotString = plotString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!plotString.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        plotString = plotString.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      plotString = `<?xml version="1.0" standalone="no"?>\r\n${plotString}`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(plotString)}`;
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
