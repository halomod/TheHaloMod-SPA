<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  name: 'Chart',
  mixins: [reactiveProp],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'right',
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        yAxes: [{
          type: 'logarithmic',
          ticks: {
            beginAtZero: false,
          },
        }],
        xAxes: [{
          type: 'logarithmic',
          ticks: {
            beginAtZero: false,
          },
        }],
      },
    },
  }),
  props: {
    scale: {
      type: String,
      default: 'logarithmic',
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
