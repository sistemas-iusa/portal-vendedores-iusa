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
                  <p v-if="rutaSelect != null">
                    {{ rutaSelect.entidad }} - {{ rutaSelect.municipio }} -
                    RA_{{ rutaSelect.numero_ruta }}
                  </p>
                  <div
                    id="mapa1"
                    style="width: 100%; height: 600px"
                    v-show="rutaSelect != null"
                  ></div>
                </v-col>
              </v-row>
            </v-app>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->

      <v-dialog
        v-model="mostrarInfoOportunidad"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="mostrarInfoOportunidad = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Detalle Oportunidad</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
            <v-card-title class="d-flex justify-center">
              <v-icon>mdi-store</v-icon>
              <strong>{{ oportunitySelect.orden_ruta }}</strong>
              {{ oportunitySelect.nombre }}</v-card-title
            >
            <v-card-text>
              <p>
                <v-icon>mdi-google-maps</v-icon>Dirección:
                {{ oportunitySelect.direccion }}
              </p>
              <p>
                <v-icon>mdi-cellphone-basic</v-icon>Teléfono:
                {{ oportunitySelect.telefono }}
              </p>
              <br />

              <v-row
                style="padding-block-end: 20px"
                v-if="oportunitySelect.bandera_cancelada == 1"
              >
                <v-alert icon="mdi-delete" type="error">
                  Oportunidad Cancelada
                </v-alert>
                <p>Motivo: {{ oportunitySelect.motivo_cancelacion }}</p>
              </v-row>
              <v-row
                style="padding-block-end: 20px"
                v-if="oportunitySelect.bandera_cancelada != 1"
              >
                <v-btn
                  color="success"
                  block
                  rounded
                  elevation="20"
                  @click="verDetalle(oportunitySelect)"
                >
                  <v-icon> mdi-clipboard-outline </v-icon>
                  Resultado Encuesta
                </v-btn>
              </v-row>
              <v-row
                style="padding-block-end: 20px"
                v-if="oportunitySelect.bandera_cancelada != 1"
              >
                <v-btn
                  color="secondary"
                  block
                  rounded
                  elevation="20"
                  @click="irGaleria()"
                >
                  <v-icon> mdi-camera </v-icon>
                  Ver Fotos
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card>
      </v-dialog>

      <v-dialog fullscreen v-model="mostrarDetalleEncuesta">
        <v-card>
          <v-toolbar dark color="#4eb254">
            <v-btn icon dark @click="mostrarDetalleEncuesta = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>&nbsp;Detalle Encuesta</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <p>
              Oportunidad: <strong>{{ oportunitySelect.nombre }}</strong>
            </p>
            <v-row>
              <p>Fecha: {{ detalleEncuesta.fecha }}</p>
              <p>Hora: {{ detalleEncuesta.hora }}</p>
              <p>
                1.- ¿Actualmente vende productos de la marca IUSA?
                <strong>{{ detalleEncuesta.pregunta1 }}</strong>
              </p>
              <p>
                2.- ¿Actualmente lo atiende o visita un distribuidor que le
                ofrezca productos para surtir su negocio?
                <strong>{{ detalleEncuesta.pregunta2 }}</strong>
              </p>
              <p>
                3.- ¿Estaría interesado en ser visitado frecuentemente por un
                promotor para ayudarle a gestionar sus pedidos de productos IUSA
                con un distribuidor?
                <strong>{{ detalleEncuesta.pregunta3 }}</strong>
              </p>
              <p v-if="detalleEncuesta.pregunta3 == 'NO'">
                4.- ¿Por qué razón no está interesado en ser visitado
                frecuentemente por un promotor?
                <strong>{{ detalleEncuesta.pregunta4 }}</strong>
              </p>
              <p v-if="detalleEncuesta.pregunta3 == 'NO'">
                Motivo el cual finalizo la encuesta =
                <strong>{{ detalleEncuesta.motivo_fin_encuesta }}</strong>
              </p>
            </v-row>
            <v-row v-if="detalleEncuesta.pregunta3 != 'NO'">
              <p>
                5.- ¿Qué líneas de productos vende su negocio?
                <strong>{{ detalleEncuesta.pregunta5 }}</strong>
              </p>
              <p>
                6.- ¿De qué líneas de producto IUSA le gustaría hacer un pedido
                sugerido? <strong>{{ detalleEncuesta.pregunta6 }}</strong>
              </p>
              <p>
                7.- ¿Le gustaría que le coloquemos publicidad de IUSA en su
                negocio? <strong>{{ detalleEncuesta.pregunta7 }}</strong>
              </p>
              <p v-if="detalleEncuesta.pregunta7 == 'SI'">
                8.- ¿Qué tipo de publicidad le gustaría tener en su negocio?
                <strong>{{ detalleEncuesta.pregunta8 }}</strong>
              </p>
              <p>
                9.- ¿Cuántos días a la semana abre su negocio?
                <strong>{{ detalleEncuesta.pregunta9 }}</strong>
              </p>
              <p>
                10.- ¿Cuál es el horario de atención de su negocio?
                <strong>{{ detalleEncuesta.pregunta10 }}</strong>
              </p>
              <p>
                11.- ¿Con qué frecuencia le gustaría ser visitado?
                <strong>{{ detalleEncuesta.pregunta11 }}</strong>
              </p>
              <p>
                12.- ¿Cuántos años tiene este negocio funcionando?
                <strong>{{ detalleEncuesta.pregunta12 }}</strong>
              </p>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="mostrarGaleriaOportunidad"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="secondary">
            <v-btn icon dark @click="mostrarGaleriaOportunidad = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Galeria Oportunidad</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card>
            <v-carousel v-if="gallery.length != 0">
              <!--<v-carousel-item
              v-for="(item, i) in gallery"
              :key="i"
              :src="$hostImage + item.foto"
              style="background-color: purple; width:300px "
            ></v-carousel-item>-->
              <v-carousel-item
                class="mob-carousel-item"
                v-for="(item, i) in gallery"
                :key="i"
              >
                <div class="mob-carousel-img-container">
                  <v-img
                    class="mob-carousel-img"
                    :src="$hostImage + item.foto"
                    contain
                    max-height="40vh"
                  ></v-img>
                </div>
              </v-carousel-item>
            </v-carousel>
            <v-alert type="warning" v-if="gallery.length == 0">
              Sin fotos cargadas
            </v-alert>
          </v-card>
        </v-card>
      </v-dialog>

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
    mostrarInfoOportunidad: false,
    oportunitySelect: {},
    mostrarDetalleEncuesta: false,
    detalleEncuesta: {},
    mostrarGaleriaOportunidad: false,
    gallery: [],
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
      let self = this;
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

        function ponerMarcadores(infoRuta, map, rutaDet) {
          self.nextOportunitie = null;
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
                title: ruta.nombre,
                label: { text: ruta.orden_ruta, color: "black" },
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                },
              });

              //agregar click listener
              //marker.addListener("click", self.verDetalle(marker));
              marker.addListener("click", () => {
                infoWindow.close();
                self.verInfoOportunidad(ruta);
              });
            } else if (ruta.bandera_cancelada == 1) {
              const marker = new window.google.maps.Marker({
                position: {
                  lat: parseFloat(ruta.latitud),
                  lng: parseFloat(ruta.longitud),
                },
                map: map,
                title: ruta.nombre,
                label: { text: ruta.orden_ruta, color: "white" },
              });

              //agregar click listener
              //marker.addListener("click", self.verDetalle(marker));
              marker.addListener("click", () => {
                infoWindow.close();
                self.verInfoOportunidad(ruta);
              });
            } else {
              const marker = new window.google.maps.Marker({
                position: {
                  lat: parseFloat(ruta.latitud),
                  lng: parseFloat(ruta.longitud),
                },
                map: map,
                title: ruta.nombre,
                label: { text: ruta.orden_ruta, color: "black" },
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                },
              });
              //agregar animacion
              if (i == rutaDet.encuestas_realizadas) {
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                self.nextOportunitie = ruta.orden_ruta;
              }
              //marker.setAnimation(window.google.maps.Animation.BOUNCE);
              //agregar click listener
              marker.addListener("click", () => {
                infoWindow.close();
                self.verInfoOportunidad(ruta);
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
        ponerMarcadores(this.infoRuta, this.map, this.rutaSelect);
      });
    },
    verInfoOportunidad(item) {
      this.mostrarInfoOportunidad = true;
      this.oportunitySelect = item;
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
    verDetalle(item) {
      if (item.bandera_encuesta == 1) {
        this.mostrarDetalleEncuesta = true;
        this.oportunitySelect = item;
        this.loading = true;
        axios
          .post("getFormDetail", {
            idPromotor: this.promotor_select.id,
            idOportunidad: this.oportunitySelect.id,
          })
          .then((response) => {
            this.loading = false;
            this.detalleEncuesta = response.data;
          })
          .catch((error) => {
            this.loading = false;
            alert(error);
          })
          .finally(() => (this.loading = false));
      } else {
        this.snackbar = true;
        this.textAlert = "Oportunidad no visitada";
        this.snackbarOut();
      }
    },
    irGaleria() {
      this.mostrarGaleriaOportunidad = true;
      let me = this;
      me.gallery = [];
      me.loading = true;
      axios
        .post("getPicktures", {
          id_oportunidad: me.oportunitySelect.id,
        })
        .then((response) => {
          me.loading = false;
          me.gallery = response.data;
        })
        .catch((error) => {
          me.loading = false;
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
<style>
.mob-carousel-item {
  .mob-carousel-img-container {
    height: 100%;
    width: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
    .mob-carousel-img {
      align-self: center;
      height: auto;
      max-height: 100%;
    }
  }
}
</style>
