<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="lista_types"
        item-text="label"
        item-value="id"
        dense
        outlined
        hide-details
        class="ma-2"
        label="Tipo"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-card height="400">
      <v-calendar
        ref="calendar"
        v-model="focus"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-threshold="30"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        :weekday-format="myDayFormat"
      ></v-calendar>
      <v-btn
        color="success"
        fab
        large
        absolute
        dark
        bottom
        right
        class="v-btn--example"
        @click="abrirCrearCita()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card>

    <v-dialog fullscreen v-model="mostrarDetalle">
      <v-card>
        <v-toolbar dark :color="selectedEvent.class">
          <v-btn icon dark @click="mostrarDetalle = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <label>Fecha: {{ selectedEvent.fecha }}</label
          ><br />
          <label>Hora inicio: {{ selectedEvent.hora_inicio }}</label
          ><br />
          <label>Hora fin: {{ selectedEvent.hora_fin }}</label
          ><br />

          <label v-if="selectedEvent.descripcion_detalle"
            >Detalle:
            {{ selectedEvent.descripcion_detalle }}
          </label>
          <br />

          <label v-if="selectedEvent.tipo_cita == 'Cita prospecto'">
            Prospecto: ({{ selectedEvent.cliente }}) -
            {{ selectedEvent.nombre_cliente }}
          </label>
          <br />
          <label v-if="selectedEvent.forma_contacto">
            Forma de contacto: {{ selectedEvent.forma_contacto }}
          </label>
          <br />
          <label v-if="selectedEvent.objetivo_contacto">
            Objetivo de contacto: {{ selectedEvent.objetivo_contacto }}
          </label>
          <br />

          <v-btn
            rounded
            block
            color="success"
            dark
            @click="iniciarCheckIn"
            v-if="
              selectedEvent.forma_contacto == 'Visita' &&
              !selectedEvent.checkin &&
              selectedEvent.cita_grupal != 1
            "
          >
            Iniciar Check In
          </v-btn>

          <v-alert
            type="warning"
            v-if="selectedEvent.checkin && !selectedEvent.checkout"
          >
            Se a iniciado Check In
          </v-alert>

          <v-btn
            rounded
            block
            color="success"
            dark
            @click="dialog_check_out = true"
            v-if="
              selectedEvent.checkin &&
              !selectedEvent.checkout &&
              selectedEvent.cita_grupal != 1
            "
          >
            Check out
          </v-btn>

          <label
            v-if="
              selectedEvent.observacion_final &&
              selectedEvent.observacion_final != null &&
              selectedEvent.observacion_final != 'null'
            "
            >Observaciones Finales:
            {{ selectedEvent.observacion_final }}
          </label>

          <v-btn
            rounded
            block
            color="success"
            dark
            @click="finalizarTarea(selectedEvent)"
            v-if="
              selectedEvent.tipo_cita != 'Cita personal' &&
              selectedEvent.forma_contacto != 'Visita' &&
              !selectedEvent.finalizo &&
              selectedEvent.cita_grupal != 1
            "
          >
            Concluir Tarea
          </v-btn>

          <v-alert
            type="warning"
            v-if="selectedEvent.checkin && selectedEvent.checkout"
          >
            Se a terminado la visita.
          </v-alert>

          <v-alert
            type="warning"
            v-if="
              selectedEvent.tipo_cita != 'Cita personal' &&
              selectedEvent.forma_contacto != 'Visita' &&
              selectedEvent.finalizo
            "
          >
            Se a concluido la tarea.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            dark
            @click="dialog_borrar = true"
            v-if="
              !selectedEvent.checkin &&
              !selectedEvent.checkout &&
              !selectedEvent.finalizo &&
              selectedEvent.class != 'cita_grupal'
            "
          >
            Eliminar cita
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_borrar" max-width="500px">
      <v-card>
        <v-card-title class="borrar-cita-header"> Eliminar Cita </v-card-title>
        <v-card-text>
          <v-alert type="warning" v-if="alertaCita3">
            {{ alertaCita3 }}
          </v-alert>

          <v-text-field
            v-model="motivo_eliminacion"
            label="Motivo de eliminación"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="danger" text @click="dialog_borrar = false">
            Cerrar
          </v-btn>
          <v-btn class="borrar-cita-header" @click="borrarCita()">
            Eliminar Cita
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_check_out" max-width="500px">
      <v-card>
        <v-card-title class="crear-cita-header">
          Confirmar CheckOut
        </v-card-title>
        <v-card-text>
          <v-alert type="warning" v-if="alertaCita2">
            {{ alertaCita2 }}
          </v-alert>

          <v-text-field
            v-model="descripcion_final"
            label="Observaciones"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="danger" text @click="dialog_check_out = false">
            Cerrar
          </v-btn>
          <v-btn class="success" @click="confirmarCheckOut()">
            Confirmar CheckOut
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog fullscreen v-model="mostrarCrearCita">
      <v-card>
        <v-toolbar dark color="#4eb254">
          <v-btn icon dark @click="mostrarCrearCita = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>&nbsp;Crear Cita</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-alert type="warning" v-if="alertaCita">
            {{ alertaCita }}
          </v-alert>

          <v-form ref="form">
            <v-text-field
              v-model="asunto"
              label="Titulo"
              required
            ></v-text-field>

            <v-select
              v-model="tipo_evento"
              :items="lista_tipo"
              item-text="label"
              item-value="id"
              label="Tipo"
              single-line
            ></v-select>

            <v-dialog
              ref="dialogf"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fecha_inicio"
                  label="Fecha"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fecha_inicio" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialogf.save(fecha_inicio)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>

            <v-dialog
              ref="dialogH1"
              v-model="modal2"
              :return-value.sync="hora_inicio"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="hora_inicio"
                  label="Hora de inicio"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker v-if="modal2" v-model="hora_inicio" full-width>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal2 = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialogH1.save(hora_inicio)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>

            <v-dialog
              ref="dialogH2"
              v-model="modal3"
              :return-value.sync="hora_termino"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="hora_termino"
                  label="Hora fin"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker v-if="modal3" v-model="hora_termino" full-width>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal3 = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialogH2.save(hora_termino)"
                >
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>

            <v-autocomplete
              filled
              rounded
              v-model="cliente_seleccionado"
              :items="ListaProspecto"
              return-object
              item-text="nombre"
              label="Prospectos"
              v-if="ListaProspecto && tipo_evento == 'prospecto'"
            ></v-autocomplete>

            <v-select
              v-model="cliente_forma"
              :items="lista_contacto"
              label="Forma de Contacto"
              single-line
              v-if="tipo_evento == 'prospecto'"
            ></v-select>

            <v-select
              v-model="cliente_objetivo"
              :items="lista_objetivo"
              label="Objetivo de contacto"
              single-line
              v-if="tipo_evento == 'prospecto'"
            ></v-select>

            <v-textarea
              v-model="descripcion_agenda"
              label="Descripción"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded block color="success" dark @click="crearNuevaCita">
            Crear cita
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
.prospecto {
  background-color: #4eb254;
  border: 1px solid #4eb254;
  color: #fff;
}
.crear-cita-header {
  background-color: #4eb254;
  border: 1px solid #4eb254;
  color: #fff;
}
.borrar-cita-header {
  background-color: #bb3434;
  border: 1px solid #bb3434;
  color: #fff;
}
.personal {
  background-color: rgba(255, 166, 83, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}
.finalizado {
  background-color: #41bbf3;
  border: 1px solid #41bbf3;
  color: #fff;
}
</style>

<script>
import axios from "axios";

export default {
  data: () => ({
    type: "month",
    types: ["month", "week", "day", "4day"],
    lista_types: [
      { id: "month", label: "Mes" },
      { id: "week", label: "Semana" },
      { id: "day", label: "Dia" },
    ],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    events: [],
    focus: "",
    selectedEvent: [],
    mostrarDetalle: false,
    mostrarCrearCita: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    fecha_inicio: "",
    asunto: "",
    tipo_evento: "personal",
    lista_tipo: [{ id: "personal", label: "Personal" }],
    modal: false,
    modal2: false,
    modal3: false,
    hora_inicio: "",
    hora_termino: "",
    cliente_forma: "",
    lista_contacto: [
      "Visita",
      "Llamada",
      "Correo",
      "VideoConferencia",
      "Whatsapp",
      "Skype",
    ],
    cliente_objetivo: "",
    lista_objetivo: [
      "Prospectación",
      "Venta",
      "Seguimiento pedidos",
      "Cobranza",
      "Contacto Técnico",
      "Capacitación",
      "Reunión",
    ],
    descripcion: "",
    descripcion_agenda: "",
    ListaProspecto: [],
    cliente_seleccionado: "",
    alertaCita: "",
    nuevo_date: "",
    nuevo_date_segundo: "",
    dialog_borrar: false,
    motivo_eliminacion: "",
    alertaCita3: "",
    dialog_check_out: false,
    descripcion_final: "",
    alertaCita2: "",
  }),
  async mounted() {
    let self = this;
    self.getEvents();
    self.getOpportunitiesProspecto();
  },
  methods: {
    async getEvents() {
      await axios
        .post("getEvents", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.events = response.data;
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    async getOpportunitiesProspecto() {
      await axios
        .post("getProspects", {
          id: localStorage.getItem("id"),
        })
        .then((response) => {
          this.ListaProspecto = response.data;
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
    myDayFormat(day) {
      if (day.weekday == 0) {
        return "Do.";
      }
      if (day.weekday == 1) {
        return "Lu.";
      }
      if (day.weekday == 2) {
        return "Ma.";
      }
      if (day.weekday == 3) {
        return "Mi.";
      }
      if (day.weekday == 4) {
        return "Ju.";
      }
      if (day.weekday == 5) {
        return "Vi.";
      }
      if (day.weekday == 6) {
        return "Sá.";
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    showEvent({ event }) {
      this.selectedEvent = event;
      this.mostrarDetalle = true;
    },
    abrirCrearCita() {
      this.mostrarCrearCita = true;
    },
    crearNuevaCita() {
      if (this.asunto == null || this.asunto == "") {
        this.alertaCita = "Es necesario poner título";
      } else if (this.tipo_evento == null || this.tipo_evento == "") {
        this.alertaCita = "Es necesario seleccionar tipo";
      } else if (this.fecha_inicio == null || this.fecha_inicio == "") {
        this.alertaCita = "Es necesario seleccionar fecha";
      } else if (this.hora_inicio == null || this.hora_inicio == "") {
        this.alertaCita = "Es necesario seleccionar hora de inicio";
      } else if (this.hora_termino == null || this.hora_termino == "") {
        this.alertaCita = "Es necesario seleccionar hora de termino";
      } else if (
        this.tipo_evento == "prospecto" &&
        this.cliente_seleccionado == ""
      ) {
        this.alertaCita = "Es necesario seleccionar un prospecto";
      } else if (this.tipo_evento == "prospecto" && this.cliente_forma == "") {
        this.alertaCita = "Es necesario seleccionar una forma de contacto";
      } else if (
        this.tipo_evento == "prospecto" &&
        this.cliente_objetivo == ""
      ) {
        this.alertaCita = "Es necesario seleccionar un objetivo de contacto";
      } else {
        this.nuevo_date = this.fecha_inicio + " " + this.hora_inicio;
        this.nuevo_date_segundo = this.fecha_inicio + " " + this.hora_termino;
        if (this.tipo_evento == "personal") {
          this.descripcion = '<i class="fa fa-home" aria-hidden="true"></i>';
          var mieventonuevo = {
            start: this.nuevo_date,
            end: this.nuevo_date_segundo,
            name: this.asunto,
            content: this.descripcion,
            color: this.tipo_evento,
            cliente: this.cliente_seleccionado.id,
            nombre_cliente: this.cliente_seleccionado.nombre,
            lat_cliente: this.cliente_seleccionado.latitud,
            lon_cliente: this.cliente_seleccionado.longitud,
            tipo_cita: "Cita personal",
            descripcion_detalle: this.descripcion_agenda,
            fecha: this.fecha_inicio,
            hora_inicio: this.hora_inicio,
            hora_fin: this.hora_termino,
            cliente_forma: this.cliente_forma,
            cliente_objetivo: this.cliente_objetivo,
            id_promotor: localStorage.getItem("id"),
            class: "rgb(233, 136, 46)",
          };
          var formData = new FormData();
          formData.append("start", this.nuevo_date);
          formData.append("end", this.nuevo_date_segundo);
          formData.append("name", this.asunto);
          formData.append("content", this.descripcion);
          formData.append("color", this.tipo_evento);
          formData.append("class", "rgb(233, 136, 46)");
          formData.append("cliente", this.cliente_seleccionado.id);
          formData.append("nombre_cliente", this.cliente_seleccionado.nombre);
          formData.append("lat_cliente", this.cliente_seleccionado.latitud);
          formData.append("lon_cliente", this.cliente_seleccionado.longitud);
          formData.append("tipo_cita", "Cita personal");
          formData.append("descripcion_detalle", this.descripcion_agenda);
          formData.append("fecha", this.fecha_inicio);
          formData.append("hora_inicio", this.hora_inicio);
          formData.append("hora_fin", this.hora_termino);
          formData.append("cliente_forma", this.cliente_forma);
          formData.append("cliente_objetivo", this.cliente_objetivo);
          formData.append("id_promotor", localStorage.getItem("id"));
          //guardar el id
          axios
            .post("crearNuevaCita", formData, {
              id: localStorage.getItem("id"),
            })
            .then((response) => {
              mieventonuevo = response.data;
              this.events.push(mieventonuevo);
              this.mostrarCrearCita = false;
              this.limpiarFormulario();
            })
            .catch((error) => {
              alert(error);
            })
            .finally(() => (this.loading = false));
        } else if (this.tipo_evento == "prospecto") {
          if (this.cliente_forma == "Visita") {
            this.descripcion =
              '<i class="fa fa-handshake-o" aria-hidden="true"></i><br>Reunion con prospecto';
          } else if (this.cliente_forma == "Llamada") {
            this.descripcion =
              '<i class="fa fa-phone" aria-hidden="true"></i><br>Llamada con prospecto';
          } else if (this.cliente_forma == "Correo") {
            this.descripcion =
              '<i class="fa fa-envelope-o" aria-hidden="true"></i><br>Correo con prospecto';
          } else if (this.cliente_forma == "VideoConferencia") {
            this.descripcion =
              '<i class="fa fa-video-camera" aria-hidden="true"></i><br>VideoConferencia con prospecto';
          } else if (this.cliente_forma == "Whatsapp") {
            this.descripcion =
              '<i class="fa fa-whatsapp" aria-hidden="true"></i><br>Whatsapp con prospecto';
          } else if (this.cliente_forma == "Skype") {
            this.descripcion =
              '<i class="fa fa-skype" aria-hidden="true"></i><br>Skype con prospecto';
          } else if (this.cliente_forma == "Twitter") {
            this.descripcion =
              '<i class="fa fa-twitter" aria-hidden="true"></i><br>Twitter con prospecto';
          }
          var mieventonuevo1 = {
            start: this.nuevo_date,
            end: this.nuevo_date_segundo,
            name: this.asunto,
            content: this.descripcion,
            color: this.tipo_evento,
            class: "#4eb254",
            cliente: this.cliente_seleccionado.id,
            nombre_cliente: this.cliente_seleccionado.nombre,
            lat_cliente: this.cliente_seleccionado.latitud,
            lon_cliente: this.cliente_seleccionado.longitud,
            tipo_cita: "Cita prospecto",
            descripcion_detalle: this.descripcion_agenda,
            fecha: this.fecha_inicio,
            hora_inicio: this.hora_inicio,
            hora_fin: this.hora_termino,
            cliente_forma: this.cliente_forma,
            cliente_objetivo: this.cliente_objetivo,
            id_promotor: localStorage.getItem("id"),
          };
          var formData1 = new FormData();
          formData1.append("start", this.nuevo_date);
          formData1.append("end", this.nuevo_date_segundo);
          formData1.append("name", this.asunto);
          formData1.append("content", this.descripcion);
          formData1.append("color", this.tipo_evento);
          formData1.append("class", "#4eb254");
          formData1.append("cliente", this.cliente_seleccionado.id);
          formData1.append("nombre_cliente", this.cliente_seleccionado.nombre);
          formData1.append("lat_cliente", this.cliente_seleccionado.latitud);
          formData1.append("lon_cliente", this.cliente_seleccionado.longitud);
          formData1.append("tipo_cita", "Cita personal");
          formData1.append("descripcion_detalle", this.descripcion_agenda);
          formData1.append("fecha", this.fecha_inicio);
          formData1.append("hora_inicio", this.hora_inicio);
          formData1.append("hora_fin", this.hora_termino);
          formData1.append("cliente_forma", this.cliente_forma);
          formData1.append("cliente_objetivo", this.cliente_objetivo);
          formData1.append("id_promotor", localStorage.getItem("id"));
          //guardar el id
          axios
            .post("crearNuevaCita", formData1, {
              id: localStorage.getItem("id"),
            })
            .then((response) => {
              mieventonuevo1 = response.data;
              this.events.push(mieventonuevo1);
              this.mostrarCrearCita = false;
              this.limpiarFormulario();
            })
            .catch((error) => {
              alert(error);
            })
            .finally(() => (this.loading = false));
        }
      }
    },
    limpiarFormulario() {
      //vovler valores del formulario en blanco
      this.asunto = "";
      this.fecha_inicio = "";
      this.hora_inicio = "";
      this.nuevo_date = "";
      this.hora_termino = "";
      this.nuevo_date_segundo = "";
      this.descripcion = "";
      this.cliente_seleccionado = "";
      this.descripcion_agenda = "";
      this.cliente_forma = "";
      this.cliente_objetivo = "";
      this.alertaCita = null;
    },
    borrarCita() {
      if (this.motivo_eliminacion == null || this.motivo_eliminacion == "") {
        this.alertaCita3 = "Es necesario poner un motivo de eliminación";
      } else {
        axios
          .post("borrarCita", {
            cita_id: this.selectedEvent.id,
            motivo: this.motivo_eliminacion,
          })
          .then((response) => {
            console.log(response);
            this.dialog_borrar = false;
            this.mostrarDetalle = false;
            for (var buscador in this.events) {
              var plan1_1 = this.events[buscador];
              if (plan1_1.id == this.selectedEvent.id) {
                this.events.splice(buscador, 1);
              }
            }
          })
          .catch((error) => {
            alert(error);
          })
          .finally(() => (this.loading = false));
      }
    },
    iniciarCheckIn() {
      let me = this;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          axios
            .post("./agendaActivarCheckIn", {
              cita_id: me.selectedEvent.id,
              latitud: pos.coords.latitude,
              longitud: pos.coords.longitude,
            })
            .then(function () {
              // handle success
              me.selectedEvent.checkin = 1;
              for (var buscador in me.events) {
                var plan1_1 = me.events[buscador];
                if (plan1_1.id == me.selectedEvent.id) {
                  me.events[buscador] = me.selectedEvent;
                }
              }
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    confirmarCheckOut() {
      if (this.descripcion_final == null || this.descripcion_final == "") {
        this.alertaCita2 = "Es necesario poner una descripción";
      } else {
        let me = this;
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            axios
              .post("./agendaActivarCheckOut", {
                cita_id: me.selectedEvent.id,
                latitud: pos.coords.latitude,
                longitud: pos.coords.longitude,
                descripcion_final: me.descripcion_final,
              })
              .then(function () {
                // handle success
                me.dialog_check_out = false;
                me.alertaCita2 = "";
                me.selectedEvent.color = "finalizado";
                me.selectedEvent.checkout = 1;
                me.selectedEvent.finalizo = 1;
                me.selectedEvent.class = "#41bbf3";
                me.selectedEvent.observacion_final = me.descripcion_final;
                for (var buscador in me.events) {
                  var plan1_1 = me.events[buscador];
                  if (plan1_1.id == me.selectedEvent.id) {
                    me.events[buscador] = me.selectedEvent;
                  }
                }
                me.descripcion_final = null;
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
  },
};
</script>
