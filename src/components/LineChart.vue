<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      height: 300,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = tooltipItem.yLabel;
            var indexPorcentaje = tooltipItem.index;
            var porcentaje = data.datasets[0].porcentaje[indexPorcentaje];

            label += "-";
            label += porcentaje;
            label += "%";
            return label;
          },
        },
      },
      legend: {
        display: true,
      },
    },
  }),
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
