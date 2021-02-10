<template>
  <md-toolbar class="md-large">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">Download</h3>
      </div>
      <md-content>
        <md-field>
        <md-select v-model="downloadChoice" id="downloadChoices">
          <md-option
            v-for="choice in downloadChoices"
            :key="choice"
            :value="choice"
          >
            {{choice}}
          </md-option>
        </md-select>
      </md-field>
      </md-content>
    </div>
  </md-toolbar>
</template>

<script>
const downloadChoices = [
  'PDF Thang',
  'ASCII',
  'Other stuff',
];
export default {
  name: 'Download',
  data() {
    return {
      downloadChoices,
      downloadChoice: downloadChoices[0],
    };
  },
};
</script>

<style>

</style>
