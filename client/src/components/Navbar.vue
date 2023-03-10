<template>
    <md-toolbar class="md-primary" md-elevation="1">
        <router-link to="/">
          <md-button class="title-button">
            <div class="combined-button">
              <md-avatar>
                <img class="logo" src="../assets/thm_logo.svg">
              </md-avatar>
              <h1 class="md-title">TheHaloMod</h1>
            </div>
          </md-button>
        </router-link>

        <div class="right-side">
          <md-button class="md-raised md-accent">
            <md-switch
             class='md-primary'
             v-model="usingHMFcalcMode"
             @change="switchHMFcalcMode"
            >
              <span style='color:white'>HMFcalc Mode</span>
            </md-switch>
          </md-button>

          <md-button
            href="https://github.com/halomod/TheHaloMod-SPA/issues/new"
            target="_blank"
          >
            <div class="combined-button">
              <md-icon class="svg-icon" :md-src="require('../assets/github-icon.svg')" />
              <span>Report Issue</span>
            </div>
          </md-button>
          <router-link to="/acknowledge">
            <md-button class="md-primary">Acknowledge</md-button>
          </router-link>
          <router-link to="/about">
            <md-tooltip>Using:
              hmf v{{hmfVersion}} &
              halomod v{{halomodVersion}}
            </md-tooltip>
            <md-button class="md-primary">About</md-button>
          </router-link>
          <md-button class="md-icon-button" @click="switchTheme">
            <md-tooltip>{{themeTooltipText}}</md-tooltip>
            <md-icon>{{themeIconName}}</md-icon>
          </md-button>

        </div>
      </md-toolbar>
</template>

<script>
import { DEFAULT_THEME, DARK_THEME } from '@/constants/themeOptions';
import libraryVersions from '@/../generated/library_versions';

/**
 * Holds the primary nav bar for the application.
 */
export default {
  name: 'Navbar',
  data() {
    return {
      currentTheme: this.$store.state.theme,
      usingHMFcalcMode: this.$store.state.hmfcalcMode,
      hmfVersion: libraryVersions.hmf,
      halomodVersion: libraryVersions.halomod,
    };
  },
  methods: {
    switchTheme() {
      if (this.currentTheme === DEFAULT_THEME) {
        this.currentTheme = DARK_THEME;
        this.$store.setTheme(DARK_THEME, this);
      } else {
        this.currentTheme = DEFAULT_THEME;
        this.$store.setTheme(DEFAULT_THEME, this);
      }
    },
    switchHMFcalcMode() {
      console.log('Switching HMFcalc Mode...');
      this.$store.setHMFcalcMode(this.usingHMFcalcMode);
      console.log('Set it to ', this.$store.state.hmfcalcMode);
    },
  },
  computed: {
    themeIconName() {
      if (this.currentTheme === DARK_THEME) {
        return 'light_mode';
      }
      return 'dark_mode';
    },
    themeTooltipText() {
      if (this.currentTheme === DARK_THEME) {
        return 'Switch to Light Mode';
      }
      return 'Switch to Dark Mode';
    },
  },
};
</script>

<style scoped>
  .title-button {
    height: auto;
    /* Ignores the uppercase transform of the button */
    text-transform: none;
  }
  .logo {
    margin: 0;
  }
  .svg-icon {
    margin-right: 8px;
  }
  .right-side {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .combined-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .md-toolbar {
    position: 'fixed';
    z-index: 9;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
