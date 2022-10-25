<template>
  <v-app>
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
        <v-autocomplete
          filled
          solo
          label="OPORTUNIDAD"
          :items="markers"
          item-text="name"
          return-object
          v-model="opportunity"
          @change="getInfo(opportunity)"
          style="margin-bottom: -27px"
          v-if="markers"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <p v-if="markers.length != 0">
      Total Oportunidades Encontradas: {{ markers.length }}
    </p>
    <GmapMap
      :center="center"
      :zoom="zoom"
      map-type-id="roadmap"
      style="width: 100%; height: 100%"
      v-if="!loading"
    >
      <GmapMarker
        :key="key"
        v-for="(marker, key) in markers"
        :position="marker"
        :clickable="true"
        :icon="markerOptions"
        :animation="2"
        @click="getInfo(marker, key)"
      />
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
        <span style="font-weight: 700; color: #000; font-size: 18px">
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
          ><v-icon small dense color="red darken-2"
            >mdi-map-marker-radius</v-icon
          >
          VER EN GOOGLE MAPS.</a
        >
        <br v-if="phone" />
        <a
          :href="`tel:${phone}`"
          v-if="phone"
          style="font-size: 14px; text-decoration: none; color: #000000de"
          ><v-icon dense color="blue darken-2">mdi-phone</v-icon>
          {{ phone }}.</a
        >
      </GmapInfoWindow>
    </GmapMap>
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
  </v-app>
</template>

<script>
import axios from "axios";
const mapMarker = require("../../assets/oportunidades.svg");
export default {
  data: () => ({
    type: null,
    opportunity: null,
    center: { lat: 19.2564, lng: -99.6048 },
    zoom: 5,
    value: 1,
    data: null,
    loading: true,
    markers: [],
    infowindow: null,
    window_open: false,
    name: null,
    address: null,
    phone: null,
    latitud: null,
    longitud: null,
    markerOptions: {
      labelOrigin: { x: 45, y: 15 },
      url: mapMarker,
      size: { width: 35, height: 35, f: "px", b: "px" },
      scaledSize: { width: 35, height: 35, f: "px", b: "px" },
    },
    entidades: [],
    entidadSelect: "",
    municipios: [],
    municipioSelect: "",
    snackbar: false,
    textAlert: null,
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
        .post("./getMunicipio", {
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
