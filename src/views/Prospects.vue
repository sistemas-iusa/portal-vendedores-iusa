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
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="getLocation(item)"
                style="color: #0062cc"
              >
                mdi-map-marker-radius
              </v-icon>
            </template>
            <span>Ver Mapa</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="getProspect(item)"
                style="color: #c59f20"
              >
                mdi-account
              </v-icon>
            </template>
            <span>Modificar Datos</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="getDistribuidores(item)"
                style="color: #f55814"
              >
                mdi-truck
              </v-icon>
            </template>
            <span>Ver Distribuidores</span>
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
              <!-- <v-btn
              dark
              text
              @click="dialog = false"
            >
              Save
            </v-btn> -->
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
            <!-- <v-card-title class="text-h5 grey lighten-2">
              {{ opportunitty_name }}
            </v-card-title> -->
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
            <!-- <v-divider></v-divider> -->
            <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">
                I accept
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog -->
      <v-row justify="center">
        <v-dialog
          v-model="dialogContacto"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="indigo">
              <v-btn icon dark @click="dialogContacto = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title
                >Datos contacto {{ opportunitty_name }}</v-toolbar-title
              >
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <div>
                <v-text-field
                  label="Nombre"
                  v-model="item_select.name"
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  label="Dirección"
                  v-model="item_select.address"
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  label="Teléfono"
                  v-model="item_select.phone"
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  label="Nombre del Contacto"
                  v-model="item_select.contactName"
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  label="Teléfono del Contacto"
                  v-model="item_select.contactTelefone"
                ></v-text-field>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="success" @click="upadteProspecto()">
                Guardar Cambios
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog -->
      <v-row justify="center">
        <v-dialog
          v-model="dialog2"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="indigo">
              <v-btn icon dark @click="dialog2 = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title> ENCUESTA</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon large class="mr-2">mdi-clipboard-text-search</v-icon>
            </v-toolbar>
            <v-card-title>{{ opportunitty_name }}</v-card-title>
            <v-card-text>
              <Survey />
              <v-spacer></v-spacer>
              <p>Distribuidores</p>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->

      <v-dialog
        v-model="dialogDistribuidores"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialogDistribuidores = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Distribuidores Asociados</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <br />
          <v-card-text>
            <v-row>
              <p>
                Distribuidores asociados al cliente:
                {{ opportunitty_name }}
              </p>
            </v-row>
            <v-row style="padding-block-end: 20px">
              <v-btn
                color="primary"
                rounded
                elevation="20"
                @click="dialogDistribuidorIusa = true"
              >
                <v-icon> mdi-account-star </v-icon>
                Agregar Disitribuidor IUSA
              </v-btn>

              <v-btn
                color="secondary"
                rounded
                elevation="20"
                @click="dialogDistribuidorOtro = true"
              >
                <v-icon> mdi-account-outline </v-icon>
                Agregar Distribuidor Externo
              </v-btn>

              <!--<v-btn
              color="success"
              rounded
              elevation="20"
              @click="dialogDistribuidores = false"
            >
              <v-icon> mdi-check </v-icon>
              Actualizar Distribuidores
            </v-btn>-->
            </v-row>
            <v-row v-if="distribuidores.length != 0">
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Tipo</th>
                      <th class="text-left">Nombre</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in distribuidores" :key="item.nombre">
                      <td>{{ item.tipo }}</td>
                      <td>{{ item.nombre }}</td>
                      <td>
                        <v-icon
                          large
                          class="mr-2"
                          @click="eliminarItem(item)"
                          style="color: #ff0000"
                        >
                          mdi-delete
                        </v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDistribuidorIusa" persistent max-width="300px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Distribuidor IUSA</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-autocomplete
                  filled
                  rounded
                  v-model="distribuidor_iusa"
                  :items="listaDistribuidor"
                  return-object
                  item-text="NOMBRELIST"
                  label="Buscar Distribuidor IUSA"
                >
                </v-autocomplete>
              </v-row>
              <v-row v-if="distribuidor_iusa">
                <v-col cols="12" sm="6" md="6"> Valuación Distribuidor </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-rating
                    v-model="calificacion"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                  ></v-rating>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialogDistribuidorIusa = false"
            >
              Cerrar
            </v-btn>
            <v-btn color="blue darken-1" text @click="addIusa()">
              <v-icon> mdi-plus </v-icon>
              Agregar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogDistribuidorOtro" persistent max-width="300px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Otro Distribuidor</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field
                  label="Nombre Distribuidor"
                  v-model="distribuidor"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  label="Dirección"
                  v-model="direccion"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field label="Correo" v-model="correo"></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                  label="Teléfono"
                  v-model="telefono"
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field label="Código Postal" v-model="cp"></v-text-field>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6"> Valuación Distribuidor </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-rating
                    v-model="calificacion"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                  ></v-rating>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialogDistribuidorOtro = false"
            >
              Cerrar
            </v-btn>
            <v-btn color="blue darken-1" text @click="add()">
              <v-icon> mdi-plus </v-icon>
              Agregar
            </v-btn>
          </v-card-actions>
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
    </template>
  </v-container>
