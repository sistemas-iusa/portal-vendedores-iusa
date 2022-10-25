<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="12">
        <v-autocomplete
          v-model="value"
          :items="data"
          item-text="nombre"
          return-object
          dense
          filled
          rounded
          label="BUSCAR PROSPECTO"
          class="mt-xs-4 mt-md-4 mt-lg-4"
          @change="getDistributors(value.id)"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row
      align="center"
      class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0"
      v-if="value"
    >
      <v-col cols="12">
        <h6>
          <span>SELECCIONADO: {{ value.nombre }}</span>
        </h6>
      </v-col>
    </v-row>
    <v-row v-if="hasError">
      <v-col cols="12">
        <v-alert text dense outlined type="error">
          {{ hasError }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0" v-if="value">
      <v-col cols="12">
        <v-text-field
          label="ORDEN DE COMPRA"
          required
          v-model="name"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0" v-if="value">
      <v-col cols="4" xs="4">
        <v-text-field
          label="CÓDIGO DE MATERIAL"
          required
          v-model="code"
        ></v-text-field>
      </v-col>
      <v-col cols="4" xs="4">
        <v-text-field label="UNIDADES" required v-model="units"></v-text-field>
      </v-col>
      <v-col cols="4" xs="4">
        <v-btn
          class="mx-2"
          fab
          dark
          color="teal"
          levation="2"
          @click="getMaterial()"
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <!-- <v-divider></v-divider> -->
    <v-card class="mb-lg-4 mb-md-4 mb-xs-10">
      <v-row dense v-if="value">
        <v-col v-for="(item, i) in cart" :key="i" cols="12">
          <v-card :color="item.color" dark>
            <div class="d-flex flex-no-wrap justify-space-between">
              <!-- <v-avatar class="ma-3" size="65" tile>
                <v-img
                  :src="'img/cobre.png'"
                  width="100"
                  style="
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
                      0 3px 6px rgba(0, 0, 0, 0.23);
                  "
                />
              </v-avatar> -->
              <div>
                <v-card-title
                  class="pa-lg-2"
                  style="font-size: 16px"
                  v-text="item.codigo_material"
                ></v-card-title>
                <v-card-subtitle class="pa-lg-2"
                  >{{ item.nombre_material }}<br />U. MED X
                  {{ item.unidad_medida }} | EMPAQUE:
                  {{ item.empaque }}</v-card-subtitle
                >
                <!-- <v-card-actions>
                  <v-btn
                    v-if="item.artist === 'Ellie Goulding'"
                    class="ml-2 mt-3"
                    fab
                    icon
                    height="40px"
                    right
                    width="40px"
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    class="ml-2 mt-5"
                    outlined
                    rounded
                    small
                  >
                    START RADIO
                  </v-btn>
                </v-card-actions> -->
              </div>
              <div>
                <v-card-title
                  class="text-h6 singleLine"
                  v-text="item.u_confirm"
                ></v-card-title>
                <!-- <v-card-subtitle>{{ item.title }}</v-card-subtitle> -->
              </div>
              <div class="pa-lg-2">
                <v-card-subtitle
                  ><v-btn
                    class="mx-2"
                    fab
                    dark
                    small
                    color="red darken-2"
                    levation="2"
                    @click="deleteItem(i)"
                  >
                    <v-icon dark> mdi-trash-can-outline </v-icon>
                  </v-btn></v-card-subtitle
                >
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-radio-group
      v-model="row"
      row
      v-if="value && assigned.length === 0 && cart.length != 0"
    >
      <v-radio label="DISTRIBUIDOR" value="radio-1"></v-radio>
      <v-radio label="VENDEDOR" value="radio-2"></v-radio>
    </v-radio-group>
    <v-row
      align="center"
      v-if="value && assigned.length !== 0"
      class="mt-lg-0 mt-md-0 mt-xs-0"
    >
      <v-col cols="12">
        <v-autocomplete
          v-model="distributor"
          :items="distributors"
          item-text="NAME1"
          return-object
          dense
          filled
          rounded
          label="SELECCIONAR DISTRIBUIDOR"
          class="mt-xs-4 mt-md-4 mt-lg-4"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row v-if="value && assigned.length === 0">
      <v-col cols="12" v-if="row === 'radio-1'">
        <Dealer @getData="getData" />
      </v-col>
      <v-col cols="12" v-if="row === 'radio-2'">
        <Seller @getSeller="getSeller" />
      </v-col>
    </v-row>
    <v-btn
      block
      elevation="2"
      color="success"
      large
      v-if="value && cart.length != 0"
      @click="setOrder()"
    >
      Generar Pedido Sugerido
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
    <!-- /.SnackBar -->
  </v-container>
</template>
<style>
.singleLine {
  min-width: 60px;
}
</style>
<script>
import Dealer from "@/components/Dealer.vue";
import Seller from "@/components/Seller.vue";
import axios from "axios";
export default {
  components: {
    Dealer,
    Seller,
  },
  data: () => ({
    dialogLoading: false,
    snackbar: false,
    textAlert: null,
    order: null,
    hasError: null,
    msg: null,
    cart: [],
    materialError: null,
    units: null,
    code: null,
    dealer: null,
    seller: null,
    assigned: null,
    name: null,
    column: null,
    row: null,
    data: [],
    material: [],
    distributors: [],
    value: null,
    distributor: null,
    items: [
      {
        color: "#1F7087",
        src: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
        title: "308744",
        artist: "TUBO COBRE RIG M 1 25mm X 20 6.1",
      },
      {
        color: "#1F7087",
        src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
        title: "308740",
        artist: "TUBO COBRE RIG M 3/8 9mm X 20 6.1",
      },
    ],
  }),
  async mounted() {
    let self = this;
    self.getOpportunities();
  },
  methods: {
    getData(data) {
      this.distributor = {
        KUNNR: data.KUNNR,
        NAME1: data.NAME1,
        TYPE: "DISTRIBUIDOR",
      };
    },
    getSeller(data) {
      this.distributor = {
        KUNNR: data.PERNR,
        NAME1: data.NAME1,
        TYPE: "VENDEDOR",
      };
    },
    async getMaterial() {
      this.hasError = null;
      const exist = this.cart.some((item) => item.codigo_material == this.code);
      if (exist) {
        this.hasError = "El código ingresado ya está en el carrito.";
      } else if (this.code === "" || this.code === null) {
        this.hasError = "El campo CÓDIGO DE MATERIAL es obligatorio.";
      } else if (this.units == "" || this.units == null) {
        this.hasError = "El campo UNIDADES es obligatorio.";
      } else {
        this.dialogLoading = true;
        await axios
          .post("getMaterial", {
            code: this.code,
            units: this.units,
            idCliente: "0000001068",
            vendedor: "02542156",
            puesto: "V",
            VKORG: "IUS2",
            VTWEG: "PR",
          })
          .then((response) => {
            this.dialogLoading = false;
            this.hasError = response.data.mensaje_error;
            if (this.hasError === "") {
              this.cart.push(response.data.cadena_result);
              this.code = null;
              this.units = null;
            }
          })
          .catch((error) => {
            this.dialogLoading = false;
            this.hasError = error;
          })
          .finally(() => (this.dialogLoading = false));
      }
    },
    deleteItem(index) {
      this.cart.splice(index, 1);
    },
    async getOpportunities() {
      this.dialogLoading = true;
      await axios
        .post("getOpportunities", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.dialogLoading = false;
          this.data = response.data;
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    async getDistributors(id_oportunidad) {
      this.dialogLoading = true;
      await axios
        .post("getDistributors", {
          id: id_oportunidad,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.distributor = null;
          this.assigned = response.data;
          let list = this.assigned.length;
          for (let i = 0; i < list; i++) {
            this.distributors.push({
              KUNNR: this.assigned[i].idIusa,
              NAME1: this.assigned[i].nombre,
              TYPE: "DISTRIBUIDOR",
            });
          }
          console.log(this.distributors);
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    async setOrder() {
      this.dialogLoading = true;
      await axios
        .post("setOrder", {
          idUsuario: this.value.id,
          nombreUsuario: this.value.nombre,
          idDistribuidor: this.distributor.KUNNR,
          nombreDistribuidor: this.distributor.NAME1,
          type: this.distributor.TYPE,
          orden_compra: this.name,
          promotor_id: localStorage.getItem("id"),
          list: this.cart,
          VKORG: "IUS2",
          VTWEG: "PR",
        })
        .then((response) => {
          this.dialogLoading = false;
          this.order = response.data;
          this.snackbar = true;
          this.textAlert = "Orden " + this.order + " generada!";
          this.snackbarOut();
          this.cart = [];
          this.value = null;
          this.name = null;
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
