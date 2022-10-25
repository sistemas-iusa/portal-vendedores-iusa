<template>
  <v-container fluid>
    <!-- <h1>Opportunities page</h1> -->
    <template>
      <v-card cols="12" class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0">
        <v-card-title>HISTORIAL PEDIDO</v-card-title>
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
              @change="getPedidoHistory"
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
          <template v-slot:item.pedido="{ item }">
            <a @click="detallePedido(item)">
              {{ item.pedido }}
            </a>
          </template>
        </v-data-table>
      </v-card>
      <!-- Dialog -->
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="indigo">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Pedido: {{ pedidoSelect }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <p></p>
            <template>
              <v-simple-table dense>
                <thead>
                  <tr>
                    <th class="text-left">CODIGO</th>
                    <th class="text-left">DESCRIPCION</th>
                    <th class="text-left">UNIDADES</th>
                    <th class="text-left">VENTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in pedidoInfo" :key="item.id">
                    <td>{{ item.MATERIAL }}</td>
                    <td>{{ item.SHORT_TEXT }}</td>
                    <td>{{ item.REQ_QTY }}</td>
                    <td>{{ item.NETVA }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align: right">
                      <b>Importe</b>
                    </td>
                    <td style="background-color: #3bafda">
                      <b>$ {{ pedidoImporte }}</b>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </template>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
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
<script>
import axios from "axios";
export default {
  data: () => ({
    data: [],
    dialog: false,
    search: "",
    headers: [
      { text: "Fecha", align: "start", value: "fecha" },
      { text: "Consec", align: "start", value: "consec" },
      { text: "Orden de compra", value: "orden" },
      { text: "Pedido", sortable: false, value: "pedido" },
      { text: "Entrega", sortable: false, value: "entrega" },
      { text: "Factura", sortable: false, value: "factura" },
      { text: "Estatus", sortable: false, value: "estatus" },
      { text: "Motivo", sortable: false, value: "accion" },
      { text: "Accion", sortable: false, value: "motivo1" },
    ],
    loading: false,
    cliente_zona: null,
    cliente_zona_array: [],
    pedidoSelect: null,
    pedidoInfo: null,
    pedidoImporte: null,
  }),
  async mounted() {
    let self = this;
    self.getCustomers();
  },
  methods: {
    async getPedidoHistory() {
      this.loading = true;
      await axios
        .post("getPedidoHistory", {
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
          this.cliente_zona_array.push({
                  KTOKD:"CPD",
                  KUNNR:"0000002674",
                  NAME1:"CLIENTE DESARROLLO MINORISTA",
                  VKBUR:"IU44"
                })
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
    detallePedido(item) {
      this.pedidoSelect = item.pedido;
      this.dialog = true;
      this.loading = true;
      axios
        .post("getInfoPedido", {
          id_pedido: item.pedido,
          cliente: this.cliente_zona.KUNNR,
        })
        .then((response) => {
          this.loading = false;
          this.pedidoInfo = response.data.prueba_Pedido;
          this.pedidoImporte = response.data.importe;
          this.pedidoInfo.pop();
        })
        .catch((error) => {
          this.loading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
