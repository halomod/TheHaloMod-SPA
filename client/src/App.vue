<template>
  <div id="app">
    <div id="nav">
      <md-toolbar class="md-primary" md-elevation="1">
        <md-avatar>
          <img src="./assets/thm_logo.png">
        </md-avatar>
        <h3 class="md-title" style="flex: 1">The Halo Mod</h3>
        <md-button> <router-link to="/">Home</router-link></md-button>
        <md-button class="md-primary"><router-link to="/about">About</router-link></md-button>
      </md-toolbar>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: white;
}
</style>
