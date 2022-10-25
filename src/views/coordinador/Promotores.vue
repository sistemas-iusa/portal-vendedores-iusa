<template>
  <v-container fluid>
    <template>
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
        <template v-slot:[`item.actions`]="{ item }" align="center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="verRutaPromotor(item)"
                style="color: #dc3545"
              >
                mdi-map-marker-distance
              </v-icon>
            </template>
            <span>Rutas Promotor</span>
          </v-tooltip>
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
              <v-toolbar-title>{{ promotor_select.name }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-app>
              <v-btn color="success" @click="routeAsign()">
                Asignar Nueva Ruta
              </v-btn>

              <v-divider></v-divider>
              <v-row>
                <v-col cols="12" :sm="columnasTabla1">
                  <v-data-table
                    dense
                    :headers="headersRoute"
                    :items-per-page="20"
                    :items="routelist"
                    item-key="id"
                    multi-sort
                    class="elevation-1"
                  >
                    <template
                      v-slot:[`item.nomeclatura`]="{ item }"
                      align="center"
                    >
                      RA_{{ item.numero_ruta }}
                    </template>

                    <template v-slot:[`item.actions`]="{ item }" align="center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            large
                            class="mr-2"
                            @click="verDetalleRuta(item)"
                            style="color: primary"
                          >
                            mdi-map
                          </v-icon>
                        </template>
                        <span>Ver Ruta</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            large
                            class="mr-2"
                            @click="liberarRuta(item)"
                            style="color: #dc3545"
                            v-if="item.estatus == 'Sin iniciar'"
                          >
                            mdi-delete
                          </v-icon>
                        </template>
                        <span>Quitar Ruta</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="12" :sm="columnasTabla2">
                  <v-btn
                    color="primary"
                    @click="
                      (rutaSelect = null),
                        (columnasTabla1 = 12),
                        (columnasTabla2 = 0)
                    "
                    v-if="rutaSelect != null"
                  >
                    Cerrar Mapa</v-btn
                  >
                  <div
                    id="mapa1"
                    style="width: 100%; height: 80%"
                    v-show="rutaSelect != null"
                  ></div>
                </v-col>
              </v-row>
            </v-app>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog routeAsing -->
      <v-row justify="center">
        <v-dialog
          v-model="dialogRouteAsign"
          persistent
          scrollable
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Asignar Rutas</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
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
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      filled
                      dense
                      label="MUNICIPIO"
                      :items="municipios"
                      item-text="nombre"
                      item-value="clave_municipio"
                      v-model="municipioSelect"
                      @change="getRutasDisponibles()"
                      style="margin-bottom: -27px"
                      v-if="municipios"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row v-if="rutasDisponibles.length != 0">
                  <v-data-table
                    v-model="rutasselected"
                    :headers="headersRutasDisponibles"
                    :items="rutasDisponibles"
                    item-key="numero_ruta"
                    show-select
                    class="elevation-1"
                  >
                  </v-data-table>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogRouteAsign = false"
              >
                Cerrar
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="asignarRutaPromotor()"
                v-if="rutasselected.length != 0"
              >
                Asignar Rutas
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog Eliminar-->
      <v-row justify="center">
        <v-dialog v-model="dialogQuitarRuta" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5"> Quitar Ruta </v-card-title>
            <v-card-text>Quiere quitar la ruta del promotor</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogQuitarRuta = false"
              >
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="quitarRuta()">
                Aceptar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->

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
    </template>
  </v-container>
</template>
<script>
import axios from "axios";
//const MarkerEliminado = require("../../assets/oportunidades.svg");
//const MarkerPendiente = require("../../assets/m_prospectos.svg");
//const MarkerAprobado = require("../../assets/m_clientes.svg");
export default {
  data: () => ({
    data: [],
    dialog: false,
    dialogLoading: false,
    search: "",
    headers: [
      { text: "NOMBRE", align: "start", value: "name" },
      { text: "CORREO", value: "email" },
      { text: "RUTAS", value: "actions", sortable: false },
    ],
    headersRoute: [
      { text: "ENTIDAD", align: "start", value: "entidad" },
      { text: "MUNICIPIO", align: "start", value: "municipio" },
      { text: "NUMERO DE RUTA", value: "nomeclatura" },
      { text: "NUMERO DE OPORTUNIDADES", value: "orden_ruta" },
      { text: "ESTATUS", value: "estatus" },
      { text: "", value: "actions", sortable: false },
    ],
    loading: true,
    promotor_select: {},
    routelist: [],
    dialogRouteAsign: false,
    entidades: [],
    entidadSelect: "",
    municipios: [],
    municipioSelect: "",
    rutasDisponibles: [],
    rutasselected: [],
    headersRutasDisponibles: [
      { text: "Numero Ruta", value: "numero_ruta", align: "start" },
      { text: "Entidad", value: "entidad" },
      { text: "Municipio", value: "municipio" },
    ],
    rutaSelect: null,
    infoRuta: [],
    registro_rutas: [],
    origen: "",
    destino: "",
    origin: {},
    destination: {},
    show1: false,
    name: "",
    sucursal: "",
    telefono: "",
    email: "",
    password: "",
    password_confirmation: "",
    reglasCreateUser: {
      required: (value) => !!value || "Este campo es necesario.",
      min: (v) => v.length >= 8 || "Min 8 caracteres",
      email: (v) => /.+@.+\..+/.test(v) || "Ingresar correo valido",
    },
    dialogQuitarRuta: false,
    snackbar: false,
    textAlert: null,
    columnasTabla1: 12,
    columnasTabla2: 0,
  }),
  async mounted() {
    let self = this;
    self.getEntidades();
    self.getPromotores();
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
      me.rutasDisponibles = [];
      me.municipioSelect = "";
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
    async getPromotores() {
      this.dialogLoading = true;
      await axios
        .post("getPromotores", {
          idMunicipio: 1,
        })
        .then((response) => {
          this.data = response.data;
          this.dialogLoading = false;
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    verRutaPromotor(item) {
      this.promotor_select = item;
      this.dialog = true;
      this.dialogLoading = true;
      axios
        .post("getRouteList", {
          id: this.promotor_select.id,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.routelist = response.data;
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    verDetalleRuta(item) {
      this.rutaSelect = item;
      this.dialogLoading = true;
      axios
        .post("getRouteMap", {
          idRoute: this.rutaSelect.id,
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

          var destination_Parts = this.destino.split(",");
          this.destination = {
            lat: parseFloat(destination_Parts[0]),
            lng: parseFloat(destination_Parts[1]),
          };

          this.printRoute();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    routeAsign() {
      this.dialogRouteAsign = true;
    },
    getRutasDisponibles() {
      this.dialogLoading = true;
      this.rutasDisponibles = [];
      axios
        .post("getRutasDisponibles", {
          idMunicipio: this.municipioSelect,
          idEntidad: this.entidadSelect,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.rutasDisponibles = response.data;
          if (this.rutasDisponibles.length == 0) {
            this.snackbar = true;
            this.textAlert = "Municipio sin Rutas Disponibles";
            this.snackbarOut();
          }
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    asignarRutaPromotor() {
      this.dialogLoading = true;
      axios
        .post("asignarRutaPromotor", {
          rutasSelect: this.rutasselected,
          promotorSelect: this.promotor_select.id,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.snackbar = true;
          this.textAlert = response.data;
          this.snackbarOut();
          this.dialogRouteAsign = false;
          this.entidadSelect = "";
          this.municipios = [];
          this.municipioSelect = "";
          this.rutasDisponibles = [];
          this.rutasselected = [];
          this.verRutaPromotor(this.promotor_select);
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    printRoute() {
      this.columnasTabla1 = 8;
      this.columnasTabla2 = 4;
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
            if (ruta.bandera_encuesta == 1) {
              const marker = new window.google.maps.Marker({
                position: {
                  lat: parseFloat(ruta.latitud),
                  lng: parseFloat(ruta.longitud),
                },
                map: map,
                title: String(ruta.nombre),
                label: { text: String(ruta.orden_ruta), color: "black" },
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  //url: MarkerAprobado
                },
              });
              //agregar click listener
              marker.addListener("click", () => {
                infoWindow.close();
                infoWindow.setContent(marker.getTitle());
                infoWindow.open(marker.getMap(), marker);
              });
            } else if (ruta.bandera_cancelada == 1) {
              const marker = new window.google.maps.Marker({
                position: {
                  lat: parseFloat(ruta.latitud),
                  lng: parseFloat(ruta.longitud),
                },
                map: map,
                title: String(ruta.nombre),
                label: { text: String(ruta.orden_ruta), color: "white" },
                /*icon: {
                      url: MarkerEliminado
                    }*/
              });
              //agregar click listener
              marker.addListener("click", () => {
                infoWindow.close();
                infoWindow.setContent(marker.getTitle());
                infoWindow.open(marker.getMap(), marker);
              });
            } else {
              const marker = new window.google.maps.Marker({
                position: {
                  lat: parseFloat(ruta.latitud),
                  lng: parseFloat(ruta.longitud),
                },
                map: map,
                title: String(ruta.nombre),
                label: { text: String(ruta.orden_ruta), color: "black" },
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  //url: MarkerPendiente
                },
              });
              //agregar click listener
              marker.addListener("click", () => {
                infoWindow.close();
                infoWindow.setContent(marker.getTitle());
                infoWindow.open(marker.getMap(), marker);
              });
            }
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
    reglaConfirmacionPassword() {
      if (this.password != this.password_confirmation) return "No coinciden";
    },
    liberarRuta(item) {
      this.rutaSelect = item;
      this.dialogQuitarRuta = true;
    },
    quitarRuta() {
      this.dialogLoading = true;
      axios
        .post("quitarRutaPromotor", {
          rutasSelect: this.rutaSelect.id,
          promotorSelect: this.promotor_select.id,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.snackbar = true;
          this.textAlert = response.data;
          this.snackbarOut();
          this.dialogQuitarRuta = false;
          this.verRutaPromotor(this.promotor_select);
        })
        .catch((error) => {
          this.dialogLoading = false;
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
