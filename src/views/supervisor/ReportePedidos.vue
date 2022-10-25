<template>
  <v-container fluid>
    <template>
      <v-row>
        <v-card flat>
          <v-card-text>
            <v-row>
              <h3>Reporte Pedidos Sugerido Promotor</h3>
            </v-row>
            <br />
            <v-row>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  dense
                  filled
                  label="Promotor"
                  :items="promotores"
                  item-text="name"
                  item-value="id"
                  v-model="promotorSelect"
                  style="margin-bottom: -27px"
                  v-if="promotores"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn @click="getOC()">Buscar</v-btn>
              </v-col>
            </v-row>
            <v-row v-if="ordenList.length != 0">
              <v-col cols="12" sm="12">
                <v-card>
                  <v-card-title> Pedidos Sugeridos Realizados </v-card-title>
                  <v-divider></v-divider>
                  <v-btn color="#319807" @click="exportarExcel1()"
                    ><v-icon>mdi-file-excel</v-icon>Exportar</v-btn
                  >
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-data-table
                    id="tabla-1"
                    dense
                    :headers="headers"
                    :items-per-page="20"
                    :items="ordenList"
                    :search="search"
                    item-key="id"
                    class="elevation-1"
                  >
                    <template v-slot:[`item.actions`]="{ item }" align="center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            large
                            class="mr-2"
                            @click="getInfo(item)"
                            color="teal"
                            style="font-size: 32px"
                          >
                            mdi-magnify
                          </v-icon>
                        </template>
                        <span>Ver Detalle</span>
                      </v-tooltip>
                    </template>

                    <template
                      v-slot:[`item.evidencia`]="{ item }"
                      align="center"
                    >
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <a
                            target="_blank"
                            v-bind:href="$hostImage + item.evidencia"
                          >
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                              large
                              class="mr-2"
                              style="color: #ec7105"
                              v-if="item.evidencia"
                            >
                              mdi-download
                            </v-icon>
                          </a>
                        </template>
                        <span>Descargar Evidencia</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-row>

      <!-- Dialog Detalle-->
      <v-row justify="center">
        <v-dialog
          v-model="dialogDetalle"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="indigo">
              <v-btn icon dark @click="dialogDetalle = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ order_name }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <p></p>
            <v-btn color="#319807" @click="exportarExcel2()"
              ><v-icon>mdi-file-excel</v-icon>Exportar</v-btn
            >
            <template>
              <v-simple-table dense id="tabla-2">
                <thead>
                  <tr>
                    <th class="text-left">FOLIO</th>
                    <th class="text-left">{{ order_name }}</th>
                    <th class="text-left"></th>
                  </tr>
                  <tr>
                    <th class="text-left">Prospecto</th>
                    <th class="text-left">{{ order_select.nombreUsuario }}</th>
                    <th class="text-left"></th>
                  </tr>
                  <tr>
                    <th class="text-left">Distribuidor</th>
                    <th class="text-left">
                      {{ order_select.idDistribuidor }}
                      {{ order_select.nombreDistribuidor }}
                    </th>
                    <th class="text-left"></th>
                  </tr>
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
      <!-- /. Dialog Detalle-->

      <!-- Dialog loading -->
      <v-row justify="center">
        <v-dialog v-model="dialogLoading" hide-overlay persistent width="300">
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
const $ = require("jquery");
window.jquery = $;
export default {
  data: () => ({
    dialogLoading: false,
    data: [],
    search: "",
    promotores: [],
    promotorSelect: "",
    ordenList: [],
    headers: [
      { text: "FOLIO", align: "start", value: "folio" },
      { text: "FECHA", align: "start", value: "fecha" },
      { text: "HORA", align: "start", value: "hora" },
      { text: "PROSPECTO", value: "nombreUsuario" },
      {
        text: "VEND. IUSA / DIST. IUSA / DIST. EXT.",
        value: "nombreDistribuidor",
      },
      { text: "ORDEN COMPRA", value: "orden_compra" },
      { text: "ESTATUS", value: "estatus" },
      { text: "DETALLE", value: "actions" },
      { text: "EVIDENCIA", value: "evidencia" },
      { text: "CONCLUSIONES", value: "concluciones" },
    ],
    order_name: null,
    order_select: {},
    order: [],
    dialogDetalle: false,
  }),
  async mounted() {
    let self = this;
    self.getPromotores();
  },
  methods: {
    async getPromotores() {
      let me = this;
      me.dialogLoading = true;
      await axios
        .post("./getPromotores", {
          id: "1",
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.promotores = response.data;
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    getOC() {
      this.dialogLoading = true;
      axios
        .post("getOrders", {
          id: this.promotorSelect,
        })
        .then((response) => {
          this.ordenList = response.data;
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    async getInfo(item) {
      this.order = null;
      this.order_select = null;
      this.order_name = item.folio;
      this.order_select = item;
      this.dialogDetalle = true;
      this.dialogLoading = true;
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
        .finally(() => (this.dialogLoading = false));
    },
    exportarExcel1() {
      window.open(
        "data:application/vnd.ms-excel," + escape($("#tabla-1").html())
      );
    },
    exportarExcel2() {
      window.open(
        "data:application/vnd.ms-excel," + escape($("#tabla-2").html())
      );
    },
  },
};
</script>