</template>
<script>
import axios from "axios";
import Survey from "@/views/Survey.vue";
const mapMarker = require("../assets/m_prospectos.svg");
export default {
  components: {
    Survey,
  },
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
    dialog2: false,
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
    snackbar: false,
    textAlert: null,
    dialogContacto: false,
    item_select: {},
    dialogDistribuidores: false,
    distribuidores: [],
    dialogDistribuidorIusa: false,
    dialogDistribuidorOtro: false,
    listaDistribuidor: [],
    distribuidor_iusa: null,
    distribuidor: null,
    direccion: "",
    telefono: "",
    correo: "",
    cp: "",
    calificacion: 0,
  }),
  async mounted() {
    let self = this;
    self.getOpportunities();
    self.cargarDistribuidor();
  },
  methods: {
    async getOpportunities() {
      await axios
        .post("getProspects", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.data = response.data;
          console.log(this.data);
          let mark = this.data.length;
          for (let i = 0; i < mark; i++) {
            this.markers.push({
              id: this.data[i].id,
              lat: parseFloat(this.data[i].latitud),
              lng: parseFloat(this.data[i].longitud),
              name: this.data[i].nombre,
              address: this.data[i].direccion,
              phone: this.data[i].telefono,
              town: this.data[i].municipio,
              contactName: this.data[i].contacto_nombre,
              contactTelefone: this.data[i].contacto_telefono,
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
    getProspect(item) {
      this.opportunitty_name = item.name;
      this.item_select = item;
      this.dialogContacto = true;
    },
    getOpportunity(item) {
      this.opportunitty_name = item.name;
      this.dialog2 = true;
    },
    upadteProspecto() {
      this.loading = true;
      axios
        .post("upadteProspecto", {
          id: localStorage.getItem("id"),
          prospecto_id: this.item_select.id,
          prospecto_nombre: this.item_select.name,
          prospecto_direccion: this.item_select.address,
          prospecto_telefono: this.item_select.phone,
          prospecto_contacto_nombre: this.item_select.contactName,
          prospecto_contacto_telefono: this.item_select.contactTelefone,
        })
        .then((response) => {
          this.loading = false;
          this.item_select = {};
          this.dialogContacto = false;
          this.snackbar = true;
          this.textAlert = response.data;
          this.snackbarOut();
          this.data = [];
          this.marker = [];
          this.getOpportunities();
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    getDistribuidores(item) {
      let me = this;
      this.opportunitty_name = item.name;
      this.item_select = item;
      this.dialogDistribuidores = true;
      this.loading = true;
      axios
        .post("./getDistributorsAll", {
          id: item.id,
        })
        .then(function (response) {
          // handle success
          me.loading = false;
          me.distribuidores = response.data;
        })
        .catch(function (error) {
          // handle error
          me.loading = false;
          console.log(error);
        });
    },
    async cargarDistribuidor() {
      let me = this;
      me.loading = true;
      await axios
        .post("./obtenerDistribuidores", {
          id: 1,
        })
        .then(function (response) {
          // handle success
          me.loading = false;
          me.listaDistribuidor = response.data;
          me.listaDistribuidor.pop();
        })
        .catch(function (error) {
          // handle error
          me.loading = false;
          console.log(error);
        });
    },
    add() {
      if (this.distribuidor != null) {
        this.objeto_default = {
          nombre: "",
          idIusa: "",
          tipo: "Otro",
          direccion: "",
          telefono: "",
          correo: "",
          cp: "",
          calificacion: "",
        };
        this.objeto_default.nombre = this.distribuidor;
        this.objeto_default.calificacion = this.calificacion;
        this.objeto_default.direccion = this.direccion;
        this.objeto_default.telefono = this.telefono;
        this.objeto_default.correo = this.correo;
        this.objeto_default.cp = this.cp;
        let me = this;
        me.loading = true;
        axios
          .post("./addDistributor", {
            distribuidor: me.objeto_default,
            id: me.item_select.id,
          })
          .then(function (response) {
            // handle success
            me.loading = false;
            me.snackbar = true;
            me.textAlert = "Distribuidor Agregado";
            me.snackbarOut();
            //me.objeto_default.id = response.data.id;
            me.distribuidores.push(response.data);
            me.distribuidor = null;
            me.direccion = "";
            me.telefono = "";
            me.correo = "";
            me.cp = "";
            me.calificacion = 0;
            me.objeto_default = {};
            me.dialogDistribuidorOtro = false;
          })
          .catch(function (error) {
            // handle error
            me.loading = false;
            console.log(error);
          });
      }
    },
    addIusa() {
      if (this.distribuidor_iusa != null) {
        this.objeto_default = {
          nombre: "",
          idIusa: "",
          tipo: "IUSA",
          direccion: "",
          telefono: "",
          correo: "",
          cp: "",
          calificacion: "",
        };
        this.objeto_default.nombre = this.distribuidor_iusa.NAME1;
        this.objeto_default.idIusa = this.distribuidor_iusa.KUNNR;
        this.objeto_default.direccion = this.direccion;
        this.objeto_default.telefono = this.telefono;
        this.objeto_default.correo = this.correo;
        this.objeto_default.cp = this.cp;
        this.objeto_default.calificacion = this.calificacion;
        let me = this;
        me.loading = true;
        axios
          .post("./addDistributor", {
            distribuidor: me.objeto_default,
            id: me.item_select.id,
          })
          .then(function (response) {
            // handle success
            me.loading = false;
            me.snackbar = true;
            me.textAlert = "Distribuidor Agregado";
            me.snackbarOut();
            //me.objeto_default.id = response.data.id;
            me.distribuidores.push(response.data);
            me.distribuidor_iusa = null;
            me.objeto_default = {};
            me.direccion = "";
            me.telefono = "";
            me.correo = "";
            me.cp = "";
            me.calificacion = 0;
            me.dialogDistribuidorIusa = false;
          })
          .catch(function (error) {
            // handle error
            me.loading = false;
            console.log(error);
          });
      }
    },
    eliminarItem(index) {
      let me = this;
      me.loading = true;
      axios
        .post("./deleteDistributor", {
          id: index.id,
        })
        .then(function () {
          // handle success
          me.loading = false;
          me.snackbar = true;
          me.textAlert = "Distribuidor Eliminado";
          me.snackbarOut();
          me.distribuidores.splice(index, 1);
        })
        .catch(function (error) {
          // handle error
          me.loading = false;
          console.log(error);
        });
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
