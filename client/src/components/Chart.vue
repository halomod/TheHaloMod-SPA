<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  name: 'Chart',
  mixins: [reactiveProp],
  data: () => ({
    sample: {
      datasets: [
        {
          label: 'Tias Data',
          data: [
            {
              x: 1,
              y: 186742769.27833816,
            },
            {
              x: 26302679.918953814,
              y: 0.0000020952114019357093,
            },
            {
              x: 60255958.60743581,
              y: 4.2425385415859126e-7,
            },
          ],
        },
      ],
    },
    options: {
      responsive: true,
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
