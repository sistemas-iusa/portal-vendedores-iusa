<template>
  <v-container fluid>
    <v-row>
      <v-toolbar dark color="error">
        <v-btn icon dark @click="volverRutas()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>&nbsp;Cancelar Oportunidad</v-toolbar-title>
      </v-toolbar>
    </v-row>
    <v-row>
      <p>
        ¿Esta seguro de cancelar la oportunidad {{ infoOportunity.nombre }}?
      </p>
      <br />
    </v-row>
    <v-row>
      <v-select
        :items="opcionSelect5"
        v-model="motivo"
        label="Motivo"
        @change="activarOtro()"
      >
      </v-select>
      <v-text-field
        v-model="otrosMotivo"
        label="Ingresar Otro"
        v-if="banderaOtros"
      ></v-text-field>
    </v-row>
    <v-row>
      <hr />
      <v-btn
        block
        color="error"
        dark
        @click="deleteOportunity()"
        :disabled="!motivo"
      >
        Cancelar Oportunidad
      </v-btn>
    </v-row>
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
  </v-container>
</template>

<script>
import axios from "axios";
import router from "../router";
export default {
  data: () => ({
    motivo: "",
    infoOportunity: [],
    opcionSelect5: ["El negocio ya no existe", "Reubicación de local", "Otro"],
    otrosMotivo: null,
    banderaOtros: false,
    loading: true,
    snackbar: false,
    textAlert: null,
  }),
  async mounted() {
    let self = this;
    self.getInfoOpportunity();
  },
  methods: {
    async getInfoOpportunity() {
      await axios
        .post("getOpportunity", {
          id: this.$route.params.id,
        })
        .then((response) => {
          this.infoOportunity = response.data[0];
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    activarOtro() {
      this.banderaOtros = false;
      this.otrosMotivo = null;
      if (this.motivo == "Otro") {
        this.banderaOtros = true;
      } //fin if
    },
    deleteOportunity() {
      let me = this;
      me.loading = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (me.otrosMotivo != null) {
            me.motivo = me.otrosMotivo;
          }
          axios
            .post("./deleteOportunity", {
              idOportunidad: me.$route.params.id,
              idPromotor: localStorage.getItem("id"),
              motivo: me.motivo,
              latitud: pos.coords.latitude,
              longitud: pos.coords.longitude,
            })
            .then(function () {
              // handle success
              me.loading = false;
              router.replace("/routes");
            })
            .catch(function (error) {
              // handle error
              me.loading = false;
              console.log(error);
            });
        },
        (err) => {
          me.snackbar = true;
          me.textAlert = "Activar GPS";
          me.snackbarOut();
          console.log(err);
        }
      );
    },
    volverRutas() {
      router.replace("/routes");
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
