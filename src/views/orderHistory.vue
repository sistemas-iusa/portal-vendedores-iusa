<template>
  <v-container fluid>
    <!-- <h1>Historial de pedidos</h1> -->
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Buscar"
      single-line
      hide-details
    ></v-text-field>
    <v-divider></v-divider>
    <v-data-table
      dense
      :headers="headers"
      :items-per-page="20"
      :items="data"
      :search="search"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }" align="center">
        <v-icon
          large
          class="mr-2"
          @click="getInfo(item)"
          color="teal"
          style="font-size: 32px"
        >
          mdi-magnify
        </v-icon>
        <v-icon
          large
          class="mr-2"
          @click="getDealerEmail(item)"
          color="primary"
          style="font-size: 32px"
        >
          mdi-email
        </v-icon>
        <v-icon
          large
          class="mr-2"
          @click="confirmarPedido(item)"
          color="primary"
          style="font-size: 32px"
        >
          mdi-check-circle
        </v-icon>
        <!-- <router-link
              :to="{ name: 'Survey', params: { id: item.id } }"
              style="text-decoration: none"
            >
              <v-icon
                large
                class="mr-2"
                @click="getLocation(item)"
                style="color: #28a745"
              >
                mdi-sticker-check
              </v-icon>
            </router-link> -->
      </template>
    </v-data-table>

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
            <v-toolbar-title>{{ order_name }}</v-toolbar-title>
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order" :key="item.id">
                  <td>{{ item.codigo_material }}</td>
                  <td>{{ item.nombre_material }}</td>
                  <td>{{ item.unidades_confirmadas }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </template>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- /. Dialog -->
    <!-- Dialog -->
    <v-row justify="center">
      <v-dialog
        v-model="dialog2"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="indigo">
            <v-btn icon dark @click="dialog2 = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title> EMAIL</v-toolbar-title>
          </v-toolbar>
          <!-- <v-card-title>Title</v-card-title> -->
          <v-card-text>
            <v-row
              class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0 mb-lg-0"
            >
              <v-col cols="12">
                <v-text-field
                  label="CORREO ELECTRONICO"
                  required
                  v-model="email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" :disabled="!email" @click="sendOrder()"
                  >Enviar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- /. Dialog -->
    <!-- Dialog -->
    <v-row justify="center">
      <v-dialog
        v-model="dialog3"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="indigo">
            <v-btn icon dark @click="dialog3 = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title> CONFIRMAR PEDIDO</v-toolbar-title>
          </v-toolbar>
          <!-- <v-card-title>Title</v-card-title> -->
          <v-card-text>
            <v-row
              class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0 mb-lg-0"
            >
              <v-col>
                <v-file-input
                  v-model="evidencia"
                  label="Seleccione evidencia"
                  prepend-icon="mdi-file"
                  capture="camera"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="CONCLUSIONES"
                  required
                  v-model="concluciones"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  :disabled="!concluciones"
                  @click="sendEvidencia()"
                  >Guardar</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
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
    <!-- SnackBar -->
    <v-snackbar v-model="snackbar">
      {{ textAlert }}
      <v-btn color="pink" text @click="snackbar = false"> Cerrar </v-btn>
    </v-snackbar>
    <!-- /.SnackBar -->
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    orderId: null,
    order: null,
    send: null,
    email: null,
    data: [],
    search: "",
    headers: [
      { text: "FOLIO", align: "start", value: "folio" },
      { text: "FECHA", align: "start", value: "fecha" },
      { text: "PROSPECTO", sortable: false, value: "nombreUsuario" },
      {
        text: "VEND. IUSA / DIST. IUSA / DIST. EXT.",
        sortable: false,
        value: "nombreDistribuidor",
      },
      { text: "ORDEN COMPRA", sortable: false, value: "orden_compra" },
      { text: "ESTATUS", sortable: false, value: "estatus" },
      { text: "ACTIONS", value: "actions", sortable: false },
    ],
    dialog: false,
    dialog2: false,
    dialog3: false,
    loading: true,
    snackbar: false,
    textAlert: null,
    order_name: null,
    concluciones: null,
    infoOrden: null,
    evidencia: "",
  }),
  async mounted() {
    let self = this;
    self.getOrders();
  },
  methods: {
    async getOrders() {
      await axios
        .post("getOrders", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.data = response.data;
          console.log(this.data);
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async getInfo(item) {
      this.order = null;
      this.order_name = item.orden_compra;
      this.dialog = true;
      this.loading = true;
      await axios
        .post("getOrder", {
          id: item.id,
        })
        .then((response) => {
          this.order = response.data;
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async getDealerEmail(item) {
      this.dialog2 = true;
      this.orderId = item.id;
      this.email = null;
      this.loading = true;
      await axios
        .post("getDealerEmail", {
          id: item.idDistribuidor,
          tipo: item.tipoDistribuidor,
        })
        .then((response) => {
          this.email = response.data;
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async sendOrder() {
      this.loading = true;
      await axios
        .post("sendOrder", {
          orderId: this.orderId,
          email: this.email,
        })
        .then((response) => {
          this.send = response.data;
          this.snackbar = true;
          this.textAlert = "Correo enviado!";
          this.snackbarOut();
          this.dialog2 = false;
          this.getOrders();
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async confirmarPedido(item) {
      this.dialog3 = true;
      this.infoOrden = item;
    },
    async sendEvidencia() {
      let self = this;
      var file = new File([this.evidencia], this.infoOrden.folio + ".jpeg", {
        type: "'image/jpeg'",
      });
      var fd = new FormData();
      var foto = file;
      var orderId = this.infoOrden.id;
      var id_oportunidad = this.infoOrden.idUsuario;
      var orderFolio = this.infoOrden.folio;
      var concluciones = this.concluciones;

      fd.append("orderId", orderId);
      fd.append("id_oportunidad", id_oportunidad);
      fd.append("orderFolio", orderFolio);
      fd.append("concluciones", concluciones);
      fd.append("foto", foto);
      self.loading = true;
      await axios
        .post("sendEvidencia", fd)
        .then((response) => {
          this.dialog3 = false;
          this.concluciones = null;
          this.send = response.data;
          this.snackbar = true;
          this.textAlert = "Evidencia enviada";
          this.snackbarOut();
          self.getOrders();
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    snackbarOut() {
      setTimeout(function () {
        this.snackbar = false;
        this.textAlert = null;
      }, 5000);
    },
  },
};
</script>
