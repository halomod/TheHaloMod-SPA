<template>
  <div class="md-layout md-gutter md-alignment-top-space-around home">
    <div class="md-layout-item md-small-size-100">
      <Models
        :models="testModels"
      />
    </div>
    <div class="md-layout-item md-small-size-100 graph">
      <Graph/>
    </div>
  </div>
</template>

<script>
import Models from '@/components/Models';
import Graph from '../components/Graph.vue';

export default {
  name: 'Home',
  data() {
    return {
      testModels: {
        model1: {
          id: 'something',
          name: 'Test name. This is a really long name wheeeeeeeeee. Maybe a little longer',
        },
        model2: {
          id: 'lahweth',
          name: 'Test stuff',
        },
        model3: {
          id: '92179329h32',
          name: 'Test thing',
        },
      },
    };
  },
  components: {
    Models,
    Graph,
  },
};

</script>

<style scoped>
  .md-layout-item {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .graph {
    flex-grow: 2;
  }
  .home {
    margin-left: 16px;
    margin-right: 16px;
  }
</style>
