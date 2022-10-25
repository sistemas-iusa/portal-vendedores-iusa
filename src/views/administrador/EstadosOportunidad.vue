<template>
  <v-container fluid>
    <v-autocomplete
      dense
      filled
      label="ENTIDAD"
      :items="entidades"
      item-text="nombre"
      item-value="clave"
      v-model="entidadSelect"
      @change="getMunicipio()"
      v-if="entidades"
    >
    </v-autocomplete>
    <p v-if="municipios.length != 0">
      Total Oportunidades Encontradas: {{ municipios.conteo_estatal }}
    </p>
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Buscar"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      dense
      :headers="headers"
      :items-per-page="20"
      :items="municipios.municipios"
      :search="search"
      item-key="id"
      class="elevation-1"
    >
    </v-data-table>
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
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    type: null,
    entidades: [],
    entidadSelect: "",
    municipios: [],
    municipioSelect: "",
    snackbar: false,
    textAlert: null,
    search: "",
    headers: [
      { text: "#", align: "start", value: "id" },
      { text: "NOMBRE", align: "start", value: "nombre" },
      { text: "OPORTUNIDADES", sortable: false, value: "conteoOportunidades" },
    ],
  }),
  async mounted() {
    let self = this;
    self.getEntidades();
    self.type = localStorage.getItem("type");
  },
  methods: {
    async getEntidades() {
      let me = this;
      me.loading = true;
      await axios
        .post("./getEntidades", {
          id: "1",
        })
        .then(function (response) {
          // handle success
          me.loading = false;
          me.entidades = response.data;
        })
        .catch(function (error) {
          me.loading = false;
          console.log(error);
        });
    },
    async getMunicipio() {
      let me = this;
      me.loading = true;
      me.municipioSelect = "";
      me.center = { lat: 19.2564, lng: -99.6048 };
      me.zoom = 5;
      me.markers = [];
      me.infowindow = null;
      await axios
        .post("./getReporteEstadosMunicipios", {
          id: me.entidadSelect,
        })
        .then(function (response) {
          // handle success
          me.loading = false;
          me.municipios = response.data;
        })
        .catch(function (error) {
          me.loading = false;
          console.log(error);
        });
    },
    async getOpportunities() {
      let me = this;
      this.loading = true;
      me.center = { lat: 19.2564, lng: -99.6048 };
      me.zoom = 5;
      me.markers = [];
      me.infowindow = null;
      await axios
        .post("getOpportunitiesInegi", {
          idMunicipio: me.municipioSelect,
          idEntidad: me.entidadSelect,
        })
        .then((response) => {
          this.data = response.data;
          this.markers = [];
          let mark = this.data.length;
          if (mark == 0) {
            this.snackbar = true;
            this.textAlert = "No existen Oportunidades";
            this.snackbarOut();
          } else {
            for (let i = 0; i < mark; i++) {
              this.markers.push({
                lat: parseFloat(this.data[i].latitud),
                lng: parseFloat(this.data[i].longitud),
                id: String(this.data[i].id),
                name: String(this.data[i].id) + "-" + this.data[i].nombre,
                address: this.data[i].direccion,
                phone: this.data[i].telefono,
              });
            }
            me.zoom = 10;
            me.center = {
              lat: parseFloat(me.data[0].latitud),
              lng: parseFloat(me.data[0].longitud),
            };
          }
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async getInfo(marker, key) {
      this.latitud = marker.lat;
      this.longitud = marker.lng;
      this.center = { lat: marker.lat, lng: marker.lng };
      this.name = marker.name;
      this.address = marker.address;
      this.phone = marker.phone;
      this.infowindow = this.center;
      this.zoom = 17;
      this.window_open = true;
      this.selectedKey = key;
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
