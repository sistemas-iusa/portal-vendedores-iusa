<template>
  <div style="width: 100%; height: 100%">
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
          @change="getOpportunities()"
          style="margin-bottom: -27px"
          v-if="municipios"
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn @click="getOpportunities()"> Buscar </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <p v-if="total_oportunities">
      Total Oportunidades Encontradas: {{ total_oportunities }}
    </p>
    <!-- Dialog -->
    <v-data-table
      dense
      :headers="headers"
      :items-per-page="5"
      :items="data"
      :search="search"
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }" align="center">
        <v-icon
          large
          class="mr-2"
          @click="getMap(item)"
          style="color: #dc3545"
          v-if="item.estatus == 'nuevo'"
        >
          mdi-map-marker-radius
        </v-icon>
        <v-icon
          large
          class="mr-2"
          @click="getMap(item)"
          style="color: #3a900c"
          v-if="item.estatus != 'nuevo'"
        >
          mdi-map-marker-radius
        </v-icon>
      </template>
    </v-data-table>
    <div
      id="mapa1"
      style="width: 100%; height: 80%"
      v-show="rutaSelect != null"
    ></div>
    <v-btn
      block
      color="success"
      @click="saveRuta()"
      v-show="rutaSelect != null && rutaSelect.estatus == 'nuevo'"
    >
      Guardar Ruta
    </v-btn>
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
  </div>
</template>
<script>
import axios from "axios";
//const mapMarker = require("../assets/oportunidades.svg");
export default {
  data: () => ({
    data: [],
    dialog: false,
    dialogLoading: false,
    search: "",
    headers: [
      { text: "RUTA", align: "start", value: "nombre" },
      { text: "NO. OPORTUNIDADES", align: "start", value: "puntos.length" },
      { text: "UBICACIÓN", value: "actions", sortable: false },
    ],
    entidades: [],
    entidadSelect: "",
    municipios: [],
    municipioSelect: "",
    infoRuta: [],
    registro_rutas: [],
    origen: "",
    destino: "",
    origin: {},
    destination: {},
    rutaSelect: null,
    snackbar: false,
    textAlert: null,
    total_oportunities: null,
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
      me.rutaSelect = null;
      me.total_oportunities = null;
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
    async getOpportunities() {
      this.dialogLoading = true;
      this.data = [];
      this.rutaSelect = null;
      this.total_oportunities = null;
      if (this.municipioSelect != null) {
        await axios
          .post("getProcesoOpportunitiesInegi", {
            idMunicipio: this.municipioSelect,
            idEntidad: this.entidadSelect,
          })
          .then((response) => {
            this.snackbar = true;
            this.textAlert = response.data.message;
            this.snackbarOut();
            this.dialogLoading = false;
            this.data = response.data.data;
            this.total_oportunities = response.data.num_oportunidades;
          })
          .catch((error) => {
            this.dialogLoading = false;
            alert(error);
          })
          .finally(() => (this.dialogLoading = false));
      }
      this.dialogLoading = false;
    },
    getMap(item) {
      //this.dialog=true;
      this.rutaSelect = item;
      this.getRouteMapPrueba();
    },
    async getRouteMapPrueba() {
      this.dialogLoading = true;
      await axios
        .post("getRouteMapPrueba", {
          ruta: this.rutaSelect,
        })
        .then((response) => {
          this.dialogLoading = false;
          console.log(response.data);
          this.infoRuta = response.data.registro_gps;
          this.registro_rutas = response.data.registro_rutas;
          this.origen = response.data.origen;
          this.destino = response.data.destino;

          var origen_Parts = this.origen.split(",");
          this.origin = {
            lat: parseFloat(origen_Parts[0]),
            lng: parseFloat(origen_Parts[1]),
          };

          if (this.infoRuta.length == 1) {
            this.printMapa1();
          } else {
            var destination_Parts = this.destino.split(",");
            this.destination = {
              lat: parseFloat(destination_Parts[0]),
              lng: parseFloat(destination_Parts[1]),
            };
            this.printRoute();
          }
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    printMapa1() {
      this.$gmapApiPromiseLazy().then(() => {
        var directionsDisplay = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
        });
        this.map = new window.google.maps.Map(
          document.getElementById("mapa1"),
          {
            center: this.origin,
            scrollwheel: false,
            zoom: 15,
            mapTypeControl: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: window.google.maps.ControlPosition.LEFT_TOP,
            },
          }
        );
        directionsDisplay.setMap(this.map);
        function ponerMarcadores(infoRuta, map) {
          const infoWindow = new window.google.maps.InfoWindow();
          for (let i = 0; i < infoRuta.length; i++) {
            const ruta = infoRuta[i];
            console.log(ruta.latitud);
            const marker = new window.google.maps.Marker({
              position: {
                lat: parseFloat(ruta.latitud),
                lng: parseFloat(ruta.longitud),
              },
              map: map,
              title: String(ruta.nombre),
              label: { text: String(i + 1), color: "white" },
            });
            //agregar click listener
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
          }
        }
        ponerMarcadores(this.infoRuta, this.map);
      });
    },
    printRoute() {
      this.$gmapApiPromiseLazy().then(() => {
        var directionsService = new window.google.maps.DirectionsService();
        var directionsDisplay = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true,
        });

        this.map = new window.google.maps.Map(
          document.getElementById("mapa1"),
          {
            center: this.destination,
            scrollwheel: false,
            zoom: 15,
            mapTypeControl: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: window.google.maps.ControlPosition.LEFT_TOP,
            },
          }
        );
        directionsDisplay.setMap(this.map);
        //google maps API's direction service
        function calculateAndDisplayRoute(
          directionsService,
          directionsDisplay,
          start,
          destination,
          waypoints
        ) {
          directionsService.route(
            {
              origin: start,
              destination: destination,
              waypoints: waypoints,
              travelMode: "DRIVING",
            },
            function (response, status) {
              if (status === "OK") {
                console.log(response);
                directionsDisplay.setDirections(response);
              }
            }
          );
        }

        function ponerMarcadores(infoRuta, map) {
          const infoWindow = new window.google.maps.InfoWindow();
          for (let i = 0; i < infoRuta.length; i++) {
            const ruta = infoRuta[i];
            console.log(ruta.latitud);
            const marker = new window.google.maps.Marker({
              position: {
                lat: parseFloat(ruta.latitud),
                lng: parseFloat(ruta.longitud),
              },
              map: map,
              title: String(ruta.nombre),
              label: { text: String(i + 1), color: "white" },
            });
            //agregar click listener
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
          }
        }

        calculateAndDisplayRoute(
          directionsService,
          directionsDisplay,
          this.origin,
          this.destination,
          this.registro_rutas
        );
        ponerMarcadores(this.infoRuta, this.map);
      });
    },
    saveRuta() {
      this.dialogLoading = true;
      axios
        .post("saveRuta", {
          ruta: this.rutaSelect,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.snackbar = true;
          this.textAlert = response.data;
          this.snackbarOut();

          this.getOpportunities();
          this.rutaSelect = null;
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
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
