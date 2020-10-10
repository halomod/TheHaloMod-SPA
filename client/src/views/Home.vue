<template>
  <div class="home">
    <SiteTitle/>
  </div>
</template>

<script>
// @ is an alias to /src
import SiteTitle from '@/components/SiteTitle.vue';

export default {
  name: 'Home',
  components: {
    SiteTitle,
  },
};
</script>
