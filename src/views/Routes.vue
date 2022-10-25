<template>
  <div style="width: 100%; height: 100%">
    <v-row
      class="d-flex justify-center"
      style="padding-top: 20px; padding-block-end: 10px"
    >
      <v-btn rounded color="secondary" dark bottom @click="dialog = true">
        <v-icon>mdi-routes</v-icon>
        Rutas asignadas
      </v-btn>
    </v-row>
    <v-card class="d-flex justify-center" v-if="infoRuta.length != 0">
      <p>
        Detalle Ruta <strong>{{ routeSelect.numero_ruta }}</strong>
      </p>
      <p v-if="routeSelect.estatus == 'Terminado'">Finalizado</p>

      <v-fab-transition>
        <v-btn
          rounded
          color="success"
          v-if="routeSelect.estatus != 'Terminado'"
          @click="startRoute()"
          fab
          dark
          small
          absolute
          bottom
          right
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-card>

    <div id="mapa1" style="width: 100%; height: 80%"></div>
    <p v-if="nextOportunitie">Siguiente Oportunidad {{ nextOportunitie }}</p>

    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-title>Seleccionar ruta</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-radio-group
            v-for="data in routelist"
            :key="data.numero_ruta"
            v-model="routeSelect"
          >
            <v-radio
              :label="
                data.entidad +
                ' ' +
                data.municipio +
                ' ' +
                data.numero_ruta +
                ' ' +
                data.estatus
              "
              :value="data"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cerrar
          </v-btn>
          <v-btn color="blue darken-1" text @click="getRouteMap()">
            Ver Ruta
          </v-btn>
        </v-card-actions>
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

    <v-dialog fullscreen v-model="mostrarBajaOportunidad">
      <v-card>
        <v-toolbar dark color="#ee4242">
          <v-btn icon dark @click="mostrarBajaOportunidad = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>&nbsp;Oportunidad Cancelada</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <p>Oportunidad: {{ oportunitySelect.nombre }}</p>
          <br />
          <p>
            Motivo de cancelación: {{ oportunitySelect.motivo_cancelacion }}
          </p>
          <br />
        </v-card-text>
      </v-card>
    </v-dialog>

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
            <v-carousel-item
              v-for="(item, i) in gallery"
              :key="i"
              :src="$hostImage + item.foto"
              style="background-color: purple; height: 70px; whidth: 70px"
              class="pb-0 mb-0"
            ></v-carousel-item>
          </v-carousel>
          <v-alert type="warning" v-if="gallery.length == 0">
            Sin fotos cargadas
          </v-alert>
        </v-card>
      </v-card>
    </v-dialog>
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
  </div>
</template>
<style>
.realizado {
  background: #86c7a1;
}
.cancelado {
  background: #ee4242;
}
</style>
<script>
import Vue from "vue";
import axios from "axios";
import * as VueGoogleMaps from "vue2-google-maps";
import router from "../router";

//import * as google from 'vue2-google-maps'
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBwsTOgSJoyp56mJoj-zJAF80LC2DUDH7w",
    libraries: "places",
  },
});
Vue.component("google-map", VueGoogleMaps.Map);
Vue.component("google-marker", VueGoogleMaps.Marker);
export default {
  data: () => ({
    loading: true,
    snackbar: false,
    textAlert: null,
    zoom: 13,
    dialog: false,
    dialog2: false,
    routeSelect: "",
    mapCenter: { lat: 19.2564, lng: -99.6048 },
    routelist: [],
    infoRuta: [],
    registro_rutas: [],
    origen: "",
    destino: "",
    origin: {},
    destination: {},
    mostrarDetalleEncuesta: false,
    mostrarBajaOportunidad: false,
    oportunitySelect: {},
    detalleEncuesta: {},
    mostrarInfoOportunidad: false,
    mostrarGaleriaOportunidad: false,
    gallery: [],
    nextOportunitie: null,
  }),
  async mounted() {
    let self = this;
    self.getRouteList();
    self.startMap();
  },
  methods: {
    async getRouteList() {
      await axios
        .post("getRouteList", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.routelist = response.data;
          for (let i = 0; i < this.routelist.length; i++) {
            const routeDetail = this.routelist[i];
            if (routeDetail.estatus == "En proceso") {
              router.replace("/tracking/" + routeDetail.id);
            }
          }
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async startMap() {
      this.$gmapApiPromiseLazy().then(() => {
        this.map = new window.google.maps.Map(
          document.getElementById("mapa1"),
          {
            center: this.mapCenter,
            zoom: 13,
            mapTypeControl: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: window.google.maps.ControlPosition.LEFT_TOP,
            },
          }
        );
      });
    },
    async getRouteMap() {
      this.dialog = false;
      this.loading = true;
      await axios
        .post("getRouteMap", {
          idRoute: this.routeSelect.id,
        })
        .then((response) => {
          //this.data = response.data;
          this.loading = false;
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
          this.loading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    printRoute() {
      let self = this;
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
        ponerMarcadores(this.infoRuta, this.map, this.routeSelect);
      });
    },
    startRoute() {
      let self = this;
      self.loading = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          axios
            .post("./startRoute", {
              id_ruta: this.routeSelect.id,
              latitud: pos.coords.latitude,
              longitud: pos.coords.longitude,
            })
            .then(function (response) {
              // handle success
              self.loading = false;
              console.log(response);
              router.replace("/tracking/" + self.routeSelect.id);
            })
            .catch(function (error) {
              self.loading = false;
              console.log(error);
            });
        },
        (err) => {
          self.loading = false;
          self.snackbar = true;
          self.textAlert = "Activar GPS";
          self.snackbarOut();
          console.log("Activar GPS" + err);
        }
      );
    },
    verDetalle(item) {
      if (item.bandera_encuesta == 1) {
        this.mostrarDetalleEncuesta = true;
        this.oportunitySelect = item;
        this.loading = true;
        axios
          .post("getFormDetail", {
            idPromotor: localStorage.getItem("id"),
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
      } else if (item.bandera_cancelada == 1) {
        this.mostrarBajaOportunidad = true;
        this.oportunitySelect = item;
      } else {
        this.snackbar = true;
        this.textAlert = "Oportunidad no visitada";
        this.snackbarOut();
      }
    },
    verInfoOportunidad(item) {
      this.mostrarInfoOportunidad = true;
      this.oportunitySelect = item;
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
