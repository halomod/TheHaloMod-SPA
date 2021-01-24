<script>
import { Line, mixins } from 'vue-chartjs';

export default {
  extends: Line,
  name: 'Chart',
  mixins: [mixins.reactiveProp],
  props: {
    options: Object,
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: () => {
      /* eslint-disable */
      this.$data._chart.options = this.options;
      this.$data._chart.destroy();
      this.$data._chart.renderChart(this.chart, this.options);
    },
  },
};
</script>
