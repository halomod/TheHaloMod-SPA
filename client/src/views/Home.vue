<template>
  <div>
    <Navbar />
    <div class="md-gutter md-alignment-top-space-around home">
      <div class="models">
        <Models />
      </div>
      <div class="graph">
        <Graph />
      </div>
      <div class="download">
        <Download />
      </div>
    </div>
    <md-dialog
      :md-active.sync="syncDialogVisible"
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
    >
      <md-dialog-title>Models Syncing</md-dialog-title>
      <md-dialog-content
      >
        Your models are currently syncing to the server. This shouldn't
        take too long...
        <md-progress-bar md-mode="indeterminate"
        /></md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
import Models from '@/components/Models';
import Graph from '@/components/Graph';
import Navbar from '@/components/Navbar';
import Download from '@/components/Download';

/**
 * Represents the view for the main page of the application. This is where
 * most of the functionality related to the plot and the models are held.
 */
export default {
  name: 'Home',
  components: {
    Models,
    Graph,
    Navbar,
    Download,
  },
  data() {
    return {
      syncDialogVisible: false,
    };
  },
  created() {
    // Trigger a loading dialog if the models are syncing on startup
    const isSyncing = this.$store.setSyncCallbacks(() => {
      // Turn on the sync dialog if syncing starts
      this.syncDialogVisible = true;
    }, () => {
      // Turn off the sync dialog when the syncing is finished
      this.syncDialogVisible = false;
    });
    if (isSyncing) {
      this.syncDialogVisible = true;
    }
  },
};

</script>

<style lang="scss">
  @import "./theme";
</style>
<style scoped>
  .home {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: auto;
    grid-template-areas:
      "models graph"
      "download graph"
      ". graph";
    column-gap: 16px;
    row-gap: 16px;
    margin: 16px;
    padding-bottom: 16px;
  }
  /* 959px is the same as md-small in vue material */
  @media (max-width: 959px) {
    .home {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "models"
        "graph"
        "download";
      row-gap: 16px;
      margin: 16px;
    }
  }
  .graph {
    grid-area: graph;
  }
  .models {
    grid-area: models;
  }
  .download {
    grid-area: download;
  }
</style>
