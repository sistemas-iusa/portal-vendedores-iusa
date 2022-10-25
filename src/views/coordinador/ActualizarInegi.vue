<template>
  <v-container fluid>
    <template>
      <v-row>
        <v-col cols="12" sm="4">
          <v-autocomplete
            dense
            filled
            label="ENTIDAD"
            :items="entidades"
            item-text="nombre"
            item-value="clave"
            v-model="entidadSelect"
            @change="getMunicipio()"
            style="margin-bottom: -27px"
            v-if="entidades"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="4">
          <v-autocomplete
            filled
            dense
            label="MUNICIPIO"
            :items="municipios"
            item-text="nombre"
            item-value="clave_municipio"
            v-model="municipioSelect"
            style="margin-bottom: -27px"
            v-if="municipios"
            @change="limpiarMunicipio()"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn @click="startInegiApi()"> Buscar </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <p v-if="data.length != 0">
        Total Oportunidades Encontradas: {{ data.length }}
      </p>
      <v-btn
        color="success"
        @click="añadirNUevoLista()"
        v-if="bandera_nuevo != 0"
      >
        Añadir Nuevos
      </v-btn>

      <v-data-table
        dense
        :headers="headers"
        :items-per-page="20"
        :items="data"
        :search="search"
        item-key="id"
        multi-sort
        class="elevation-1"
      >
        <template v-slot:[`item.Estatus`]="{ item }" align="center">
          <v-chip color="green" v-if="item.Estatus == 'Nuevo'"> Nuevo</v-chip>
          <v-chip color="orange" v-if="item.Estatus == 'Registrado'">
            Registrado</v-chip
          >
        </template>

        <template v-slot:[`item.actions`]="{ item }" align="center">
          <v-icon
            large
            class="mr-2"
            @click="añadirNUevo(item)"
            style="color: #44c706"
            v-if="item.Estatus == 'Nuevo'"
          >
            mdi-check
          </v-icon>
        </template>
      </v-data-table>

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
      <!-- SnackBar -->
      <v-snackbar v-model="snackbar">
        {{ textAlert }}
        <v-btn color="pink" text @click="snackbar = false"> Cerrar </v-btn>
      </v-snackbar>
      <!-- /.SnackBar -->
    </template>
  </v-container>
</template>
<script>
import axios from "axios";
const $ = require("jquery");
window.jquery = $;
//const mapMarker = require("../../assets/oportunidades.svg");
export default {
  data: () => ({
    dialogLoading: false,
    data: [],
    search: "",
    headers: [
      { text: "NOMBRE", align: "start", value: "Nombre" },
      { text: "DIRECCIÓN", sortable: false, value: "Calle" },
      { text: "TELÉFONO", sortable: false, value: "Telefono" },
      { text: "ESTATUS", value: "Estatus" },
      { text: "", value: "actions", sortable: false },
    ],
    entidades: [],
    entidadSelect: "",
    municipios: [],
    municipioSelect: "",
    snackbar: false,
    textAlert: null,
    bandera_nuevo: 0,
    listaNueva: [],
    listaNueva2: [],
  }),
  async mounted() {
    let self = this;
    self.getEntidades();
  },
  methods: {
    async getEntidades() {
      let me = this;
      me.dialogLoading = true;
      await axios
        .post("./getEntidades", {
          id: "1",
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.entidades = response.data;
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    async getMunicipio() {
      let me = this;
      me.dialogLoading = true;
      me.municipioSelect = "";
      me.data = [];
      await axios
        .post("./getMunicipio", {
          id: me.entidadSelect,
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.municipios = response.data;
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    startInegiApi() {
      this.listaNueva = [];
      this.listaNueva2 = [];
      this.dialogLoading = true;
      this.data = [];
      this.bandera_nuevo = 0;
      var urlConsulta =
        "https://www.inegi.org.mx/app/api/denue/v1/consulta/BuscarAreaActEstr/" +
        this.formatoNumero(this.entidadSelect, 2) +
        "/" +
        this.formatoNumero(this.municipioSelect, 3) +
        "/0/0/0/0/0/0/467111/0/1/10000/0/1/df2f318e-143f-4148-9344-0b4c9ca7328b";
      var urlConsulta2 =
        "https://www.inegi.org.mx/app/api/denue/v1/consulta/BuscarAreaActEstr/" +
        this.formatoNumero(this.entidadSelect, 2) +
        "/" +
        this.formatoNumero(this.municipioSelect, 3) +
        "/0/0/0/0/0/0/467111/0/1/10000/0/2/df2f318e-143f-4148-9344-0b4c9ca7328b";
      let ctl = this;
      window.jquery
        .getJSON(urlConsulta, function (json) {
          ctl.listaNueva = json;
          window.jquery
            .getJSON(urlConsulta2, function (json2) {
              ctl.listaNueva2 = json2;
              ctl.consultaApi();
            })
            .fail(function () {
              ctl.consultaApi();
            });
        })
        .fail(function () {
          window.jquery
            .getJSON(urlConsulta2, function (json2) {
              ctl.listaNueva2 = json2;
              ctl.consultaApi();
            })
            .fail(function () {
              ctl.consultaApi();
            });
        });
    },
    consultaApi() {
      axios
        .post("./startInegiApi", {
          listaNueva: this.listaNueva,
          listaNueva2: this.listaNueva2,
          idEntidad: this.entidadSelect,
          idMunicipio: this.municipioSelect,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.data = response.data.data;
          if (this.data.length == 0) {
            this.snackbar = true;
            this.textAlert = "No existen oportunidades";
            this.snackbarOut();
            this.dialogLoading = false;
          } else {
            this.bandera_nuevo = response.data.bandera;
          }
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    formatoNumero(number, width) {
      var numberOutput = Math.abs(number); /* Valor absoluto del número */
      var length = number.toString().length; /* Largo del número */
      var zero = "0"; /* String de cero */

      if (width <= length) {
        if (number < 0) {
          return "-" + numberOutput.toString();
        } else {
          return numberOutput.toString();
        }
      } else {
        if (number < 0) {
          return "-" + zero.repeat(width - length) + numberOutput.toString();
        } else {
          return zero.repeat(width - length) + numberOutput.toString();
        }
      }
    },
    añadirNUevo(item) {
      this.dialogLoading = true;
      axios
        .post("./guardarNuevoInegiApi", {
          nuevo: item,
          idEntidad: this.entidadSelect,
          idMunicipio: this.municipioSelect,
        })
        .then(() => {
          this.dialogLoading = false;
          this.snackbar = true;
          this.textAlert = "Se añadio a la bd";
          this.snackbarOut();
          item.Estatus = "Registrado";
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    añadirNUevoLista() {
      this.dialogLoading = true;
      axios
        .post("./guardarNuevoInegiApiLista", {
          nuevo: this.data,
          idEntidad: this.entidadSelect,
          idMunicipio: this.municipioSelect,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.snackbar = true;
          this.textAlert = "Se añadio a la bd";
          this.snackbarOut();
          this.data = response.data;
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    limpiarMunicipio() {
      this.data = [];
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
