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
    options: {
      /* eslint-disable */
      handler() {
        this.$data._chart.destroy()
        this.renderChart(this.chartData, this.options)
      },
      deep: true,
    },
  },
};
</script>
