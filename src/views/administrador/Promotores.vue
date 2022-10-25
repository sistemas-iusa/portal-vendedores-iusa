<template>
  <v-container fluid>
    <template>
      <v-btn color="success" @click="dialogCreateUser = true">
        <v-icon> mdi-plus </v-icon>
        Crear nuevo usuario
      </v-btn>
      <v-divider></v-divider>
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
        <template v-slot:[`item.type`]="{ item }" align="center">
          <p v-if="item.type == '1'">Promo Vendedor</p>
          <p v-if="item.type == '2'">Administrador</p>
          <p v-if="item.type == '3'">Coordinador</p>
          <p v-if="item.type == '4'">Supervisor</p>
        </template>
        <template v-slot:[`item.estatus`]="{ item }" align="center">
          <p v-if="item.estatus == '1'">Alta</p>
          <p v-if="item.estatus == '2'">Baja</p>
        </template>
        <template v-slot:[`item.actions`]="{ item }" align="center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="altaUsuario(item)"
                style="color: #91ec15"
                v-if="item.estatus == '2'"
              >
                mdi-arrow-up
              </v-icon>
            </template>
            <span>Alta usuario</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="bajaUsuario(item)"
                style="color: #dc3545"
                v-if="item.estatus == '1'"
              >
                mdi-arrow-down
              </v-icon>
            </template>
            <span>Baja usuario</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="modificPassword(item)"
                style="color: #2e8ec4"
              >
                mdi-account-key
              </v-icon>
            </template>
            <span>Cambiar contraseña</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="modificUser(item)"
                style="color: #ffc300"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Modificar usuario</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                large
                class="mr-2"
                @click="eliminarUsuario(item)"
                style="color: #dc3545"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar usuario</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <!-- Dialog createUser -->
      <v-row justify="center">
        <v-dialog
          v-model="dialogCreateUser"
          persistent
          scrollable
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Crear Usuario</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <form>
                  <v-row>
                    <v-text-field
                      v-model="name"
                      :rules="[reglasCreateUser.required, reglasCreateUser.min]"
                      label="Nombre"
                      required
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                      filled
                      label="Tipo Usuario"
                      :items="typeUsers"
                      item-text="name"
                      item-value="id"
                      v-model="type"
                      style="margin-bottom: -27px"
                    >
                    </v-autocomplete>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="sucursal"
                        :rules="[reglasCreateUser.required]"
                        label="Sucursal"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="telefono"
                        :rules="[reglasCreateUser.required]"
                        label="Teléfono"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="employee_number"
                      :rules="[reglasCreateUser.required]"
                      label="Número de empleado"
                      required
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="email"
                      :rules="[
                        reglasCreateUser.required,
                        reglasCreateUser.email,
                      ]"
                      label="Correo"
                      required
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      :rules="[reglasCreateUser.required, reglasCreateUser.min]"
                      label="Password"
                      hint="minimo 8 caracteres"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="password_confirmation"
                      :type="false ? 'text' : 'password'"
                      :rules="[reglaConfirmacionPassword()]"
                      label="Confirmar Password"
                      counter
                    ></v-text-field>
                  </v-row>
                </form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogCreateUser = false"
              >
                Cerrar
              </v-btn>
              <v-btn color="blue darken-1" text @click="createPromotor()">
                Crear Promotor
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog dialogModificUser -->
      <v-row justify="center">
        <v-dialog
          v-model="dialogModificUser"
          persistent
          scrollable
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Modificar Promotor</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <form>
                  <v-row>
                    <v-text-field
                      v-model="selectUser.name"
                      :rules="[reglasCreateUser.required, reglasCreateUser.min]"
                      label="Nombre"
                      required
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                      filled
                      label="Tipo Usuario"
                      :items="typeUsers"
                      item-text="name"
                      item-value="id"
                      v-model="selectUser.type"
                      style="margin-bottom: -27px"
                    >
                    </v-autocomplete>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="selectUser.employee_number"
                      :rules="[reglasCreateUser.required]"
                      label="Número de empleado"
                      required
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectUser.sucursal"
                        :rules="[reglasCreateUser.required]"
                        label="Sucursal"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectUser.telefono"
                        :rules="[reglasCreateUser.required]"
                        label="Teléfono"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="selectUser.email"
                      :rules="[
                        reglasCreateUser.required,
                        reglasCreateUser.email,
                      ]"
                      label="Correo"
                      required
                    ></v-text-field>
                  </v-row>
                </form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogModificUser = false"
              >
                Cerrar
              </v-btn>
              <v-btn color="blue darken-1" text @click="updatePromotor()">
                Modificar Promotor
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog dialogModificPassword -->
      <v-row justify="center">
        <v-dialog
          v-model="dialogModificPassword"
          persistent
          scrollable
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Modificar Password Promotor</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <form>
                  <v-row>
                    <v-text-field
                      v-model="password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      :rules="[reglasCreateUser.required, reglasCreateUser.min]"
                      label="Nuevo Password"
                      hint="minimo 8 caracteres"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="password_confirmation"
                      :type="false ? 'text' : 'password'"
                      :rules="[reglaConfirmacionPassword()]"
                      label="Confirmar Password"
                      counter
                    ></v-text-field>
                  </v-row>
                </form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="dialogModificPassword = false"
              >
                Cerrar
              </v-btn>
              <v-btn color="blue darken-1" text @click="updatePassword()">
                Actualizar Password
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog Alta-->
      <v-row justify="center">
        <v-dialog v-model="dialogAlta" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5"> Alta de cuenta </v-card-title>
            <v-card-text
              >Quiere dar de alta al usuario {{ selectUser.name }}</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogAlta = false">
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="altaPromotor()">
                Aceptar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog Baja-->
      <v-row justify="center">
        <v-dialog v-model="dialogBaja" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5"> Baja de cuenta </v-card-title>
            <v-card-text
              >Quiere dar de Baja al usuario {{ selectUser.name }}</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogBaja = false">
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="bajaPromotor()">
                Aceptar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /. Dialog -->
      <!-- Dialog Eliminar-->
      <v-row justify="center">
        <v-dialog v-model="dialogEliminar" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5"> ELIMINAR USUARIO </v-card-title>
            <v-card-text
              >Quiere Eliminar al usuario {{ selectUser.name }}</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialogEliminar = false"
              >
                Cancelar
              </v-btn>
              <v-btn color="green darken-1" text @click="deletePromotor()">
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
    </template>
  </v-container>
