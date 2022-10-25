<template>
  <v-container fluid>
    <template>
      <v-row>
        <v-col cols="12" sm="12" style="height: 30px">
          <h3>Buscar Ciudad</h3>
        </v-col>
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
          <v-btn @click="getReporteMunicipio()"> Filtrar </v-btn>
          &nbsp; &nbsp;
          <v-btn
            color="primary"
            v-if="titulo != 'Nacional'"
            @click="getReporte()"
          >
            Reporte Nacional
          </v-btn>
        </v-col>

        <v-col cols="12" sm="12">
          <center>
            <h3>Reporte de indicadores {{ titulo }}</h3>
          </center>
        </v-col>
      </v-row>
      <br />
      <v-row>
        <v-col cols="12" sm="3">
          <v-card class="mx-auto" max-width="400px" max-height="150px">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  Oportunidades
                </v-list-item-title>
                <v-list-item-subtitle
                  >Total Registrados INEGI</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
            <v-card-text>
              <v-row align="center">
                <v-col class="text-h4" cols="6">
                  <strong style="color: #000; font-size: 2.625rem !important">{{
                    data.opportunitiesTotal
                  }}</strong>
                </v-col>
                <v-col cols="6" class="d-flex align-end flex-column">
                  <v-img
                    src="../../assets/img_pgc/icon_clientes_x3.png"
                    alt="Oportunidades image"
                    width="92"
                    height="50"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card class="mx-auto" max-width="400px" max-height="150px">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  Prospectos
                </v-list-item-title>
                <v-list-item-subtitle>Total Prospectos</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-text>
              <v-row align="center">
                <v-col class="text-h4" cols="6">
                  <strong style="color: #000; font-size: 2.625rem !important">{{
                    data.opportunitiesVisitadas
                  }}</strong>
                </v-col>
                <v-col cols="6" class="d-flex align-end flex-column">
                  <v-img
                    src="../../assets/img_pgc/icon_prospectos_x3.png"
                    alt="Prospectos image"
                    width="92"
                    height="50"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card class="mx-auto" max-width="400px" max-height="150px">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  Pedidos Sugeridos
                </v-list-item-title>
                <v-list-item-subtitle
                  >Total Pedidos Sugeridos</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col class="text-h4" cols="6">
                  <strong style="color: #000; font-size: 2.625rem !important">{{
                    data.PedidoSugeridoTotal
                  }}</strong>
                </v-col>
                <v-col cols="6" class="d-flex align-end flex-column">
                  <v-img
                    src="../../assets/img_pgc/icon_facturacion_x2.png"
                    alt="Pedidos image"
                    width="50"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="3">
          <v-card class="mx-auto" max-width="400px" max-height="150px">
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5"> Familia </v-list-item-title>
                <v-list-item-subtitle
                  >Familia con mas incidencia</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col
                  class="text-h6"
                  cols="8"
                  style="color: #000; font-size: 1.625rem !important"
                >
                  {{ data.mayor_nombre_familia }}
                </v-col>
                <v-col cols="4" class="d-flex align-end flex-column">
                  <v-img
                    src="../../assets/img_pgc/div_cobre_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="data.mayor_nombre_familia == 'COBRE Y SUS ALEACIONES'"
                  ></v-img>
                  <v-img
                    src="../../assets/img_pgc/div_electricos_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="data.mayor_nombre_familia == 'ELECTRICOS'"
                  ></v-img>
                  <v-img
                    src="../../assets/img_pgc/div_esp_industriales_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="
                      data.mayor_nombre_familia == 'ESPECIALIDADES INDUSTRIALES'
                    "
                  ></v-img>
                  <v-img
                    src="../../assets/img_pgc/div_catalogos_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="data.mayor_nombre_familia == 'EXHIBIDOR Y CATALOGOS'"
                  ></v-img>
                  <v-img
                    src="../../assets/img_pgc/div_herramientas_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="data.mayor_nombre_familia == 'HERRAMIENTAS'"
                  ></v-img>
                  <v-img
                    src="../../assets/img_pgc/div_linea_blanca_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="data.mayor_nombre_familia == 'LINEA  BLANCA'"
                  ></v-img>
                  <v-img
                    src="../../assets/img_pgc/div_manejo_agua_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="data.mayor_nombre_familia == 'MANEJO DE AGUA Y GAS'"
                  ></v-img>
                  <v-img
                    src="../../assets/img_pgc/div_medical_x2.png"
                    alt="Family image"
                    width="30"
                    v-if="data.mayor_nombre_familia == 'MEDICAL CENTER'"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              Prueba de Existencia
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <bar-chart
                v-if="!dialogLoading"
                :chartdata="chartdata1"
                height="300px"
              ></bar-chart>
            </div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Resultado</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Oportunidades Programadas en Ruta</td>
                  <td>
                    <strong>{{ data.opportunitiesAsignadasRuta }}</strong>
                  </td>
                  <td>
                    <strong>100 %</strong>
                  </td>
                </tr>
                <tr>
                  <td>Oportunidades Encuestadas</td>
                  <td>
                    <strong>{{ data.opportunitiesVisitadas }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeOportunidadesProspectos }} %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Oportunidades Canceladas</td>
                  <td>
                    <strong>{{ data.opportunitiesCanceladas }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeOportunidadesCanceladas }} %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Oportunidades sin Visitar en Ruta</td>
                  <td>
                    <strong>{{ data.opportunitiesPendientesVisitar }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{
                        data.porcentajeOportunidadesPendientesVisitar
                      }}
                      %</strong
                    >
                  </td>
                </tr>
                <!--<tr>
                <td>
                  Nueva Oportunidad en Ruta
                </td>
                <td>
                  <strong>{{data.oportunidades_nuevas}}</strong>
                </td>
                <td>
                  <strong>{{data.porcentajeOportunidades_nuevas}} %</strong>
                </td>
              </tr>-->
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              Tasa de Cancelación
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <doughnut-chart
                v-if="!dialogLoading"
                :chartdata="chartdata8"
                height="300px"
              ></doughnut-chart>
            </div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Resultado</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Oportunidades Canceladas</td>
                  <td>
                    <strong>{{ data.opportunitiesCanceladas }}</strong>
                  </td>
                  <td>
                    <strong>100 %</strong>
                  </td>
                </tr>
                <tr>
                  <td>El negocio ya no existe</td>
                  <td>
                    <strong>{{ data.opportunitiesCanceladasMotivo1 }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{
                        data.porcentajeOpportunitiesCanceladasMotivo1
                      }}
                      %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Reubicación del local</td>
                  <td>
                    <strong>{{ data.opportunitiesCanceladasMotivo2 }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{
                        data.porcentajeOpportunitiesCanceladasMotivo2
                      }}
                      %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Otro motivo</td>
                  <td>
                    <strong>{{ data.opportunitiesCanceladasMotivo3 }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{
                        data.porcentajeOpportunitiesCanceladasMotivo3
                      }}
                      %</strong
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              Tasa de Conversión
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <pie-chart
                v-if="!dialogLoading"
                :chartdata="chartdata3"
                height="300px"
              ></pie-chart>
            </div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Resultado</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Oportunidades Visitadas</td>
                  <td>
                    <strong
                      >{{
                        data.opportunitiesVisitadas +
                        data.opportunitiesCanceladas
                      }}
                    </strong>
                  </td>
                  <td>
                    <strong>100 %</strong>
                  </td>
                </tr>
                <tr>
                  <td>Prospectos Generados</td>
                  <td>
                    <strong>{{ data.opportunitiesVisitadas }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeProspectosTasaConvercion }} %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Oportunidades Canceladas</td>
                  <td>
                    <strong>{{ data.opportunitiesCanceladas }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeCanceladasTasaConvercion }} %</strong
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              Tasa de Oportunidad de Negocio
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <doughnut-chart
                v-if="!dialogLoading"
                :chartdata="chartdata4"
                height="300px"
              ></doughnut-chart>
            </div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Resultado</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Prospectos</td>
                  <td>
                    <strong>{{ data.opportunitiesVisitadas }}</strong>
                  </td>
                  <td>
                    <strong>100 %</strong>
                  </td>
                </tr>
                <tr>
                  <td>Prospectos interesados en visitas recurrentes</td>
                  <td>
                    <strong>{{ data.prospectosVisitasRecurrentes }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{
                        data.porcentajeProspectosVisitasRecurrentes
                      }}
                      %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Prospectos NO interesados</td>
                  <td>
                    <strong>{{ data.prospectosNOVisitasRecurrentes }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{
                        data.porcentajeProspectosNOVisitasRecurrentes
                      }}
                      %</strong
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              Tasa de colocación
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <pie-chart
                v-if="!dialogLoading"
                :chartdata="chartdata6"
                height="300px"
              ></pie-chart>
            </div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Resultado</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Prospectos</td>
                  <td>
                    <strong>{{ data.opportunitiesVisitadas }}</strong>
                  </td>
                  <td>
                    <strong>100 %</strong>
                  </td>
                </tr>
                <tr>
                  <td>Prospectos con Ped.Suge.</td>
                  <td>
                    <strong>{{ data.ProspectosPedidoSugerido }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeProspectosPedidoSugerido }} %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Prospectos sin Ped.Suge.</td>
                  <td>
                    <strong>{{ data.ProspectoSinPedidoSugerido }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeProspectoSinPedidoSugerido }} %</strong
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              Presencia producto IUSA
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <bar-chart
                v-if="!dialogLoading"
                :chartdata="chartdata5"
                height="300px"
              ></bar-chart>
            </div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Resultado</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Prospectos</td>
                  <td>
                    <strong>{{ data.opportunitiesVisitadas }}</strong>
                  </td>
                  <td>
                    <strong>100 %</strong>
                  </td>
                </tr>
                <tr>
                  <td>Producto IUSA</td>
                  <td>
                    <strong>{{ data.prospectosProductoIUSA }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeProspectosProductoIUSA }} %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Otros productos</td>
                  <td>
                    <strong>{{ data.prospectosNOProductoIUSA }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajeProspectosNOProductoIUSA }} %</strong
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-title class="subheading font-weight-bold">
              Pedidos Sugeridos Generados
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <line-chart
                v-if="!dialogLoading"
                :chartdata="chartdata2"
                height="300px"
              ></line-chart>
            </div>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Resultado</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ped. Sug. Generados</td>
                  <td>
                    <strong>{{ data.PedidoSugeridoTotal }}</strong>
                  </td>
                  <td>
                    <strong>100 %</strong>
                  </td>
                </tr>
                <tr>
                  <td>Ped. Sug. Sin Enviar</td>
                  <td>
                    <strong>{{ data.PedidoSugeridoSinEnviar }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajePedidoSugeridoSinEnviar }} %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Ped. Sug. Enviados</td>
                  <td>
                    <strong>{{ data.PedidoSugeridoEnviado }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajePedidoSugeridoEnviado }} %</strong
                    >
                  </td>
                </tr>
                <tr>
                  <td>Ped. Sug. Term. Evidencia</td>
                  <td>
                    <strong>{{ data.PedidoSugeridoTerminado }}</strong>
                  </td>
                  <td>
                    <strong
                      >{{ data.porcentajePedidoSugeridoTerminado }} %</strong
                    >
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card style="height: 650px">
            <v-card-title class="subheading font-weight-bold">
              Familias
            </v-card-title>
            <v-divider></v-divider>
            <div>
              <radar-chart
                v-if="!dialogLoading"
                :chartdata="chartdata7"
                height="400px"
              ></radar-chart>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card style="height: 650px">
            <v-card-title class="subheading font-weight-bold">
              Detalle Familias
            </v-card-title>
            <v-divider></v-divider>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">Indicador</th>
                  <th class="text-left">Unidades</th>
                  <th class="text-left">%</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="resumenVentasFamilia[0].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[0])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_cobre.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    COBRE Y SUS ALEACIONES
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[0].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[0].porcentaje }} %</strong>
                  </td>
                </tr>
                <tr
                  v-if="resumenVentasFamilia[1].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[1])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_electricos.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    ELECTRICOS
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[1].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[1].porcentaje }} %</strong>
                  </td>
                </tr>
                <tr
                  v-if="resumenVentasFamilia[2].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[2])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_esp_industriales.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    ESPECIALIDADES INDUSTRIALES
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[2].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[2].porcentaje }} %</strong>
                  </td>
                </tr>
                <tr
                  v-if="resumenVentasFamilia[3].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[3])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_catalogos.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    EXHIBIDOR Y CATALOGOS
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[3].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[3].porcentaje }} %</strong>
                  </td>
                </tr>
                <tr
                  v-if="resumenVentasFamilia[4].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[4])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_herramientas.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    HERRAMIENTAS
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[4].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[4].porcentaje }} %</strong>
                  </td>
                </tr>
                <tr
                  v-if="resumenVentasFamilia[5].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[5])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_linea_blanca.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    LINEA BLANCA
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[5].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[5].porcentaje }} %</strong>
                  </td>
                </tr>
                <tr
                  v-if="resumenVentasFamilia[6].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[6])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_manejo_agua.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    MANEJO DE AGUA Y GAS
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[6].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[6].porcentaje }} %</strong>
                  </td>
                </tr>
                <tr
                  v-if="resumenVentasFamilia[7].u_pedidas != 0"
                  @click="getDetalleFamilia(resumenVentasFamilia[7])"
                >
                  <td>
                    <v-img
                      src="../../assets/img_pgc/div_medical.png"
                      alt="Eletricos image"
                      width="10"
                    ></v-img>
                    MEDICAL CENTER
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[7].u_pedidas }}</strong>
                  </td>
                  <td>
                    <strong>{{ resumenVentasFamilia[7].porcentaje }} %</strong>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dialog Info Familia-->
      <v-row justify="center">
        <v-dialog
          v-model="dialogDetalleFamilia"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="indigo">
              <v-btn icon dark @click="dialogDetalleFamilia = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title
                >Familia: {{ detalleFamilia.id }} &nbsp; Total Unidades
                {{ detalleFamilia.u_pedidas }}</v-toolbar-title
              >
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-app>
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    dense
                    :headers="headersInfoFamilia"
                    :items-per-page="20"
                    :items="detalleFamilia.lista_material"
                    item-key="id"
                    multi-sort
                    class="elevation-1"
                  >
                  </v-data-table>
                </v-col>
              </v-row>
            </v-app>
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
import LineChart from "@/components/LineChart.vue";
import BarChart from "@/components/BarChart.vue";
import PieChart from "@/components/PieChart.vue";
import DoughnutChart from "@/components/DoughnutChart.vue";
import RadarChart from "@/components/RadarChart.vue";
export default {
  components: {
    LineChart,
    BarChart,
    PieChart,
    DoughnutChart,
    RadarChart,
  },
  data: () => ({
    dialogLoading: false,
    titulo: "Nacional",
    data: [],
    entidades: [],
    entidadSelect: "",
    municipios: [],
    municipioSelect: "",
    chartdata1: {},
    chartdata2: {},
    chartdata3: {},
    chartdata4: {},
    chartdata5: {},
    chartdata6: {},
    chartdata7: {},
    chartdata8: {},
    nombre_municipio: "",
    nombre_entidad: "",
    snackbar: false,
    textAlert: null,
    detalleFamilia: {},
    dialogDetalleFamilia: false,
    headersInfoFamilia: [
      { text: "FOLIO PED.SUGE.", align: "start", value: "folio_pedido" },
      { text: "CODIGO MATERIAL", value: "codigo_material" },
      { text: "MATERIAL", value: "nombre_material" },
      { text: "UNIDADES", value: "unidades_confirmadas" },
    ],
  }),
  async mounted() {
    let self = this;
    self.getReporte();
    self.getEntidades();
  },
  methods: {
    async getReporte() {
      let me = this;
      me.entidadSelect = "";
      me.municipioSelect = "";
      me.municipios = [];
      me.dialogLoading = true;
      await axios
        .post("./getReporte", {
          id: "1",
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.data = response.data;
          me.titulo = "Nacional";
          me.chartdata1 = {
            labels: ["Prog. ruta", "Encuestadas", "Canceladas"],
            datasets: [
              {
                label: "Prog. ruta",
                porcentaje: [
                  100,
                  me.data.porcentajeOportunidadesProspectos,
                  me.data.porcentajeOportunidadesCanceladas,
                ],
                backgroundColor: ["#9dbd1c"],
                data: [me.data.opportunitiesAsignadasRuta],
              },
              {
                label: "Encuestadas",
                porcentaje: [
                  100,
                  me.data.porcentajeOportunidadesProspectos,
                  me.data.porcentajeOportunidadesCanceladas,
                ],
                backgroundColor: ["#26bd1c"],
                data: [me.data.opportunitiesVisitadas],
              },
              {
                label: "Canceladas",
                porcentaje: [
                  100,
                  me.data.porcentajeOportunidadesProspectos,
                  me.data.porcentajeOportunidadesCanceladas,
                ],
                backgroundColor: ["#ab1405"],
                data: [me.data.opportunitiesCanceladas],
              },
              /*{
                label: 'Nuevas',
                porcentaje: [
                  100,
                  me.data.porcentajeOportunidadesProspectos, 
                  me.data.porcentajeOportunidadesCanceladas, 
                  me.data.porcentajeOportunidades_nuevas
                  ],
                backgroundColor: [
                  'rgb(54, 162, 235)']
                  ,
                data: [me.data.oportunidades_nuevas]
              }*/
            ],
          };

          me.chartdata3 = {
            labels: ["Prospectos Generados", "Oportunidades Canceladas"],
            datasets: [
              {
                label: "My First Dataset",
                data: [
                  me.data.opportunitiesVisitadas,
                  me.data.opportunitiesCanceladas,
                ],
                porcentaje: [
                  me.data.porcentajeProspectosTasaConvercion,
                  me.data.porcentajeCanceladasTasaConvercion,
                ],
                fill: false,
                backgroundColor: [
                  "rgb(255, 99, 132)",
                  "rgb(54, 162, 235)",
                  "rgb(255, 205, 86)",
                ],
                tension: 0.1,
              },
            ],
          };

          me.chartdata4 = {
            labels: ["Con Visitas Recurrentes", "Sin visitas"],
            datasets: [
              {
                label: "My First Dataset",
                data: [
                  me.data.prospectosVisitasRecurrentes,
                  me.data.prospectosNOVisitasRecurrentes,
                ],
                porcentaje: [
                  me.data.porcentajeProspectosVisitasRecurrentes,
                  me.data.porcentajeProspectosNOVisitasRecurrentes,
                ],
                fill: false,
                backgroundColor: ["rgb( 13, 43, 155 )", "rgb(205, 195, 69)"],
                tension: 0.1,
              },
            ],
          };

          me.chartdata5 = {
            labels: ["Con Producto IUSA", "Sin Producto IUSA"],
            datasets: [
              {
                label: ["Con Producto IUSA"],
                data: [me.data.prospectosProductoIUSA],
                porcentaje: [
                  me.data.porcentajeProspectosProductoIUSA,
                  me.data.porcentajeProspectosNOProductoIUSA,
                ],
                backgroundColor: ["rgb(141, 69, 205)"],
              },
              {
                label: ["Sin Producto IUSA"],
                data: [me.data.prospectosNOProductoIUSA],
                porcentaje: [
                  me.data.porcentajeProspectosProductoIUSA,
                  me.data.porcentajeProspectosNOProductoIUSA,
                ],
                backgroundColor: ["rgb( 231, 112, 0)"],
              },
            ],
          };

          me.chartdata6 = {
            labels: ["Prospectos con Pedidos", "Prospectos sin Pedidos"],
            datasets: [
              {
                label: "My First Dataset",
                data: [
                  me.data.ProspectosPedidoSugerido,
                  me.data.ProspectoSinPedidoSugerido,
                ],
                porcentaje: [
                  me.data.porcentajeProspectosPedidoSugerido,
                  me.data.porcentajeProspectoSinPedidoSugerido,
                ],
                fill: false,
                backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 205, 86)"],
                tension: 0.1,
              },
            ],
          };

          me.chartdata2 = {
            labels: [
              "Pedidos Generados",
              "Pedidos sin enviar",
              "Pedidos Enviados",
              "Pedidos Terminados",
            ],
            datasets: [
              {
                label: "Pedidos Sugeridos",
                data: [
                  me.data.PedidoSugeridoTotal,
                  me.data.PedidoSugeridoSinEnviar,
                  me.data.PedidoSugeridoEnviado,
                  me.data.PedidoSugeridoTerminado,
                ],
                porcentaje: [
                  100,
                  me.data.porcentajePedidoSugeridoSinEnviar,
                  me.data.porcentajePedidoSugeridoEnviado,
                  me.data.porcentajePedidoSugeridoTerminado,
                ],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          };

          me.resumenVentasFamilia = me.data.resumenVentasFamilia;
          me.chartdata7 = {
            labels: [],
            datasets: [
              {
                data: [],
                porcentaje: [],
                fill: false,
                borderColor: "rgb(77, 163, 24)",
                backgroundColor: "rgb(218, 247, 166)",
                tension: 0.1,
              },
            ],
          };
          for (let index = 0; index < me.resumenVentasFamilia.length; index++) {
            const element = me.resumenVentasFamilia[index];
            if (element["u_pedidas"] != 0) {
              me.chartdata7.labels.push(element["id"]);
              me.chartdata7.datasets[0].data.push(element["u_pedidas"]);
              me.chartdata7.datasets[0].porcentaje.push(element["porcentaje"]);
            }
          }

          me.chartdata8 = {
            labels: ["Negocio inexistente", "Negocio Reubicado", "Otro"],
            datasets: [
              {
                label: "My First Dataset",
                data: [
                  me.data.opportunitiesCanceladasMotivo1,
                  me.data.opportunitiesCanceladasMotivo2,
                  me.data.opportunitiesCanceladasMotivo3,
                ],
                porcentaje: [
                  me.data.porcentajeOpportunitiesCanceladasMotivo1,
                  me.data.porcentajeOpportunitiesCanceladasMotivo2,
                  me.data.porcentajeOpportunitiesCanceladasMotivo3,
                ],
                fill: false,
                backgroundColor: [
                  "rgb(22, 192, 174)",
                  "rgb( 13, 155, 23 )",
                  "rgb( 155, 71, 13)",
                ],
                tension: 0.1,
              },
            ],
          };
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
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
      me.municipioSelect = "";
      //me.data= [];
      await axios
        .post("./getMunicipio", {
          id: me.entidadSelect,
        })
        .then(function (response) {
          // handle success
          me.dialogLoading = false;
          me.municipios = response.data;
          me.getReporteEstados();
        })
        .catch(function (error) {
          me.dialogLoading = false;
          console.log(error);
        });
    },
    getReporteEstados() {
      if (this.entidadSelect == "") {
        this.snackbar = true;
        this.textAlert = "Seleccione Entidad";
        this.snackbarOut();
      } else {
        let me = this;
        me.dialogLoading = true;
        axios
          .post("./getReporteEstado", {
            id_entidad: me.entidadSelect,
            id_municipio: me.municipioSelect,
          })
          .then(function (response) {
            // handle success
            me.dialogLoading = false;
            me.data = response.data;
            me.nombre_entidad = me.data.nombre_entidad;
            //me.nombre_municipio = me.data.nombre_municipio;
            me.titulo = me.nombre_entidad;
            me.chartdata1 = {
              labels: ["Prog. ruta", "Encuestadas", "Canceladas", "Nuevas"],
              datasets: [
                {
                  label: "Prog. ruta",
                  porcentaje: [
                    100,
                    me.data.porcentajeOportunidadesProspectos,
                    me.data.porcentajeOportunidadesCanceladas,
                  ],
                  backgroundColor: ["#9dbd1c"],
                  data: [me.data.opportunitiesAsignadasRuta],
                },
                {
                  label: "Encuestadas",
                  porcentaje: [
                    100,
                    me.data.porcentajeOportunidadesProspectos,
                    me.data.porcentajeOportunidadesCanceladas,
                  ],
                  backgroundColor: ["#26bd1c"],
                  data: [me.data.opportunitiesVisitadas],
                },
                {
                  label: "Canceladas",
                  porcentaje: [
                    100,
                    me.data.porcentajeOportunidadesProspectos,
                    me.data.porcentajeOportunidadesCanceladas,
                  ],
                  backgroundColor: ["#ab1405"],
                  data: [me.data.opportunitiesCanceladas],
                },
                /*{
                label: 'Nuevas',
                porcentaje: [
                  100,
                  me.data.porcentajeOportunidadesProspectos, 
                  me.data.porcentajeOportunidadesCanceladas, 
                  me.data.porcentajeOportunidades_nuevas,
                  ],
                backgroundColor: [
                  'rgb(54, 162, 235)']
                  ,
                data: [me.data.oportunidades_nuevas,]
              }*/
              ],
            };

            me.chartdata3 = {
              labels: ["Prospectos Generados", "Oportunidades Canceladas"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.opportunitiesVisitadas,
                    me.data.opportunitiesCanceladas,
                  ],
                  porcentaje: [
                    me.data.porcentajeProspectosTasaConvercion,
                    me.data.porcentajeCanceladasTasaConvercion,
                  ],
                  fill: false,
                  backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                  ],
                  tension: 0.1,
                },
              ],
            };

            me.chartdata4 = {
              labels: ["Con Visitas Recurrentes", "Sin visitas"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.prospectosVisitasRecurrentes,
                    me.data.prospectosNOVisitasRecurrentes,
                  ],
                  porcentaje: [
                    me.data.porcentajeProspectosVisitasRecurrentes,
                    me.data.porcentajeProspectosNOVisitasRecurrentes,
                  ],
                  fill: false,
                  backgroundColor: ["rgb( 13, 43, 155 )", "rgb(205, 195, 69)"],
                  tension: 0.1,
                },
              ],
            };

            me.chartdata5 = {
              labels: ["Con Producto IUSA", "Sin Producto IUSA"],
              datasets: [
                {
                  label: ["Con Producto IUSA"],
                  data: [me.data.prospectosProductoIUSA],
                  porcentaje: [
                    me.data.porcentajeProspectosProductoIUSA,
                    me.data.porcentajeProspectosNOProductoIUSA,
                  ],
                  backgroundColor: ["rgb(141, 69, 205)"],
                },
                {
                  label: ["Sin Producto IUSA"],
                  data: [me.data.prospectosNOProductoIUSA],
                  porcentaje: [
                    me.data.porcentajeProspectosProductoIUSA,
                    me.data.porcentajeProspectosNOProductoIUSA,
                  ],
                  backgroundColor: ["rgb( 231, 112, 0)"],
                },
              ],
            };

            me.chartdata6 = {
              labels: ["Prospectos con Pedidos", "Prospectos sin Pedidos"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.ProspectosPedidoSugerido,
                    me.data.ProspectoSinPedidoSugerido,
                  ],
                  porcentaje: [
                    me.data.porcentajeProspectosPedidoSugerido,
                    me.data.porcentajeProspectoSinPedidoSugerido,
                  ],
                  fill: false,
                  backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 205, 86)"],
                  tension: 0.1,
                },
              ],
            };

            me.chartdata2 = {
              labels: [
                "Pedidos Generados",
                "Pedidos sin enviar",
                "Pedidos Enviados",
                "Pedidos Terminados",
              ],
              datasets: [
                {
                  label: "Pedidos Sugeridos",
                  data: [
                    me.data.PedidoSugeridoTotal,
                    me.data.PedidoSugeridoSinEnviar,
                    me.data.PedidoSugeridoEnviado,
                    me.data.PedidoSugeridoTerminado,
                  ],
                  porcentaje: [
                    100,
                    me.data.porcentajePedidoSugeridoSinEnviar,
                    me.data.porcentajePedidoSugeridoEnviado,
                    me.data.porcentajePedidoSugeridoTerminado,
                  ],
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            };
            me.resumenVentasFamilia = me.data.resumenVentasFamilia;
            me.chartdata7 = {
              labels: [],
              datasets: [
                {
                  data: [],
                  porcentaje: [],
                  fill: false,
                  borderColor: "rgb(77, 163, 24)",
                  backgroundColor: "rgb(218, 247, 166)",
                  tension: 0.1,
                },
              ],
            };
            for (
              let index = 0;
              index < me.resumenVentasFamilia.length;
              index++
            ) {
              const element = me.resumenVentasFamilia[index];
              if (element["u_pedidas"] != 0) {
                me.chartdata7.labels.push(element["id"]);
                me.chartdata7.datasets[0].data.push(element["u_pedidas"]);
                me.chartdata7.datasets[0].porcentaje.push(
                  element["porcentaje"]
                );
              }
            }

            me.chartdata8 = {
              labels: ["Negocio inexistente", "Negocio Reubicado", "Otro"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.opportunitiesCanceladasMotivo1,
                    me.data.opportunitiesCanceladasMotivo2,
                    me.data.opportunitiesCanceladasMotivo3,
                  ],
                  porcentaje: [
                    me.data.porcentajeOpportunitiesCanceladasMotivo1,
                    me.data.porcentajeOpportunitiesCanceladasMotivo2,
                    me.data.porcentajeOpportunitiesCanceladasMotivo3,
                  ],
                  fill: false,
                  backgroundColor: [
                    "rgb(22, 192, 174)",
                    "rgb( 13, 155, 23 )",
                    "rgb( 155, 71, 13)",
                  ],
                  tension: 0.1,
                },
              ],
            };
          })
          .catch(function (error) {
            me.dialogLoading = false;
            console.log(error);
          });
      } //else end
    },
    async getReporteMunicipio() {
      if (this.entidadSelect == "") {
        this.snackbar = true;
        this.textAlert = "Seleccione Entidad";
        this.snackbarOut();
      } else if (this.municipioSelect == "") {
        this.snackbar = true;
        this.textAlert = "Seleccione Municipio";
        this.snackbarOut();
      } else {
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
            me.data = response.data;
            me.nombre_entidad = me.data.nombre_entidad;
            me.nombre_municipio = me.data.nombre_municipio;
            me.titulo = me.nombre_entidad + "-" + me.nombre_municipio;
            me.chartdata1 = {
              labels: ["Prog. ruta", "Encuestadas", "Canceladas", "Nuevas"],
              datasets: [
                {
                  label: "Prog. ruta",
                  porcentaje: [
                    100,
                    me.data.porcentajeOportunidadesProspectos,
                    me.data.porcentajeOportunidadesCanceladas,
                  ],
                  backgroundColor: ["#9dbd1c"],
                  data: [me.data.opportunitiesAsignadasRuta],
                },
                {
                  label: "Encuestadas",
                  porcentaje: [
                    100,
                    me.data.porcentajeOportunidadesProspectos,
                    me.data.porcentajeOportunidadesCanceladas,
                  ],
                  backgroundColor: ["#26bd1c"],
                  data: [me.data.opportunitiesVisitadas],
                },
                {
                  label: "Canceladas",
                  porcentaje: [
                    100,
                    me.data.porcentajeOportunidadesProspectos,
                    me.data.porcentajeOportunidadesCanceladas,
                  ],
                  backgroundColor: ["#ab1405"],
                  data: [me.data.opportunitiesCanceladas],
                },
                /*{
                label: 'Nuevas',
                porcentaje: [
                  100,
                  me.data.porcentajeOportunidadesProspectos, 
                  me.data.porcentajeOportunidadesCanceladas, 
                  me.data.porcentajeOportunidades_nuevas,
                  ],
                backgroundColor: [
                  'rgb(54, 162, 235)']
                  ,
                data: [me.data.oportunidades_nuevas,]
              }*/
              ],
            };

            me.chartdata3 = {
              labels: ["Prospectos Generados", "Oportunidades Canceladas"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.opportunitiesVisitadas,
                    me.data.opportunitiesCanceladas,
                  ],
                  porcentaje: [
                    me.data.porcentajeProspectosTasaConvercion,
                    me.data.porcentajeCanceladasTasaConvercion,
                  ],
                  fill: false,
                  backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                  ],
                  tension: 0.1,
                },
              ],
            };

            me.chartdata4 = {
              labels: ["Con Visitas Recurrentes", "Sin visitas"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.prospectosVisitasRecurrentes,
                    me.data.prospectosNOVisitasRecurrentes,
                  ],
                  porcentaje: [
                    me.data.porcentajeProspectosVisitasRecurrentes,
                    me.data.porcentajeProspectosNOVisitasRecurrentes,
                  ],
                  fill: false,
                  backgroundColor: ["rgb( 13, 43, 155 )", "rgb(205, 195, 69)"],
                  tension: 0.1,
                },
              ],
            };

            me.chartdata5 = {
              labels: ["Con Producto IUSA", "Sin Producto IUSA"],
              datasets: [
                {
                  label: ["Con Producto IUSA"],
                  data: [me.data.prospectosProductoIUSA],
                  porcentaje: [
                    me.data.porcentajeProspectosProductoIUSA,
                    me.data.porcentajeProspectosNOProductoIUSA,
                  ],
                  backgroundColor: ["rgb(141, 69, 205)"],
                },
                {
                  label: ["Sin Producto IUSA"],
                  data: [me.data.prospectosNOProductoIUSA],
                  porcentaje: [
                    me.data.porcentajeProspectosProductoIUSA,
                    me.data.porcentajeProspectosNOProductoIUSA,
                  ],
                  backgroundColor: ["rgb( 231, 112, 0)"],
                },
              ],
            };

            me.chartdata6 = {
              labels: ["Prospectos con Pedidos", "Prospectos sin Pedidos"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.ProspectosPedidoSugerido,
                    me.data.ProspectoSinPedidoSugerido,
                  ],
                  porcentaje: [
                    me.data.porcentajeProspectosPedidoSugerido,
                    me.data.porcentajeProspectoSinPedidoSugerido,
                  ],
                  fill: false,
                  backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 205, 86)"],
                  tension: 0.1,
                },
              ],
            };

            me.chartdata2 = {
              labels: [
                "Pedidos Generados",
                "Pedidos sin enviar",
                "Pedidos Enviados",
                "Pedidos Terminados",
              ],
              datasets: [
                {
                  label: "Pedidos Sugeridos",
                  data: [
                    me.data.PedidoSugeridoTotal,
                    me.data.PedidoSugeridoSinEnviar,
                    me.data.PedidoSugeridoEnviado,
                    me.data.PedidoSugeridoTerminado,
                  ],
                  porcentaje: [
                    100,
                    me.data.porcentajePedidoSugeridoSinEnviar,
                    me.data.porcentajePedidoSugeridoEnviado,
                    me.data.porcentajePedidoSugeridoTerminado,
                  ],
                  fill: false,
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1,
                },
              ],
            };
            me.resumenVentasFamilia = me.data.resumenVentasFamilia;
            me.chartdata7 = {
              labels: [],
              datasets: [
                {
                  data: [],
                  porcentaje: [],
                  fill: false,
                  borderColor: "rgb(77, 163, 24)",
                  backgroundColor: "rgb(218, 247, 166)",
                  tension: 0.1,
                },
              ],
            };
            for (
              let index = 0;
              index < me.resumenVentasFamilia.length;
              index++
            ) {
              const element = me.resumenVentasFamilia[index];
              if (element["u_pedidas"] != 0) {
                me.chartdata7.labels.push(element["id"]);
                me.chartdata7.datasets[0].data.push(element["u_pedidas"]);
                me.chartdata7.datasets[0].porcentaje.push(
                  element["porcentaje"]
                );
              }
            }

            me.chartdata8 = {
              labels: ["Negocio inexistente", "Negocio Reubicado", "Otro"],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [
                    me.data.opportunitiesCanceladasMotivo1,
                    me.data.opportunitiesCanceladasMotivo2,
                    me.data.opportunitiesCanceladasMotivo3,
                  ],
                  porcentaje: [
                    me.data.porcentajeOpportunitiesCanceladasMotivo1,
                    me.data.porcentajeOpportunitiesCanceladasMotivo2,
                    me.data.porcentajeOpportunitiesCanceladasMotivo3,
                  ],
                  fill: false,
                  backgroundColor: [
                    "rgb(22, 192, 174)",
                    "rgb( 13, 155, 23 )",
                    "rgb( 155, 71, 13)",
                  ],
                  tension: 0.1,
                },
              ],
            };
          })
          .catch(function (error) {
            me.dialogLoading = false;
            console.log(error);
          });
      } //else end
    },
    getDetalleFamilia(item) {
      this.detalleFamilia = item;
      this.dialogDetalleFamilia = true;
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
