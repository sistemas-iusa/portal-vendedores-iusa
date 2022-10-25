<template>
  <v-container fluid>
    <!-- <h1>Opportunities page</h1> -->
    <template>
      <v-card>
        <v-card-title>Perfil de usuario</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="2">
              <v-row
                class="d-flex justify-center"
                v-if="data.image_perfil == null"
              >
                <v-avatar size="80">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
                  ></v-img>
                </v-avatar>
              </v-row>
              <v-row
                class="d-flex justify-center"
                v-if="data.image_perfil != null"
              >
                <v-avatar size="80">
                  <v-img :src="$hostImage + data.image_perfil"></v-img>
                </v-avatar>
              </v-row>
              <v-divider class="mx-4"></v-divider>
              <v-row class="d-flex justify-center">
                <v-btn color="primary" @click="dialogUpdateImage = true">
                  Subir Foto
                </v-btn>
              </v-row>
            </v-col>
            <v-col cols="12" md="10">
              <div>
                <v-text-field label="Nombre" v-model="data.name"></v-text-field>
              </div>
              <div>
                <v-text-field
                  label="Correo"
                  v-model="data.email"
                  disabled
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  label="Sucursal"
                  v-model="data.sucursal"
                ></v-text-field>
              </div>
              <div>
                <v-text-field
                  label="Telefono"
                  v-model="data.telefono"
                ></v-text-field>
              </div>
              <v-card-actions>
                <v-btn color="success" @click="updateUser()">
                  Guardar Cambios
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <!-- Dialog routeAsing -->
    <v-row justify="center">
      <v-dialog
        v-model="dialogUpdateImage"
        persistent
        scrollable
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">Subir Foto</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-file-input
                v-model="imagen_perfil"
                accept="image/png, image/jpeg"
                placeholder="Selecciona imagen"
                prepend-icon="mdi-camera"
                label="Avatar"
              ></v-file-input>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="(dialogUpdateImage = false), (imagen_perfil = null)"
            >
              Cerrar
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateImageUser()"
              v-if="imagen_perfil != null"
            >
              Cambiar Foto
            </v-btn>
          </v-card-actions>
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
    <!-- SnackBar -->
    <v-snackbar v-model="snackbar">
      {{ textAlert }}
      <v-btn color="pink" text @click="snackbar = false"> Cerrar </v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  data: () => ({
    data: [],
    loading: false,
    dialogUpdateImage: false,
    imagen_perfil: null,
    snackbar: false,
    textAlert: null,
  }),
  async mounted() {
    let self = this;
    self.getUserInfo();
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      changeUser: "auth/changeUser",
    }),
    async getUserInfo() {
      this.loading = true;
      await axios
        .post("getUserInfo", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.data = response.data;
          this.changeUser(this.data);
          this.loading = false;
        })
        .catch((error) => {
          alert(error);
          this.loading = false;
        })
        .finally(() => (this.loading = false));
    },
    updateUser() {
      this.loading = true;
      axios
        .post("updateUser", {
          id: localStorage.getItem("id"),
          name: this.data.name,
          email: this.data.email,
          type: this.data.type,
          sucursal: this.data.sucursal,
          telefono: this.data.telefono,
        })
        .then((response) => {
          this.loading = false;
          this.snackbar = true;
          this.textAlert = "Promotor " + response.data.name + " Actualizado";
          this.snackbarOut();
          this.data = [];
          this.getUserInfo();
        })
        .catch((error) => {
          alert(error);
          this.loading = false;
        })
        .finally(() => (this.loading = false));
    },
    async updateImageUser() {
      var fd = new FormData();
      var foto = this.imagen_perfil;
      var idUser = localStorage.getItem("id");
      fd.append("idUser", idUser);
      fd.append("foto", foto);
      this.loading = true;
      await axios
        .post("updateImageUser", fd)
        .then((response) => {
          this.loading = false;
          this.snackbar = true;
          this.textAlert = "Promotor " + response.data.name + " Actualizado";
          this.snackbarOut();

          this.data = [];
          this.dialogUpdateImage = false;
          this.imagen_perfil = null;
          this.getUserInfo();
        })
        .catch((error) => {
          this.snackbar = true;
          console.log(error);
          this.textAlert = "Imagen no aceptada , debe de ser menos de 2MB ";
          this.snackbarOut();
          this.loading = false;
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
