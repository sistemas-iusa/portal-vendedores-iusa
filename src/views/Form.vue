<template>
  <v-container fluid>
    <v-row>
      <v-toolbar>
        <v-btn color="primary" icon dark @click="volverRutas()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>&nbsp;Encuesta</v-toolbar-title>
      </v-toolbar>
    </v-row>
    <v-row>
      <v-card style="width: 100%; height: auto">
        <v-card-text>
          <v-icon>mdi-store</v-icon>
          <strong>{{ infoOportunity.numero_ruta }}</strong>
          {{ infoOportunity.nombre }}
        </v-card-text>
      </v-card>
    </v-row>
    <v-row>
      <v-tabs v-model="tab" background-color="primary" show-arrows>
        <v-tab :key="0" :href="`#tab-0`">
          <v-icon left v-if="pregunta1"> mdi-check </v-icon>
          1
        </v-tab>
        <v-tab :key="1" :href="`#tab-1`">
          <v-icon left v-if="pregunta2"> mdi-check </v-icon>
          2
        </v-tab>
        <v-tab :key="2" :href="`#tab-2`">
          <v-icon left v-if="pregunta3"> mdi-check </v-icon>
          3
        </v-tab>
        <v-tab :key="3" :href="`#tab-3`" v-if="pregunta3 == 'NO'">
          <v-icon left v-if="pregunta4"> mdi-check </v-icon>
          4
        </v-tab>
        <v-tab :key="4" :href="`#tab-4`">
          <v-icon left v-if="pregunta5"> mdi-check </v-icon>
          5
        </v-tab>
        <v-tab :key="5" :href="`#tab-5`">
          <v-icon left v-if="pregunta6"> mdi-check </v-icon>
          6
        </v-tab>
        <v-tab :key="6" :href="`#tab-6`">
          <v-icon left v-if="pregunta7"> mdi-check </v-icon>
          7
        </v-tab>
        <v-tab :key="7" :href="`#tab-7`" v-if="pregunta7 == 'SI'">
          <v-icon left v-if="pregunta8"> mdi-check </v-icon>
          8
        </v-tab>
        <v-tab :key="8" :href="`#tab-8`">
          <v-icon left v-if="pregunta9"> mdi-check </v-icon>
          9
        </v-tab>
        <v-tab :key="9" :href="`#tab-9`">
          <v-icon left v-if="pregunta10"> mdi-check </v-icon>
          10
        </v-tab>
        <v-tab :key="10" :href="`#tab-10`">
          <v-icon left v-if="pregunta11"> mdi-check </v-icon>
          11
        </v-tab>
        <v-tab :key="11" :href="`#tab-11`">
          <v-icon left v-if="pregunta12"> mdi-check </v-icon>
          12
        </v-tab>

        <br />
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0" :value="`tab-0`">
            <v-card flat>
              <v-card-text>
                <br />
                <p>1.- ¿Actualmente vende productos de la marca IUSA?</p>
                <br />
                <v-row no-gutters>
                  <v-col>
                    <v-btn
                      :color="tabColor1('SI')"
                      block
                      @click="pregunta1 = 'SI'"
                    >
                      SI
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      :color="tabColor1('NO')"
                      block
                      @click="pregunta1 = 'NO'"
                    >
                      NO
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="pregunta1">
                  <br />
                  <v-btn color="success" block @click="tab = `tab-1`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="1" :value="`tab-1`">
            <v-card flat>
              <v-card-text>
                <br />
                <p>
                  2.- ¿Actualmente lo atiende o visita un distribuidor que le
                  ofrezca productos para surtir su negocio?
                </p>
                <br />
                <v-row no-gutters>
                  <v-col>
                    <v-btn
                      :color="tabColor2('SI')"
                      block
                      @click="
                        (pregunta2 = 'SI'), (dialogDistribuidorIusa = true)
                      "
                    >
                      SI
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      :color="tabColor2('NO')"
                      block
                      @click="
                        (pregunta2 = 'NO'), (dialogDistribuidorOtro = true)
                      "
                    >
                      NO
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="d-flex justify-center" v-if="pregunta2">
                  <v-btn
                    color="primary"
                    class="ma-2"
                    dark
                    @click="ventana_distribuidores = true"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Distribuidores asociados
                  </v-btn>
                </v-row>
                <v-row class="d-flex justify-center">
                  <h6 v-if="distribuidores.length != 0">
                    Distribuidores asignados
                    <strong>{{ distribuidores.length }}</strong>
                  </h6>
                </v-row>
                <v-row v-if="pregunta2">
                  <v-btn color="success" block @click="tab = `tab-2`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="2" :value="`tab-2`">
            <v-card flat>
              <v-card-text>
                <br />
                <p>
                  3.- ¿Estaría interesado en ser visitado frecuentemente por un
                  promotor para ayudarle a gestionar sus pedidos de productos
                  IUSA con un distribuidor?
                </p>
                <br />
                <v-row no-gutters>
                  <v-col>
                    <v-btn
                      :color="tabColor3('SI')"
                      block
                      @click="pregunta3 = 'SI'"
                    >
                      SI
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      :color="tabColor3('NO')"
                      block
                      @click="pregunta3 = 'NO'"
                    >
                      NO
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="pregunta3">
                  <v-btn
                    color="success"
                    block
                    v-if="pregunta3 == 'SI'"
                    @click="tab = `tab-4`"
                  >
                    Siguiente
                  </v-btn>
                  <v-btn
                    color="success"
                    block
                    v-if="pregunta3 == 'NO'"
                    @click="tab = `tab-3`"
                  >
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="3" :value="`tab-3`">
            <v-card flat>
              <v-card-text>
                <br />
                <p>
                  4.- ¿Por qué razón no está interesado en ser visitado
                  frecuentemente por un promotor?
                </p>
                <br />
                <v-radio-group v-model="pregunta4">
                  <v-radio
                    v-for="n in opcionSelect4"
                    :key="n"
                    :label="`${n}`"
                    :value="n"
                  ></v-radio>
                </v-radio-group>
                <v-row class="d-flex justify-center" v-if="pregunta4">
                  <h3><strong>¿Desea terminar la encuesta?</strong></h3>
                  <v-btn color="error" dark @click="dialog_borrar = true">
                    Terminar Encuesta
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="4" :value="`tab-4`">
            <v-card flat>
              <v-card-text>
                <br />
                <p>5.- ¿Qué líneas de productos vende su negocio?</p>
                <br />
                <v-select
                  :items="opcionSelect5"
                  v-model="pregunta5"
                  chips
                  multiple
                  @change="activarOtro5()"
                >
                </v-select>
                <v-text-field
                  v-model="otrosPregunta5"
                  label="Ingresar Otro"
                  v-if="banderaOtros5"
                ></v-text-field>
                <v-row v-if="pregunta5">
                  <v-btn color="success" block @click="tab = `tab-5`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="5" :value="`tab-5`">
            <v-card flat>
              <v-card-text>
                <br />
                <p>
                  6.- ¿De qué líneas de producto IUSA le gustaría hacer un
                  pedido sugerido?
                </p>
                <br />
                <v-select
                  :items="opcionSelect6"
                  v-model="pregunta6"
                  chips
                  multiple
                >
                </v-select>
                <v-row v-if="pregunta6">
                  <v-btn color="success" block @click="tab = `tab-6`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="6" :value="`tab-6`">
            <v-card flat>
              <v-card-text>
                <br />
                <p>
                  7.- ¿Le gustaría que le coloquemos publicidad de IUSA en su
                  negocio?
                </p>
                <br />
                <v-row no-gutters>
                  <v-col>
                    <v-btn
                      :color="tabColor7('SI')"
                      block
                      @click="pregunta7 = 'SI'"
                    >
                      SI
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      :color="tabColor7('NO')"
                      block
                      @click="pregunta7 = 'NO'"
                    >
                      NO
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="pregunta7">
                  <v-btn
                    color="success"
                    block
                    v-if="pregunta7 == 'SI'"
                    @click="tab = `tab-7`"
                  >
                    Siguiente
                  </v-btn>
                  <v-btn
                    color="success"
                    block
                    v-if="pregunta7 == 'NO'"
                    @click="tab = `tab-8`"
                  >
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="7" :value="`tab-7`">
            <v-card flat>
              <v-card-text>
                <p>
                  8.- ¿Qué tipo de publicidad le gustaría tener en su negocio?
                </p>
                <v-select
                  :items="opcionSelect8"
                  v-model="pregunta8"
                  chips
                  multiple
                  @change="activarOtro8()"
                >
                </v-select>
                <v-text-field
                  v-model="otrosPregunta8"
                  label="Ingresar Otro"
                  v-if="banderaOtros8"
                ></v-text-field>
                <v-row v-if="pregunta8">
                  <v-btn color="success" block @click="tab = `tab-8`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="8" :value="`tab-8`">
            <v-card flat>
              <v-card-text>
                <p>9.- ¿Cuántos días a la semana abre su negocio?</p>
                <v-select :items="opcionSelect9" v-model="pregunta9">
                </v-select>
                <v-row v-if="pregunta9">
                  <v-btn color="success" block @click="tab = `tab-9`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="9" :value="`tab-9`">
            <v-card flat class="d-flex align-center">
              <v-card-text>
                <p>10.- ¿Cuál es el horario de atención de su negocio?</p>

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
                      @click="
                        $refs.dialogH1.save(hora_inicio), completarPregunta10()
                      "
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
                  <v-time-picker
                    v-if="modal3"
                    v-model="hora_termino"
                    full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal3 = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.dialogH2.save(hora_termino), completarPregunta10()
                      "
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
                <br />
                <v-row class="d-flex justify-center">
                  <h3>
                    <strong>{{ pregunta10 }}</strong>
                  </h3>
                </v-row>
                <v-row v-if="pregunta10">
                  <v-btn color="success" block @click="tab = `tab-10`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="10" :value="`tab-10`">
            <v-card flat>
              <v-card-text>
                <p>11.- ¿Con qué frecuencia le gustaría ser visitado?</p>
                <v-select :items="opcionSelect11" v-model="pregunta11">
                </v-select>
                <v-row v-if="pregunta11">
                  <v-btn color="success" block @click="tab = `tab-11`">
                    Siguiente
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="11" :value="`tab-11`">
            <v-card flat>
              <v-card-text>
                <p>12.- ¿Cuántos años tiene este negocio funcionando?</p>
                <v-select :items="opcionSelect12" v-model="pregunta12">
                </v-select>
                <v-row>
                  <hr />
                  <v-btn
                    block
                    color="success"
                    dark
                    v-if="pregunta12"
                    @click="saveForm()"
                  >
                    Confirmar Encuesta
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-row>

    <v-dialog
      v-model="ventana_distribuidores"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="ventana_distribuidores = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Asociar Distribuidor</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <br />
        <v-card-text>
          <v-row>
            <p>
              Agrege uno o mas distribuidores asociados al cliente:
              {{ infoOportunity.nombre }}
            </p>
          </v-row>
          <v-row style="padding-block-end: 20px">
            <v-btn
              color="primary"
              block
              rounded
              elevation="20"
              @click="dialogDistribuidorIusa = true"
            >
              <v-icon> mdi-account-star </v-icon>
              Agregar Disitribuidor IUSA
            </v-btn>
          </v-row>
          <v-row style="padding-block-end: 20px">
            <v-btn
              color="secondary"
              block
              rounded
              elevation="20"
              @click="dialogDistribuidorOtro = true"
            >
              <v-icon> mdi-account-outline </v-icon>
              Agregar Distribuidor Externo
            </v-btn>
          </v-row>
          <v-row
            style="padding-block-end: 20px"
            v-if="distribuidores.length != 0"
          >
            <v-btn
              color="success"
              block
              rounded
              elevation="20"
              @click="ventana_distribuidores = false"
            >
              <v-icon> mdi-check </v-icon>
              Volver a la encuesta
            </v-btn>
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

    <v-dialog v-model="dialog_borrar" max-width="500px">
      <v-card>
        <v-card-title color="error"> Terminar Encuesta </v-card-title>
        <v-card-text>
          <v-alert type="warning" v-if="alerta_terminacion">
            {{ alerta_terminacion }}
          </v-alert>
          <v-text-field
            v-model="motivo_fin_encuesta"
            label="Motivo de terminación"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="danger" text @click="dialog_borrar = false">
            Cerrar
          </v-btn>
          <v-btn color="error" @click="terminarEncuesta()">
            Terminar Encuesta
          </v-btn>
        </v-card-actions>
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
              <v-text-field label="Teléfono" v-model="telefono"></v-text-field>
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

    <v-dialog v-model="dialogFormPromotor" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Encuesta al Promotor</span>
        </v-card-title>
        <v-card flat>
          <v-card-text>
            <p>13.- ¿Es un cliente potencial?</p>
            <br />
            <v-row no-gutters>
              <v-col>
                <v-btn
                  :color="tabColor13('SI')"
                  block
                  @click="pregunta13 = 'SI'"
                >
                  SI
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  :color="tabColor13('NO')"
                  block
                  @click="pregunta13 = 'NO'"
                >
                  NO
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="pregunta13 === 'SI'">
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="comentario13"
                  name="input-7-1"
                  label="Comentarios"
                  hint="Redactar el por que es un cliente potencial."
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card flat>
          <v-card-text>
            <p>
              14.- Promotor, identifique visualmente las marcas que comercializa
              este negocio.
            </p>
            <br />
            <v-row align="center">
              <v-col cols="12">
                <v-autocomplete
                  v-model="values"
                  :items="trademarks"
                  outlined
                  dense
                  chips
                  small-chips
                  label="Marcas"
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>

            <v-row>
              <hr />
              <v-btn
                block
                color="success"
                dark
                v-if="pregunta13 && values"
                @click="saveFormPromotor()"
              >
                Confirmar Encuesta Promotor
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card>
    </v-dialog>

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
    dialogLoading: false,
    comentario13: "",
    pregunta1: null,
    pregunta2: null,
    pregunta3: null,
    pregunta4: null,
    pregunta5: null,
    pregunta6: null,
    pregunta7: null,
    pregunta8: null,
    pregunta9: null,
    pregunta10: null,
    pregunta11: null,
    pregunta12: null,
    pregunta13: null,
    pregunta14: null,
    pregunta15: null,
    pregunta16: null,
    pregunta17: null,
    pregunta18: null,
    distribuidores: [],
    distribuidor: null,
    distribuidor_iusa: null,
    values: [],
    ventana_distribuidores: false,
    objeto_default: {},
    opcionSelect4: [
      "Tengo una alianza exclusiva con un fabricante/distribuidor",
      "Prefiero acudir directamente con el distribuidor a surtirme",
      "Otro",
    ],
    opcionSelect5: ["Eléctrico", "Hidráulico", "Gas", "Herramienta", "Otro"],
    opcionSelect6: [
      "Eléctrico",
      "Hidráulico",
      "Gas",
      "Herramienta",
      "Linea Blanca",
    ],
    opcionSelect8: [
      "Lonas",
      "Gráficos de piso/calcomanía",
      "Pintar fachada",
      "Otro",
    ],
    opcionSelect9: [
      "Diario",
      "6 días a la semana",
      "5 días a la semana",
      "4 días a la semana",
      "3 días a la semana",
      "2 días a la semana",
      "1 día a la semana",
    ],
    opcionSelect11: [
      "Cada semana",
      "Cada dos semanas",
      "Cada tres semanas",
      "Cada mes",
    ],
    opcionSelect12: [
      "Menos de 1 año",
      "1 a 5 años",
      "5 a 10 años",
      "10 a 15 años",
      "15 a 20 años",
      "20 a 25 años",
      "25 a 30 años",
      "Mas de 30 años",
    ],
    listaDistribuidor: [],
    trademarks: [
      "Adir",
      "Aksi",
      "Amanco",
      "Anbec",
      "Aquaplas",
      "Argos",
      "Bosch",
      "Bticino",
      "Calorex",
      "Cinsa",
      "Citijal",
      "Condumex",
      "Dica",
      "Durman",
      "Ecoplas",
      "Eureka",
      "Evans",
      "Foset",
      "Igoto",
      "Indiana",
      "Keer",
      "Kobrex",
      "Kruger",
      "Leviton",
      "Magamex",
      "Nacobre",
      "Pretul",
      "Rheem",
      "Rotomex",
      "Rotoplas",
      "Royer",
      "Rugo",
      "Sanelec",
      "Sanplom",
      "Santul",
      "Schneider",
      "Siemens",
      "Simon",
      "Square D",
      "Stanley",
      "Surtek",
      "Tecno Lite",
      "Truper",
      "Urrea",
      "Volteck",
      "Otro",
    ],
    tab: null,
    dialog_borrar: false,
    motivo_fin_encuesta: "",
    alerta_terminacion: null,
    modal2: false,
    modal3: false,
    hora_inicio: "",
    hora_termino: "",
    otrosPregunta5: "",
    banderaOtros5: false,
    otrosPregunta8: "",
    banderaOtros8: false,
    infoOportunity: {},
    dialogDistribuidorIusa: false,
    dialogDistribuidorOtro: false,
    direccion: "",
    telefono: "",
    correo: "",
    cp: "",
    calificacion: 0,
    dialogFormPromotor: false,
    snackbar: false,
    textAlert: null,
  }),
  async mounted() {
    this.cargarDistribuidor();
    this.getInfoOpportunity();
  },
  methods: {
    async getInfoOpportunity() {
      this.dialogLoading = true;
      await axios
        .post("getOpportunity", {
          id: this.$route.params.id,
        })
        .then((response) => {
          this.infoOportunity = response.data[0];
          this.dialogLoading = false;
        })
        .catch((error) => {
          alert(error);
          this.dialogLoading = false;
        })
        .finally(() => (this.dialogLoading = false));
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
        this.distribuidores.push(this.objeto_default);
        this.distribuidor = null;
        this.calificacion = 0;
        this.objeto_default = {};
        this.dialogDistribuidorOtro = false;
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
        this.distribuidores.push(this.objeto_default);
        this.distribuidor_iusa = null;
        this.objeto_default = {};
        this.direccion = "";
        this.telefono = "";
        this.correo = "";
        this.cp = "";
        this.calificacion = 0;
        this.dialogDistribuidorIusa = false;
      }
    },
    eliminarItem(index) {
      this.distribuidores.splice(index, 1);
    },
    qualify(id) {
      alert(id);
    },
    saveForm() {
      let me = this;

      if (me.pregunta4 != null && me.motivo_fin_encuesta != null) {
        me.snackbar = true;
        me.textAlert = "Terminara la encuesta";
        me.snackbarOut();

        me.dialogLoading = true;
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            axios
              .post("./saveForm", {
                idOportunidad: me.$route.params.id,
                pregunta1: "NO",
                pregunta2: "NO",
                pregunta3: me.pregunta3,
                pregunta4: me.pregunta4,
                motivo_fin_encuesta: me.motivo_fin_encuesta,
                distribuidores: me.distribuidores,
                latitud: pos.coords.latitude,
                longitud: pos.coords.longitude,
                id_promotor: localStorage.getItem("id"),
              })
              .then(function () {
                // handle success
                me.dialogLoading = false;
                me.distribuidores = [];
                me.distribuidor_iusa = null;
                me.distribuidor = null;
                //router.replace("/routes");
                me.dialogFormPromotor = true;
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                me.dialogLoading = false;
              });
          },
          (err) => {
            console.log(err);
            me.dialogLoading = false;
          }
        );
      } else if (
        me.pregunta1 == null ||
        me.pregunta2 == null ||
        me.pregunta3 == null ||
        me.pregunta5 == null ||
        me.pregunta6 == null ||
        me.pregunta7 == null ||
        me.pregunta9 == null ||
        me.pregunta10 == null ||
        me.pregunta11 == null ||
        me.pregunta12 == null
      ) {
        me.snackbar = true;
        me.textAlert = "Complete todas las preguntas";
        me.snackbarOut();
      } else {
        var pregunta6String = "";
        var pregunta5String = "";
        var pregunta8String = "";
        if (me.pregunta6 != null && me.pregunta6.length != 0) {
          for (var j = 0; j < me.pregunta6.length; j++) {
            pregunta6String = me.pregunta6[j] + "," + pregunta6String;
          }
          pregunta6String = pregunta6String.slice(0, -1);
        }
        if (me.pregunta5 != null && me.pregunta5.length != 0) {
          for (var k = 0; k < me.pregunta5.length; k++) {
            if (me.pregunta5[k] != "Otro") {
              pregunta5String = me.pregunta5[k] + "," + pregunta5String;
            }
          }
          if (me.otrosPregunta5 != "") {
            pregunta5String = pregunta5String + me.otrosPregunta5;
          } else {
            pregunta5String = pregunta5String.slice(0, -1);
          }
        }
        if (me.pregunta8 != null && me.pregunta8.length != 0) {
          for (var l = 0; l < me.pregunta8.length; l++) {
            if (me.pregunta8[l] != "Otro") {
              pregunta8String = me.pregunta8[l] + "," + pregunta8String;
            }
          }
          if (me.otrosPregunta8 != "") {
            pregunta8String = pregunta8String + me.otrosPregunta8;
          } else {
            pregunta8String = pregunta8String.slice(0, -1);
          }
        }
        me.dialogLoading = true;
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            axios
              .post("./saveForm", {
                idOportunidad: me.$route.params.id,
                pregunta1: me.pregunta1,
                pregunta2: me.pregunta2,
                pregunta3: me.pregunta3,
                pregunta4: me.pregunta4,
                pregunta5: pregunta5String,
                pregunta6: pregunta6String,
                pregunta7: me.pregunta7,
                pregunta8: pregunta8String,
                pregunta9: me.pregunta9,
                pregunta10: me.pregunta10,
                pregunta11: me.pregunta11,
                pregunta12: me.pregunta12,
                pregunta13: me.pregunta13,
                pregunta14: me.values,
                motivo_fin_encuesta: me.motivo_fin_encuesta,
                distribuidores: me.distribuidores,
                latitud: pos.coords.latitude,
                longitud: pos.coords.longitude,
                id_promotor: localStorage.getItem("id"),
              })
              .then(function () {
                // handle success
                me.dialogLoading = false;
                me.distribuidores = [];
                me.distribuidor_iusa = null;
                me.distribuidor = null;
                //router.replace("/routes");
                me.dialogFormPromotor = true;
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                me.dialogLoading = false;
              });
          },
          (err) => {
            console.log(err);
            me.dialogLoading = false;
          }
        );
      } // fin if
    },
    cargarDistribuidor() {
      let me = this;
      axios
        .post("./obtenerDistribuidores", {
          id: 1,
        })
        .then(function (response) {
          // handle success
          console.log(response);
          me.listaDistribuidor = response.data;
          me.listaDistribuidor.pop();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    },
    tabColor1(tab) {
      return tab == this.pregunta1 ? "primary" : "normal";
    },
    tabColor2(tab) {
      return tab == this.pregunta2 ? "primary" : "normal";
    },
    tabColor3(tab) {
      return tab == this.pregunta3 ? "primary" : "normal";
    },
    tabColor7(tab) {
      return tab == this.pregunta7 ? "primary" : "normal";
    },
    tabColor13(tab) {
      return tab == this.pregunta13 ? "primary" : "normal";
    },
    terminarEncuesta() {
      this.alerta_terminacion = null;
      if (this.motivo_fin_encuesta == null || this.motivo_fin_encuesta == "") {
        this.alerta_terminacion = "Es necesario poner un motivo";
      } else {
        this.saveForm();
      }
    },
    completarPregunta10() {
      this.pregunta10 = this.hora_inicio + "-" + this.hora_termino;
    },
    activarOtro5() {
      this.banderaOtros5 = false;
      if (this.pregunta5 != null && this.pregunta5.length != 0) {
        for (var i = 0; i < this.pregunta5.length; i++) {
          if (this.pregunta5[i] == "Otro") {
            this.banderaOtros5 = true;
          } //fin if
        } //fin for
      } //fin if
    },
    activarOtro8() {
      this.banderaOtros8 = false;
      if (this.pregunta8 != null && this.pregunta8.length != 0) {
        for (var i = 0; i < this.pregunta8.length; i++) {
          if (this.pregunta8[i] == "Otro") {
            this.banderaOtros8 = true;
          } //fin if
        } //fin for
      } //fin if
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
    saveFormPromotor() {
      let me = this;
      var pregunta14String = "";
      if (me.values != null && me.values.length != 0) {
        for (var a = 0; a < me.values.length; a++) {
          pregunta14String = me.values[a] + "," + pregunta14String;
        }
        pregunta14String = pregunta14String.slice(0, -1);
      }

      me.dialogLoading = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          axios
            .post("./saveFormPromotor", {
              idOportunidad: me.$route.params.id,
              pregunta13: me.pregunta13,
              comentario13: me.comentario13,
              pregunta14: pregunta14String,
              latitud: pos.coords.latitude,
              longitud: pos.coords.longitude,
              id_promotor: localStorage.getItem("id"),
            })
            .then(function () {
              // handle success
              me.dialogLoading = false;
              me.distribuidores = [];
              me.distribuidor_iusa = null;
              me.distribuidor = null;
              me.dialogFormPromotor = false;
              router.replace("/routes");
            })
            .catch(function (error) {
              // handle error
              console.log(error);
              me.dialogLoading = false;
            });
        },
        (err) => {
          console.log(err);
          me.dialogLoading = false;
        }
      );
    },
  },
};
</script>
