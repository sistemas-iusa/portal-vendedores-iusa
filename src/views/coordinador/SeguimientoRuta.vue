<template>
  <v-container fluid>
    <template>
      <v-row>
        <v-tabs v-model="tab" background-color="primary" show-arrows>
          <v-tab :key="0" :href="`#tab-0`"> Global </v-tab>
          <v-tab :key="1" :href="`#tab-1`"> Por Municipio </v-tab>
          <v-tab :key="2" :href="`#tab-2`"> Por Promotor </v-tab>
          <v-tab :key="3" :href="`#tab-3`"> Rutas Sin Asignar </v-tab>

          <v-tabs-items v-model="tab">
            <v-tab-item :key="0" :value="`tab-0`">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <h3>Conteo de Rutas Global</h3>
                  </v-row>
                  <br />
                  <v-row>
                    <v-card>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="text-h5">
                            Oportunidades
                          </v-list-item-title>
                          <v-list-item-subtitle
                            >Total Registrados INEGI</v-list-item-subtitle
                          >
                        </v-list-item-content>
                        <v-list-item-content
                          class="d-flex align-end flex-column"
                        >
                          <download-excel
                            class="btn btn-default"
                            :data="json_data1"
                            worksheet="My Worksheet"
                            name="Global Oportunidades.xls"
                          >
                            <v-btn color="#319807">
                              <v-icon color="#fff">mdi-file-excel</v-icon>
                            </v-btn>
                          </download-excel>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-simple-table id="tabla-1">
                        <thead>
                          <tr>
                            <th class="text-left">Indicador</th>
                            <th class="text-left">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Oportunidades cargadas en el Portal</td>
                            <td>
                              <strong>{{ data.opportunitiesTotal }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Oportunidades asignadas a Rutas</td>
                            <td>
                              <strong>{{
                                data.opportunitiesAsignadasRuta
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Oportunidades por generar rutas</td>
                            <td>
                              <strong>{{
                                data.opportunitiesPendientesAsignadasRuta
                              }}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card>
                    <v-card>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="text-h5">
                            Rutas
                          </v-list-item-title>
                          <v-list-item-subtitle
                            >Total Rutas</v-list-item-subtitle
                          >
                        </v-list-item-content>
                        <v-list-item-content
                          class="d-flex align-end flex-column"
                        >
                          <download-excel
                            class="btn btn-default"
                            :data="json_data2"
                            worksheet="My Worksheet"
                            name="Global Rutas.xls"
                          >
                            <v-btn color="#319807">
                              <v-icon color="#fff">mdi-file-excel</v-icon>
                            </v-btn>
                          </download-excel>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-simple-table id="tabla-2">
                        <thead>
                          <tr>
                            <th class="text-left">Indicador</th>
                            <th class="text-left">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Rutas Generadas</td>
                            <td>
                              <strong>{{ data.rutasTotal }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Sin Iniciar</td>
                            <td>
                              <strong>{{ data.rutasSinIniciar }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Asignadas</td>
                            <td>
                              <strong>{{ data.rutasAsignadas }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Pendientes de asignar</td>
                            <td>
                              <strong>{{ data.rutasPendientes }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas en Curso</td>
                            <td>
                              <strong>{{ data.rutasCurso }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas en Pausa</td>
                            <td>
                              <strong>{{ data.rutasPausa }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Finalizadas</td>
                            <td>
                              <strong>{{ data.rutasFinalizadas }}</strong>
                            </td>
                          </tr>

                          <tr>
                            <td>Rutas con 10 Oportunidades</td>
                            <td>
                              <strong>{{ data.rutas10 }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas con menos de 10 Oportunidades</td>
                            <td>
                              <strong>{{ data.rutasMenos10 }}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="1" :value="`tab-1`">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <h3>Conteo de Rutas Por Municipio</h3>
                  </v-row>
                  <br />
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
                        style="margin-bottom: -27px"
                        v-if="municipios"
                        @change="dataMunicipio = []"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-btn @click="getReporteMunicipio()">Buscar</v-btn>
                    </v-col>
                  </v-row>
                  <v-row v-if="dataMunicipio.length != 0">
                    <v-card>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="text-h5">
                            Oportunidades
                          </v-list-item-title>
                          <v-list-item-subtitle
                            >Total Oportunidades por
                            Municipio</v-list-item-subtitle
                          >
                        </v-list-item-content>
                        <v-list-item-content
                          class="d-flex align-end flex-column"
                        >
                          <download-excel
                            class="btn btn-default"
                            :data="json_data3"
                            worksheet="My Worksheet"
                            name="Municipio Oportunidades.xls"
                            :title="[
                              dataMunicipio.nombre_entidad +
                                ' ' +
                                dataMunicipio.nombre_municipio,
                            ]"
                          >
                            <v-btn color="#319807">
                              <v-icon color="#fff">mdi-file-excel</v-icon>
                            </v-btn>
                          </download-excel>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-simple-table id="tabla-3">
                        <thead>
                          <tr>
                            <th class="text-left">Indicador</th>
                            <th class="text-left">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Oportunidades cargadas en el Portal</td>
                            <td>
                              <strong>{{
                                dataMunicipio.opportunitiesTotal
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Oportunidades asignadas a Rutas</td>
                            <td>
                              <strong>{{
                                dataMunicipio.opportunitiesAsignadasRuta
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Oportunidades por generar rutas</td>
                            <td>
                              <strong>{{
                                dataMunicipio.opportunitiesPendientesAsignadasRuta
                              }}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card>
                    <v-card>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="text-h5">
                            Rutas
                          </v-list-item-title>
                          <v-list-item-subtitle
                            >Total Rutas por Municipio</v-list-item-subtitle
                          >
                        </v-list-item-content>
                        <v-list-item-content
                          class="d-flex align-end flex-column"
                        >
                          <download-excel
                            class="btn btn-default"
                            :data="json_data4"
                            worksheet="My Worksheet"
                            name="Municipio Rutas.xls"
                            :title="[
                              dataMunicipio.nombre_entidad +
                                ' ' +
                                dataMunicipio.nombre_municipio,
                            ]"
                          >
                            <v-btn color="#319807">
                              <v-icon color="#fff">mdi-file-excel</v-icon>
                            </v-btn>
                          </download-excel>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-simple-table id="tabla-4">
                        <thead>
                          <tr>
                            <th class="text-left">Indicador</th>
                            <th class="text-left">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Rutas Generadas</td>
                            <td>
                              <strong>{{ dataMunicipio.rutasTotal }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Asignadas</td>
                            <td>
                              <strong>{{
                                dataMunicipio.rutasAsignadas
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Sin Iniciar</td>
                            <td>
                              <strong>{{
                                dataMunicipio.rutasSinIniciar
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas en Curso</td>
                            <td>
                              <strong>{{ dataMunicipio.rutasCurso }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas en Pausa</td>
                            <td>
                              <strong>{{ dataMunicipio.rutasPausa }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Finalizadas</td>
                            <td>
                              <strong>{{
                                dataMunicipio.rutasFinalizadas
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Pendientes de asignar</td>
                            <td>
                              <strong>{{
                                dataMunicipio.rutasPendientes
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas con 10 Oportunidades</td>
                            <td>
                              <strong>{{ dataMunicipio.rutas10 }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas con menos de 10 Oportunidades</td>
                            <td>
                              <strong>{{ dataMunicipio.rutasMenos10 }}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="2" :value="`tab-2`">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <h3>Conteo de Rutas por Promotor</h3>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-autocomplete
                        dense
                        filled
                        label="PROMOTOR"
                        :items="promotores_list"
                        item-text="name"
                        item-value="id"
                        v-model="promotorSelect"
                        style="margin-bottom: -27px"
                        v-if="promotores_list"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-btn @click="getReportePromotor()">Buscar</v-btn>
                    </v-col>
                  </v-row>
                  <v-col cols="12" sm="12" v-if="dataPromotor.length != 0">
                    <center>
                      <h3>
                        Reporte {{ dataPromotor.nombre_promotor }} {{ titulo }}
                      </h3>
                    </center>
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
                          style="margin-bottom: -27px"
                          v-if="municipios"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-btn @click="getReportePromotorMunicipio()">
                          Filtrar
                        </v-btn>
                        <v-btn
                          color="primary"
                          v-if="titulo != ''"
                          @click="getReportePromotor()"
                        >
                          Reporte General
                        </v-btn>
                      </v-col>
                    </v-row>
                    &nbsp; &nbsp;
                  </v-col>
                  <v-row v-if="dataPromotor.length != 0">
                    <v-card>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="text-h5">
                            Oportunidades
                          </v-list-item-title>
                          <v-list-item-subtitle
                            >Total Oportunidades por
                            Promotor</v-list-item-subtitle
                          >
                          <v-list-item-subtitle>{{
                            dataPromotor.nombre_promotor
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-content
                          class="d-flex align-end flex-column"
                        >
                          <download-excel
                            class="btn btn-default"
                            :data="json_data5"
                            worksheet="My Worksheet"
                            name="Oportunidades Promotor.xls"
                            :title="[
                              dataPromotor.nombre_promotor +
                                ' ' +
                                dataPromotor.nombre_entidad +
                                ' ' +
                                dataPromotor.nombre_municipio,
                            ]"
                          >
                            <v-btn color="#319807">
                              <v-icon color="#fff">mdi-file-excel</v-icon>
                            </v-btn>
                          </download-excel>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-simple-table id="tabla-3">
                        <thead>
                          <tr>
                            <th class="text-left">Indicador</th>
                            <th class="text-left">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Oportunidades asignadas a Rutas</td>
                            <td>
                              <strong>{{
                                dataPromotor.opportunitiesAsignadasRuta
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Oportunidades Visitadas</td>
                            <td>
                              <strong>{{
                                dataPromotor.opportunitiesVisitadas
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Oportunidades Pendientes por Visitar</td>
                            <td>
                              <strong>{{
                                dataPromotor.opportunitiesPendientesVisitar
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Oportunidades Canceladas</td>
                            <td>
                              <strong>{{
                                dataPromotor.opportunitiesCanceladas
                              }}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card>
                    <v-card>
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title class="text-h5">
                            Rutas
                          </v-list-item-title>
                          <v-list-item-subtitle
                            >Total Rutas por Promotor</v-list-item-subtitle
                          >
                          <v-list-item-subtitle>{{
                            dataPromotor.nombre_promotor
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-content
                          class="d-flex align-end flex-column"
                        >
                          <download-excel
                            class="btn btn-default"
                            :data="json_data6"
                            worksheet="My Worksheet"
                            name="Rutas Promotor.xls"
                            :title="[
                              dataPromotor.nombre_promotor +
                                ' ' +
                                dataPromotor.nombre_entidad +
                                ' ' +
                                dataPromotor.nombre_municipio,
                            ]"
                          >
                            <v-btn color="#319807">
                              <v-icon color="#fff">mdi-file-excel</v-icon>
                            </v-btn>
                          </download-excel>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-simple-table id="tabla-4">
                        <thead>
                          <tr>
                            <th class="text-left">Indicador</th>
                            <th class="text-left">Resultado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Rutas Asignadas</td>
                            <td>
                              <strong>{{ dataPromotor.rutasAsignadas }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Sin Iniciar</td>
                            <td>
                              <strong>{{
                                dataPromotor.rutasSinIniciar
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas en Curso</td>
                            <td>
                              <strong>{{ dataPromotor.rutasCurso }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas en Pausa</td>
                            <td>
                              <strong>{{ dataPromotor.rutasPausa }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas Finalizadas</td>
                            <td>
                              <strong>{{
                                dataPromotor.rutasFinalizadas
                              }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas con 10 Oportunidades</td>
                            <td>
                              <strong>{{ dataPromotor.rutas10 }}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Rutas con menos de 10 Oportunidades</td>
                            <td>
                              <strong>{{ dataPromotor.rutasMenos10 }}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-card>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item :key="3" :value="`tab-3`">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <h3>Rutas sin asignar</h3>
                  </v-row>
                  <br />
                  <v-data-table
                    dense
                    :headers="headersRoute"
                    :items-per-page="20"
                    :items="RutasSinAsignar"
                    item-key="id"
                    multi-sort
                    class="elevation-1"
                  >
                    <template
                      v-slot:[`item.nomeclatura`]="{ item }"
                      align="center"
                    >
                      RG_{{ item.numero_ruta }}
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-row>

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
import Vue from "vue";
import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);
const $ = require("jquery");
window.jquery = $;
export default {
  data: () => ({
    tab: null,
    dialogLoading: false,
    data: [],
    entidades: [],
    entidadSelect: "",
    municipios: [],
    municipioSelect: "",
    RutasSinAsignar: [],
    headersRoute: [
      { text: "ENTIDAD", align: "start", value: "entidad" },
      { text: "MUNICIPIO", align: "start", value: "municipio" },
      { text: "NUMERO DE RUTA", value: "nomeclatura" },
      { text: "NUMERO DE OPORTUNIDADES", value: "orden_ruta" },
      { text: "ESTATUS", value: "estatus" },
      { text: "", value: "actions", sortable: false },
    ],
    dataMunicipio: [],
    promotores_list: [],
    promotorSelect: [],
    dataPromotor: [],
    json_data1: [],
    json_data2: [],
    json_data3: [],
    json_data4: [],
    json_data5: [],
    json_data6: [],
    titulo: "",
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8",
        },
      ],
    ],
  }),
  async mounted() {
    let self = this;
    self.getReporte();
    self.getRutasSinAsignar();
    self.getEntidades();
    self.getPromotores();
  },
  methods: {
    async getEntidades() {
      let me = this;
      me.dialogLoading = true;
      await axios
        .post("./getEntidades", {
          id: "1",
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.entidades = response.data;
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    async getMunicipio() {
      let me = this;
      me.dialogLoading = true;
      me.dataMunicipio = [];
      me.municipioSelect = "";
      await axios
        .post("./getMunicipio", {
          id: me.entidadSelect,
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.municipios = response.data;
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    async getReporte() {
      let me = this;
      me.dialogLoading = true;
      await axios
        .post("./getReporte", {
          id: "1",
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.data = response.data;
          me.json_data1 = [
            {
              Indicador: "Oportunidades cargadas en el Portal",
              Resultado: me.data.opportunitiesTotal,
            },
            {
              Indicador: "Oportunidades asignadas a Rutas ",
              Resultado: me.data.opportunitiesAsignadasRuta,
            },
            {
              Indicador: "Oportunidades por generar rutas",
              Resultado: me.data.opportunitiesPendientesAsignadasRuta,
            },
          ];
          me.json_data2 = [
            {
              Indicador: "Rutas Generadas",
              Resultado: me.data.rutasTotal,
            },
            {
              Indicador: "Rutas Sin Iniciar  ",
              Resultado: me.data.rutasSinIniciar,
            },
            {
              Indicador: "Rutas Asignadas ",
              Resultado: me.data.rutasAsignadas,
            },
            {
              Indicador: "Rutas Pendientes de asignar",
              Resultado: me.data.rutasPendientes,
            },
            {
              Indicador: "Rutas en Curso",
              Resultado: me.data.rutasCurso,
            },
            {
              Indicador: "Rutas en Pausa",
              Resultado: me.data.rutasPausa,
            },
            {
              Indicador: "Rutas Finalizadas",
              Resultado: me.data.rutasFinalizadas,
            },
            {
              Indicador: "Rutas con 10 Oportunidades",
              Resultado: me.data.rutas10,
            },
            {
              Indicador: "Rutas con menos de 10 Oportunidades",
              Resultado: me.data.rutasMenos10,
            },
          ];
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    async getReporteMunicipio() {
      let me = this;
      me.dialogLoading = true;
      await axios
        .post("./getReporteMunicipio", {
          id_entidad: me.entidadSelect,
          id_municipio: me.municipioSelect,
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.dataMunicipio = response.data;
          me.json_data3 = [
            {
              Indicador: "Oportunidades cargadas en el Portal",
              Resultado: me.dataMunicipio.opportunitiesTotal,
            },
            {
              Indicador: "Oportunidades asignadas a Rutas ",
              Resultado: me.dataMunicipio.opportunitiesAsignadasRuta,
            },
            {
              Indicador: "Oportunidades por generar rutas",
              Resultado: me.dataMunicipio.opportunitiesPendientesAsignadasRuta,
            },
          ];
          me.json_data4 = [
            {
              Indicador: "Rutas Generadas",
              Resultado: me.dataMunicipio.rutasTotal,
            },
            {
              Indicador: "Rutas Sin Iniciar  ",
              Resultado: me.dataMunicipio.rutasSinIniciar,
            },
            {
              Indicador: "Rutas Asignadas ",
              Resultado: me.dataMunicipio.rutasAsignadas,
            },
            {
              Indicador: "Rutas Pendientes de asignar",
              Resultado: me.dataMunicipio.rutasPendientes,
            },
            {
              Indicador: "Rutas en Curso",
              Resultado: me.dataMunicipio.rutasCurso,
            },
            {
              Indicador: "Rutas en Pausa",
              Resultado: me.dataMunicipio.rutasPausa,
            },
            {
              Indicador: "Rutas Finalizadas",
              Resultado: me.dataMunicipio.rutasFinalizadas,
            },
            {
              Indicador: "Rutas con 10 Oportunidades",
              Resultado: me.dataMunicipio.rutas10,
            },
            {
              Indicador: "Rutas con menos de 10 Oportunidades",
              Resultado: me.dataMunicipio.rutasMenos10,
            },
          ];
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    async getRutasSinAsignar() {
      let me = this;
      me.dialogLoading = true;
      await axios
        .post("./getRutasSinAsignar", {
          id: "1",
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.RutasSinAsignar = response.data;
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    async getPromotores() {
      this.dialogLoading = true;
      await axios
        .post("getPromotores", {
          idMunicipio: 1,
        })
        .then((response) => {
          this.promotores_list = response.data;
          this.dialogLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.dialogLoading = false;
        })
        .finally(() => (this.dialogLoading = false));
    },
    getReportePromotor() {
      let me = this;
      me.titulo = "";
      me.entidadSelect = null;
      me.municipioSelect = null;
      me.dialogLoading = true;
      axios
        .post("./getReportePromotor", {
          id_promotor: me.promotorSelect,
        })
        .then(function (response) {
          me.dialogLoading = false;
          me.dataPromotor = response.data;
          me.json_data5 = [
            {
              Indicador: "Oportunidades asignadas a Rutas ",
              Resultado: me.dataPromotor.opportunitiesAsignadasRuta,
            },
            {
              Indicador: "Oportunidades Visitadas",
              Resultado: me.dataPromotor.opportunitiesVisitadas,
            },
            {
              Indicador: "Oportunidades Pendientes por Visitar",
              Resultado: me.dataPromotor.opportunitiesPendientesVisitar,
            },
            {
              Indicador: "Oportunidades Canceladas",
              Resultado: me.dataPromotor.opportunitiesCanceladas,
            },
          ];
          me.json_data6 = [
            {
              Indicador: "Rutas Asignadas ",
              Resultado: me.dataPromotor.rutasAsignadas,
            },
            {
              Indicador: "Rutas Sin Iniciar  ",
              Resultado: me.dataPromotor.rutasSinIniciar,
            },
            {
              Indicador: "Rutas en Curso",
              Resultado: me.dataPromotor.rutasCurso,
            },
            {
              Indicador: "Rutas en Pausa",
              Resultado: me.dataPromotor.rutasPausa,
            },
            {
              Indicador: "Rutas Finalizadas",
              Resultado: me.dataPromotor.rutasFinalizadas,
            },
            {
              Indicador: "Rutas con 10 Oportunidades",
              Resultado: me.dataPromotor.rutas10,
            },
            {
              Indicador: "Rutas con menos de 10 Oportunidades",
              Resultado: me.dataPromotor.rutasMenos10,
            },
          ];
        })
        .catch((error) => {
          console.log(error);
          this.dialogLoading = false;
        })
        .finally(() => (this.dialogLoading = false));
    },
    getReportePromotorMunicipio() {
      let me = this;
      me.dataPromotor = [];
      me.dialogLoading = true;
      axios
        .post("./getReportePromotorMunicipio", {
          id_promotor: me.promotorSelect,
          id_entidad: me.entidadSelect,
          id_municipio: me.municipioSelect,
        })
        .then(function (response) {
          me.dialogLoading = false;
          me.dataPromotor = response.data;
          me.titulo =
            me.dataPromotor.nombre_entidad +
            "-" +
            me.dataPromotor.nombre_municipio;
          me.json_data5 = [
            {
              Indicador: "Oportunidades asignadas a Rutas ",
              Resultado: me.dataPromotor.opportunitiesAsignadasRuta,
            },
            {
              Indicador: "Oportunidades Visitadas",
              Resultado: me.dataPromotor.opportunitiesVisitadas,
            },
            {
              Indicador: "Oportunidades Pendientes por Visitar",
              Resultado: me.dataPromotor.opportunitiesPendientesVisitar,
            },
            {
              Indicador: "Oportunidades Canceladas",
              Resultado: me.dataPromotor.opportunitiesCanceladas,
            },
          ];
          me.json_data6 = [
            {
              Indicador: "Rutas Asignadas ",
              Resultado: me.dataPromotor.rutasAsignadas,
            },
            {
              Indicador: "Rutas Sin Iniciar  ",
              Resultado: me.dataPromotor.rutasSinIniciar,
            },
            {
              Indicador: "Rutas en Curso",
              Resultado: me.dataPromotor.rutasCurso,
            },
            {
              Indicador: "Rutas en Pausa",
              Resultado: me.dataPromotor.rutasPausa,
            },
            {
              Indicador: "Rutas Finalizadas",
              Resultado: me.dataPromotor.rutasFinalizadas,
            },
            {
              Indicador: "Rutas con 10 Oportunidades",
              Resultado: me.dataPromotor.rutas10,
            },
            {
              Indicador: "Rutas con menos de 10 Oportunidades",
              Resultado: me.dataPromotor.rutasMenos10,
            },
          ];
        })
        .catch((error) => {
          console.log(error);
          this.dialogLoading = false;
        })
        .finally(() => (this.dialogLoading = false));
    },
  },
};
</script>
