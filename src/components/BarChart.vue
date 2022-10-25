<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
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
      legend: {
        display: true,
      },
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
            var indexPorcentaje = tooltipItem.datasetIndex;
            var porcentaje = data.datasets[0].porcentaje[indexPorcentaje];

            label += "-";
            label += porcentaje;
            label += "%";
            return label;
          },
        },
      },
    },
  }),
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
