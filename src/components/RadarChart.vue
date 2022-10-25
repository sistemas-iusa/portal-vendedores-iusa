<script>
import { Radar } from "vue-chartjs";

export default {
  extends: Radar,
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
    },
  }),
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
