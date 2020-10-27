<template>
  <div id="app">
    <div id="nav">
      <Navbar/>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: white;
}
</style>

<script>
import Navbar from './components/Navbar.vue';

// CHANGE ME TO ACTUAL HOST LOCATION
fetch('http://localhost:5000/constants').then((data) => data.json()).then((json) => {
  console.log(json);
});

export default {
  components: {
    Navbar,
  },
};
</script>
