<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
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
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[0].data[tooltipItem.index];
            var indexPorcentaje = tooltipItem.index;
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
