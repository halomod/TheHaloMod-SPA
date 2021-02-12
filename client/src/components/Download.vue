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
      <md-button class="md-icon-button download-button md-raised md-primary" @click="handleClick">
        <md-icon>download</md-icon>
      </md-button>
    </div>
  </md-toolbar>
</template>

<script>
import pdfSvgDownload from '@/utils/download.js';

const downloadChoiceObjs = {
  plotPdf: {
    clickAction(plotSvgElementId) {
      const svgHtmlString = document.getElementById(plotSvgElementId).outerHTML;
      pdfSvgDownload(svgHtmlString);
    },
    displayName: 'PDF of Plot',
    name: 'plotPdf',
  },
  ascii: {
    clickAction() {
      console.log('Download ascii');
    },
    displayName: 'ASCII',
    name: 'ascii',
  },
  paramVals: {
    clickAction() {
      console.log('Download param vals');
    },
    displayName: 'Parameter Values',
    name: 'paramVals',
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
    handleClick() {
      downloadChoiceObjs[this.downloadChoice].clickAction(this.plotSvgElementId);
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
</style>
