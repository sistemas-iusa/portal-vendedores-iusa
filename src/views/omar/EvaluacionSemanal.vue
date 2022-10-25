<style type="text/css">
#global {
  height: 300px;
  border: 1px solid #ddd;
  background: #f1f1f1;
  overflow-y: scroll;
}
#mensajes {
  height: auto;
}
.texto {
  padding: 4px;
  background: #fff;
}
</style>
<template>
  <main>
    <div class="container-fluid px-4">
      <div class="row">
        <div class="col-xl-6">
          <h3 class="mt-4"></h3>
          <ol class="breadcrumb mb-4">
            <li class="breadcrumb-item">EVALUACIÓN SEMANAL</li>
            <li class="breadcrumb-item active">HOME OFFICE</li>
          </ol>
        </div>
        <div class="col-xl-6">
          <br />
          <div class="form-group">
            <select class="form-control">
              <option>Semana 1 / 2 OCT 21 - 9 OCT 21</option>
              <option>Semana 2 / 2 OCT 21 - 9 OCT 21</option>
              <option>Semana 3 / 2 OCT 21 - 9 OCT 21</option>
              <option selected>Semana 4</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xl-6">
          <div class="card mb-4">
            <div class="card-header">
              <i class="fas fa-chart-bar"></i>
              GRÁFICA RENDIMIENTO PERSONAL
            </div>
            <div class="card-body">
              <div v-for="(item, index) in user_chart" :key="item.id">
                <bar-chart
                  :chartdata="user_chart[index]"
                  :options="user_options[index]"
                ></bar-chart>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-6">
          <div class="card mb-4">
            <div class="card-header">
              <i class="fas fa-chart-bar"></i>
              GRÁFICA RENDIMIENTO POR ÁREA
              <div id="global">
                <div
                  id="mensajes"
                  v-for="(item, index) in charts_array"
                  :key="item.id"
                  style="height: 400px"
                >
                  <bar-chart
                    :chartdata="charts_array[index]"
                    :options="options_array[index]"
                  ></bar-chart>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div id="chart_div-2" class="graphPanel"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import BarChart from "@/components/BarChart2.vue";
export default {
  components: {
    BarChart,
  },
  data() {
    return {
      charts_array: [],
      options_array: [],
      user_chart: [],
      user_options: [],
      user: [
        {
          Usuario: "JOSE ANGEL ARREGUIN GOMEZ",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
      ],
      week: [
        {
          Director: "ALEJO PERALTA",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "ANDRES TORT RIVERA",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "ARMANDO ORTIZ RAMIREZ",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "BENJAMIN PEREZ LIZARRAGA",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "CARLOS MOCHON SACAL",
          Desempeño: "90",
          Disponibilidad: "90",
          Colaboracion: "90",
        },
        {
          Director: "EDGAR ANGELES GODINEZ",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "EDUARDO NERI",
          Desempeño: 0,
          Disponibilidad: 0,
          Colaboracion: 0,
        },
        {
          Director: "FEDERICO KRAFFT",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "FERNANDO HEREDIA CARRANCO",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "FRANCISCO RODRIGUEZ AVENDANO",
          Desempeño: "96",
          Disponibilidad: "96",
          Colaboracion: "96",
        },
        {
          Director: "IGMAR IRIGOYEN FALCON",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "JORGE MADRIGAL KIM ",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "JOSE OLIVERA",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
        {
          Director: "MIGUEL TAPIA BENITEZ",
          Desempeño: "100",
          Disponibilidad: "100",
          Colaboracion: "100",
        },
      ],
    };
  },
  async mounted() {
    let self = this;
    self.printCharts();
  },
  methods: {
    printCharts() {
      let self = this;
      for (let index = 0; index < self.week.length; index++) {
        const element = self.week[index];
        const chartdata = {
          labels: ["Desempeño", "Disponibilidad", "Colaboracion"],
          datasets: [
            {
              label: "Desempeño",
              backgroundColor: ["#9dbd1c"],
              data: [element.Desempeño],
            },
            {
              label: "Disponibilidad",
              backgroundColor: ["#26bd1c"],
              data: [element.Disponibilidad],
            },
            {
              label: "Colaboracion",
              backgroundColor: ["#ab1405"],
              data: [element.Colaboracion],
            },
          ],
        };
        const options = {
          title: {
            display: true,
            text: element.Director,
            fontSize: 16,
          },
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
        };
        self.charts_array.push(chartdata);
        self.options_array.push(options);
      } //for end
      //user
      const user1 = {
        labels: ["Desempeño", "Disponibilidad", "Colaboracion"],
        datasets: [
          {
            label: "Desempeño",
            backgroundColor: ["#9dbd1c"],
            data: [self.user[0].Desempeño],
          },
          {
            label: "Disponibilidad",
            backgroundColor: ["#26bd1c"],
            data: [self.user[0].Disponibilidad],
          },
          {
            label: "Colaboracion",
            backgroundColor: ["#ab1405"],
            data: [self.user[0].Colaboracion],
          },
        ],
      };
      const user2 = {
        title: {
          display: true,
          text: self.user[0].Usuario,
          fontSize: 16,
        },
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
      };
      self.user_chart.push(user1);
      self.user_options.push(user2);
    },
  },
};
</script>

<style></style>