</template>
<script>
import axios from "axios";
//const mapMarker = require("../assets/oportunidades.svg");
export default {
  data: () => ({
    data: [],
    dialogLoading: false,
    search: "",
    headers: [
      { text: "ID", align: "start", value: "id" },
      { text: "NOMBRE", align: "start", value: "name" },
      { text: "Email", value: "email" },
      { text: "Tipo", value: "type" },
      { text: "Estatus", value: "estatus" },
      { text: "ACTIONS", value: "actions", sortable: false },
    ],
    dialogCreateUser: false,
    show1: false,
    name: "",
    sucursal: "",
    telefono: "",
    email: "",
    type: "",
    employee_number: "",
    password: "",
    password_confirmation: "",
    reglasCreateUser: {
      required: (value) => !!value || "Este campo es necesario.",
      min: (v) => v.length >= 8 || "Min 8 caracteres",
      email: (v) => /.+@.+\..+/.test(v) || "Ingresar correo valido",
    },
    selectUser: {},
    dialogModificUser: false,
    dialogModificPassword: false,
    dialogAlta: false,
    dialogBaja: false,
    dialogEliminar: false,
    typeUsers: [
      { id: "1", name: "Promo Vendedor" },
      { id: "2", name: "Administrador" },
      { id: "3", name: "Coordinador" },
      { id: "4", name: "Supervisor" },
    ],
  }),
  async mounted() {
    let self = this;
    self.getPromotores();
  },
  methods: {
    async getPromotores() {
      this.dialogLoading = true;
      this.data = [];
      await axios
        .post("getPromotoresAll", {
          id: localStorage.getItem("id"),
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
    reglaConfirmacionPassword() {
      if (this.password != this.password_confirmation) return "No coinciden";
    },
    createPromotor() {
      this.dialogLoading = true;
      axios
        .post("auth/createUser", {
          name: this.name,
          email: this.email,
          type: this.type,
          employee_number: this.employee_number,
          password: this.password,
          sucursal: this.sucursal,
          telefono: this.telefono,
        })
        .then((response) => {
          this.dialogLoading = false;
          alert("Usuario " + response.data.name + " creado");
          this.dialogCreateUser = false;
          this.name = "";
          this.sucursal = "";
          this.type = "";
          this.telefono = "";
          this.email = "";
          this.password = "";
          this.employee_number = "";
          this.password_confirmation = "";
          this.getPromotores();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    modificUser(item) {
      this.dialogModificUser = true;
      this.selectUser = item;
    },
    updatePromotor() {
      this.dialogLoading = true;
      axios
        .post("updateUser", {
          id: this.selectUser.id,
          name: this.selectUser.name,
          email: this.selectUser.email,
          type: this.selectUser.type,
          employee_number: this.selectUser.employee_number,
          sucursal: this.selectUser.sucursal,
          telefono: this.selectUser.telefono,
        })
        .then((response) => {
          this.dialogLoading = false;
          alert("Usuario " + response.data.name + " Actualizado");
          this.dialogModificUser = false;
          this.selectUser = "";
          this.getPromotores();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    modificPassword(item) {
      this.dialogModificPassword = true;
      this.selectUser = item;
    },
    updatePassword() {
      this.dialogLoading = true;
      axios
        .post("updatePassword", {
          id: this.selectUser.id,
          password: this.password,
        })
        .then((response) => {
          this.dialogLoading = false;
          alert("Usuario " + response.data.name + " Actualizado");
          this.dialogModificPassword = false;
          this.selectUser = "";
          this.password = "";
          this.password_confirmation = "";
          this.getPromotores();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    altaUsuario(item) {
      this.dialogAlta = true;
      this.selectUser = item;
    },
    altaPromotor() {
      this.dialogLoading = true;
      axios
        .post("altaPromotor", {
          id: this.selectUser.id,
        })
        .then((response) => {
          this.dialogLoading = false;
          alert("Promotor " + response.data.name + " Actualizado");
          this.dialogAlta = false;
          this.selectUser = "";
          this.getPromotores();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    bajaUsuario(item) {
      this.dialogBaja = true;
      this.selectUser = item;
    },
    bajaPromotor() {
      this.dialogLoading = true;
      axios
        .post("bajaPromotor", {
          id: this.selectUser.id,
        })
        .then((response) => {
          this.dialogLoading = false;
          alert("Usuario " + response.data.name + " Actualizado");
          this.dialogBaja = false;
          this.selectUser = "";
          this.getPromotores();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    eliminarUsuario(item) {
      this.dialogEliminar = true;
      this.selectUser = item;
    },
    deletePromotor() {
      this.dialogLoading = true;
      axios
        .post("deletePromotor", {
          id: this.selectUser.id,
        })
        .then((response) => {
          this.dialogLoading = false;
          alert("Usuario " + response.data.name + " ELIMINADO");
          this.dialogEliminar = false;
          this.selectUser = "";
          this.getPromotores();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
