<template>
  <v-container fluid>
    <!-- <h1>Opportunities page</h1> -->
    <template>
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
        :items="markers"
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
                @click="getLocation(item)"
                style="color: #dc3545"
              >
                mdi-map-marker-radius
              </v-icon>
            </template>
            <span>Ver Mapa</span>
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
              <v-toolbar-title>{{ opportunitty_name }}</v-toolbar-title>
              <v-spacer></v-spacer>

              <a
                :href="`https://maps.google.com/?q=${latitud},${longitud}&entry=gps`"
                target="_blank"
                style="font-size: 14px"
              >
                <v-btn class="mx-2" fab dark small color="error">
                  <font-awesome-icon icon="map-marker-alt" size="2x" />
                </v-btn>
              </a>
            </v-toolbar>

            <v-app>
              <GmapMap
                :center="center"
                :zoom="zoom"
                map-type-id="roadmap"
                style="width: 100%; height: 100%"
              >
                <GmapMarker :position="marker" :icon="markerOptions" />
                <GmapInfoWindow
                  @closeclick="window_open = false"
                  :opened="window_open"
                  :position="infowindow"
                  :options="{
                    pixelOffset: {
                      width: 0,
                      height: -35,
                    },
                  }"
                >
                  <span style="font-weight: 700; color: #000; font-size: 20px">
                    {{ name }} </span
                  ><br />
                  <span style="font-size: 14px"
                    ><v-icon dense color="green darken-2">mdi-home-city</v-icon>
                    {{ address }}.</span
                  >
                  <br />
                  <a
                    :href="`https://maps.google.com/?q=${latitud},${longitud}&entry=gps`"
                    target="_blank"
                    style="font-size: 14px; text-decoration: none"
                    ><v-icon dense color="red darken-2"
                      >mdi-map-marker-radius</v-icon
                    >
                    VER EN GOOGLE MAPS.</a
                  >
                  <br v-if="phone" />
                  <a
                    :href="`tel:${phone}`"
                    v-if="phone"
                    style="
                      font-size: 14px;
                      text-decoration: none;
                      color: #000000de;
                    "
                    ><v-icon dense color="blue darken-2">mdi-phone</v-icon>
                    {{ phone }}.</a
                  >
                </GmapInfoWindow>
              </GmapMap>
            </v-app>
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
const mapMarker = require("../assets/oportunidades.svg");
export default {
  data: () => ({
    marker: {},
    markers: [],
    infowindow: null,
    window_open: false,
    data: [],
    latitud: null,
    longitud: null,
    name: null,
    address: null,
    phone: null,
    zoom: 13,
    center: { lat: 19.2564, lng: -99.6048 },
    dialog: false,
    search: "",
    headers: [
      { text: "#", align: "start", value: "id" },
      { text: "NOMBRE", align: "start", value: "name" },
      { text: "DIRECCIÓN", sortable: false, value: "address" },
      { text: "TELÉFONO", sortable: false, value: "phone" },
      { text: "MUNICIPIO", sortable: false, value: "town" },
      { text: "", value: "actions", sortable: false },
    ],
    opportunitty_name: null,
    markerOptions: {
      labelOrigin: { x: 45, y: 15 },
      url: mapMarker,
      size: { width: 40, height: 40, f: "px", b: "px" },
      scaledSize: { width: 40, height: 40, f: "px", b: "px" },
    },
    loading: true,
  }),
  async mounted() {
    let self = this;
    self.getOpportunities();
  },
  methods: {
    async getOpportunities() {
      await axios
        .post("getOpportunities", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.data = response.data;
          let mark = this.data.length;
          for (let i = 0; i < mark; i++) {
            this.markers.push({
              lat: parseFloat(this.data[i].latitud),
              lng: parseFloat(this.data[i].longitud),
              id: this.data[i].id,
              name: this.data[i].nombre,
              address: this.data[i].direccion,
              phone: this.data[i].telefono,
              town: this.data[i].municipio,
            });
          }
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    getLocation(item) {
      this.opportunitty_name = item.name;
      this.latitud = parseFloat(item.lat);
      this.longitud = parseFloat(item.lng);
      this.center = { lat: this.latitud, lng: this.longitud };
      this.marker = { lat: this.latitud, lng: this.longitud };
      this.name = item.name;
      this.address = item.address;
      this.phone = item.phone;
      this.infowindow = this.center;
      this.zoom = 17;
      this.window_open = true;
      this.dialog = true;
    },
  },
};
</script>
