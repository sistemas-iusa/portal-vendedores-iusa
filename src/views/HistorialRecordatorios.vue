<template>
  <v-container fluid>
    <!-- <h1>Opportunities page</h1> -->
    <template>
      <v-card cols="12" class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0">
        <v-card-title>HISTORIAL RECORDATORIOS</v-card-title>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="cliente_zona"
              :items="cliente_zona_array"
              :item-text="getItemTextZona"
              return-object
              dense
              filled
              rounded
              label="Buscar cliente"
              class="mt-xs-4 mt-md-4 mt-lg-4"
              @change="getRecordatoriosHistory"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-data-table
          dense
          :headers="headers"
          :items-per-page="10"
          :items="data"
          :search="search"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.seleccionado="{ item }">
            <v-simple-checkbox
              v-model="item.seleccionado"
              v-if="
                item.band_programado == 0 &&
                item.bandera_kits == 0 &&
                item.filas_resumen != 'blanco'
              "
            ></v-simple-checkbox>
          </template>

          <template
            v-slot:item.cantidad_pedida="{ item }"
            :class="item.filas_resumen"
          >
            <span :class="item.filas_resumen">
              {{ item.cantidad_pedida }}
            </span>
          </template>
        </v-data-table>
      </v-card>
      <!-- Dialog loading -->
      <v-row justify="center">
        <v-dialog v-model="loading" hide-overlay persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Cargando
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
    </template>
  </v-container>
</template>
<style>
.naranja {
  background-color: orangered;
  color: white;
}
.Verde {
  background-color: green;
  color: white;
}
</style>
<script>
import axios from "axios";
export default {
  data: () => ({
    data: [],
    dialog: false,
    search: "",
    headers: [
      { text: "", align: "start", value: "seleccionado" },
      { text: "Id", align: "start", value: "id" },
      { text: "Orden de compra", align: "start", value: "orden_compra" },
      { text: "Fecha Programado", sortable: false, value: "fecha_programado" },
      { text: "Código", sortable: false, value: "codigo" },
      { text: "Nombre", sortable: false, value: "nombre" },
      { text: "Medida", sortable: false, value: "medida" },
      { text: "Empaque", sortable: false, value: "empaque" },
      { text: "Unidades", sortable: false, value: "cantidad_pedida" },
    ],
    loading: false,
    cliente_zona: null,
    cliente_zona_array: [],
  }),
  async mounted() {
    let self = this;
    self.getCustomers();
  },
  methods: {
    async getRecordatoriosHistory() {
      this.loading = true;
      await axios
        .post("getRecordatoriosHistory", {
          vendedor: localStorage.getItem("employee_number"),
          puesto: localStorage.getItem("employee_type"),
          idCliente: this.cliente_zona.KUNNR,
        })
        .then((response) => {
          this.data = response.data;
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async getCustomers() {
      this.loading = true;
      await axios
        .post("getCustomers", {
          usuario: localStorage.getItem("employee_number"),
          tipo: localStorage.getItem("employee_type"),
        })
        .then((response) => {
          this.loading = false;
          this.cliente_zona_array = response.data;
          this.cliente_zona_array.pop();
        })
        .catch((error) => {
          this.loading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    getItemTextZona(item) {
      return `${item.KUNNR} ${item.NAME1}  ${item.VKBUR}`;
    },
  },
};
</script>
