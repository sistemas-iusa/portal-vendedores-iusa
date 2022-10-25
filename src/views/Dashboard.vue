<template>
  <v-app>
    <v-autocomplete
      filled
      solo
      label="BUSCAR OPORTUNIDAD"
      :items="markers"
      item-text="name"
      return-object
      v-model="opportunity"
      @change="getInfo(opportunity)"
      style="margin-bottom: -27px"
      v-if="!loading"
    >
    </v-autocomplete>
    <div style="background-color: #333">
      <p
        v-if="!loading"
        style="
          color: #fff !important;
          font-size: 14px;
          text-align: center;
          padding-top: 15px;
          font-weight: 700px;
        "
      >
        Total Oportunidades {{ markers.length }}
      </p>
    </div>
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
        :label="marker.direccion"
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
  </v-app>
</template>

<script>
import axios from "axios";
const mapMarker = require("../assets/oportunidades.svg");
export default {
  data: () => ({
    opportunity: null,
    center: { lat: 19.2564, lng: -99.6048 },
    zoom: 13,
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
              name: this.data[i].id + "-" + this.data[i].nombre,
              address: this.data[i].direccion,
              phone: this.data[i].telefono,
            });
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
  },
};
</script>
