<template>
  <v-container fluid>
    <v-card cols="12" class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0">
      <v-card-title style="color: #000; font-weight: 700"
        >Crear Pedido Clientes</v-card-title
      >
      <v-row align="center">
        <v-col cols="12">
          <v-autocomplete
            v-model="customerSelect"
            :items="customerList"
            :item-text="getItemTextCustomers"
            return-object
            dense
            filled
            rounded
            label="BUSCAR CLIENTE"
            class="mt-xs-4 mt-md-4 mt-lg-4"
            @change="setInfoCustomer"
          >
             <!--<template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="remove(data.item)"
                  >
                    <v-avatar left>
                      <v-img :src="data.item.avatar"></v-img>
                    </v-avatar>
                    {{ data.item.name }}
                  </v-chip>
                </template>-->
                <template v-slot:item="data">
                    <v-list-item-avatar>
                      <img src="img/icon_default_user.svg"
                    alt="IUSA"
                    style="width: 90%; height: 90%">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-html="getItemTextCustomers(data.item)"></v-list-item-title>
                    </v-list-item-content>
                </template>
              </v-autocomplete>
        </v-col>
      </v-row>
      <v-row
        align="center"
        class="pa-xs-0 pa-md-0 pa-lg-0 mt-xs-0 mt-md-0 mt-lg-0"
        v-if="customerSelect"
      >
        <!-- <v-col cols="12">
          <h6>
            <span
              >SELECCIONADO: {{ customerSelect.KUNNR }} -
              {{ customerSelect.NAME1 }}</span
            >
          </h6>
        </v-col> -->
      </v-row>
      <v-row
        class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0"
        v-if="customerSelect"
      >
         <v-col cols="12"  style="padding:20px;">
          <v-card style="border-radius:50px;">
            <v-card-title style="color: #000; font-weight: 800"
              >DATOS DEL CLIENTE</v-card-title
            >
            <v-row>
              <v-col cols="6" sm="4" md="3" style="text-align: center">
                <v-avatar size="120" style="border: solid 2px #ff000a">
                  <img
                    src="img/icon_default_user.svg"
                    alt="IUSA"
                    style="width: 90%; height: 90%"
                  />
                </v-avatar>
              </v-col>
              <v-col cols="6" sm="4" md="3">
                <v-card-subtitle class="pa-lg-2">
                  <span style="font-weight: 800"
                    >CLIENTE: {{ customerInfo.cliente_datos.KUNNR }} -
                    {{ customerInfo.cliente_datos.NAME1 }}</span
                  >
                  <br />RFC: {{ customerInfo.cliente_datos.STCD1 }} <br />GRUPO:
                  {{ customerInfo.cliente_datos.KDGRP }} <br />TIPO:
                  {{ customerInfo.cliente_datos.ZTERM }} -
                  {{ customerInfo.cliente_datos.VTEXT }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <v-card-subtitle class="pa-lg-2">
                  <p style="text-align: center"> LIMITE DE CRÉDITO:
                  <span style="font-weight: 800"
                    >${{ customerInfo.cliente_datos.KLIMK }}</span
                  ></p>
                  <v-progress-linear v-model="porcentaje" height="25">
                    <strong>{{ porcentaje }}%</strong>
                  </v-progress-linear>
                  <v-row>
                    <v-col cols="6" sm="12" md="6">
                      <span style="font-size: 12px"
                        >SALDO AL CORTE:
                        <span style="font-weight: 800; font-size: 14px"
                          >${{ customerInfo.cliente_datos.SKFOR }}</span
                        ></span
                      ></v-col
                    >
                    <v-col cols="6" sm="12" md="6">
                      <span style="font-size: 12px"
                        >CREDITO DISPONIBLE:
                        <span style="font-weight: 800; font-size: 14px"
                          >${{ customerInfo.cliente_datos.CREDD }}
                        </span></span
                      ></v-col
                    >
                  </v-row>
                  <p></p>
                  <div style="text-align: center">
                    <span style="text-center;"
                      >ESTATUS FOLIO: Análisis Crediticio</span
                    >
                  </div>
                </v-card-subtitle>
              </v-col>
              <v-col md="3" class="d-none d-md-block">
                <v-card-subtitle>
                  MONTO VENCIDO: ${{ customerInfo.cliente_agotacart.T7 }} <br />
                  PARTIDAS VENCIDAS: {{ customerInfo.vencidas }}
                  <hr />
                  <div style="text-align: center">
                    <span style="font-size: 28px">${{ total }}</span> <br />
                    MONTO TOTAL DEL PEDIDO
                  </div>
                  <!-- CREDITO DISPONIBLE:
                  {{ parseFloat(customerInfo.cliente_datos.CREDD) }} -->
                </v-card-subtitle>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row
        class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0"
        v-if="customerSelect && customerInfo.cliente_datos.ZTERM == 'IU00'"
      >
        <v-col cols="12" style="padding:20px;"> 
          <v-card style="border-radius:50px;">
            <v-card-title style="color: #000; font-weight: 800"
              >DATOS FISCALES</v-card-title
            >
            <v-row>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  v-model="metodo_pago"
                  :items="metodos_de_pago"
                  item-text="des"
                  return-object
                  dense
                  filled
                  rounded
                  label="METODO DE PAGO"
                  class="mt-xs-4 mt-md-4 mt-lg-4"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  v-model="via_pago"
                  :items="via_de_pago_array"
                  item-text="des"
                  return-object
                  dense
                  filled
                  rounded
                  label="VIA DE PAGO"
                  class="mt-xs-4 mt-md-4 mt-lg-4"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-autocomplete
                  v-model="uso_cfdi"
                  :items="uso_cfdi_array"
                  item-text="des"
                  return-object
                  dense
                  filled
                  rounded
                  label="USO DE CFDI"
                  class="mt-xs-4 mt-md-4 mt-lg-4"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row
        class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0"
        v-if="customerSelect"
      >
        <v-col cols="12">
          <v-card style="border-radius:40px;"> 
            <v-card-title style="color: #000; font-weight: 800"
              >Carrito de Compra</v-card-title
            >

            <v-row v-if="hasError">
              <v-col cols="12">
                <v-alert text dense outlined type="error">
                  {{ hasError }}
                </v-alert>
              </v-col>
            </v-row>

            <v-row
              class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0"
              v-if="customerSelect"
              style="margin:10px;"
            >
              <v-col cols="12" xl="4" lg="4" md="6">
                <v-text-field
                  label="CÓDIGO DE MATERIAL"
                  required
                  v-model="code"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="6">
                <v-text-field
                  label="UNIDADES"
                  required
                  v-model="units"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="12" class="d-flex justify-content-center">
                <v-btn
                  dark
                  rounded
                  color="#0080FF"
                  @click="getMaterial()"
                >
                  <v-icon dark> mdi-plus </v-icon>
                  Agregar al Carrito
                </v-btn>
              </v-col>              
            </v-row>
            <div class="d-lg-none" style="padding:20px;" v-if="cart.length != 0">
                    <v-row class="d-flex justify-content-center"
                      >Subtotal:   
                      <strong style="margin-left: 10px;">$ {{ formatPrice(subtotal) }}</strong></v-row 
                    ><br>            
                    <v-row class="d-flex justify-content-center"
                      >IVA 16%:  <strong style="margin-left: 10px;">$ {{ formatPrice(iva) }}</strong></v-row 
                    ><br>               
                    <v-row class="d-flex justify-content-center"
                      >Total:  <strong style="margin-left: 10px;font-size: 30px;">
                        $ {{ formatPrice(total) }}</strong></v-row 
                    >
              </div>
            <!-- <v-divider></v-divider> -->
            <v-card class="mb-lg-4 mb-md-4 mb-xs-10" color="#F3F3F3" v-if="cart.length != 0">
              <p style="margin-left: 30px;"><strong>Detalle Compra</strong></p>
              <v-row dense v-if="customerSelect">
                <v-col v-for="(item, i) in cart" :key="i" cols="12" md="10" lg="10" xl="10">               
                        <v-row>
                          <v-col cols="6" sm="3" md="3">                    
                              <v-img
                                :src="item.imagen_url"
                                width="100"
                                @click="seeImageDetail(item)"
                                style="
                                  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
                                    0 3px 6px rgba(0, 0, 0, 0.23);
                                margin:20px;"
                              />                            
                          </v-col>
                          <v-col cols="6" sm="3" md="3">
                            <p
                              class="pa-lg-2"
                              style="font-size: 12px"
                            >
                              <strong>{{ item.nombre_material }}</strong><br>
                              <strong>{{item.codigo_material}}</strong><br>
                              U. MED: {{ item.unidad_medida }} | EMPAQUE:{{item.empaque}}<br>
                              EXIST: {{ item.existencia }} <br>
                              EXIST CDPT:{{ item.existencia_cdpt }}<br>
                              PRE.UNITARIO: ${{ item.precio_lista }} <br />
                              <strong>PRE.DESCUENTO: ${{ item.importe_desciento }}</strong><br />
                              <strong>IMPORTE: ${{ item.importe_producto }}</strong>
                            </p>
                          </v-col>
                          <hr>
                          <v-col cols="12" sm="6" md="6">
                          <p class="d-flex justify-content-center"><strong>Unidades Confirmadas:</strong></p>
                            <v-text-field
                              v-model="item.u_confirm"
                              @keydown.enter.prevent="actualizarItem(i)"
                            >
                            
                              <v-icon
                                slot="append"
                                color="red"
                                @click="actualizarItemMas(i)"
                              >
                                mdi-plus
                              </v-icon>
                              <v-icon
                                slot="prepend"
                                color="green"
                                @click="actualizarItemMenos(i)"
                              >
                                mdi-minus
                              </v-icon>
                            </v-text-field>
                            <p class="d-flex justify-content-center">
                              <strong>U. RECORD. {{ item.recordatorios }}</strong> 
                              <v-btn
                              style="margin-left:10px;"
                              dark
                              rounded
                              color="red darken-2"
                              elevation="2"
                              small
                              @click="deleteItem(i)"
                            >Eliminar</v-btn>
                            </p>
                            <p class="d-flex justify-content-center">
                              <button
                                :class="'btn-lg '+item.validacion"
                                style="padding 20px;"
                              >{{item.validacion}}</button>
                            </p>
                          </v-col>                          
                        </v-row>
                </v-col>
                <v-col cols="2" class="d-none d-md-block">
                  <label
                    >Subtotal
                    <strong>$ {{ formatPrice(subtotal) }}</strong></label
                  >            
                  <label
                    >IVA 16% <strong>$ {{ formatPrice(iva) }}</strong></label
                  >               
                  <label
                    >Total <v-card-title style="color: #000; font-weight: 800"
              >$ {{ formatPrice(total) }}</v-card-title></label
                  >
                </v-col>
              </v-row>
            </v-card>
          </v-card>
        </v-col>
      </v-row>

      <v-row
        class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0"
        v-if="customerSelect && cart.length != 0"
      >
        <v-col cols="12"  style="padding:40px;">
          <v-card style="border-radius:50px;">
             <v-card-title style="color: #000; font-weight: 800"
              >Datos del Pedido</v-card-title
            >

            <v-row
              class="pa-xs-2 pa-md-2 pa-lg-2 mt-xs-0 mt-md-0 mt-lg-0"
              v-if="customerSelect"
              style="margin:10px;"
            >
              <v-col cols="12" sm="4">
                <v-text-field
                  label="ORDEN DE COMPRA"
                  required
                  v-model="orden_compra"
                ></v-text-field>
                <v-text-field
                  label="DOCUMENTOS RELACIONADOS"
                  required
                  v-model="documentos_relacionados"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-autocomplete
                  v-model="destino"
                  :items="customerInfo.destinos_cliente"
                  :item-text="getItemTextDestinations"
                  return-object
                  dense
                  filled
                  rounded
                  label="DESTINO DE MERCANCIA"
                  class="mt-xs-4 mt-md-4 mt-lg-4"
                >
                </v-autocomplete>
                <v-autocomplete
                  v-model="cfdi_relac"
                  :items="cfdi_relac_array"
                  item-text="des"
                  return-object
                  dense
                  filled
                  rounded
                  label="CFDI RELAC."
                >
                </v-autocomplete>
              </v-col>
              
              <v-col cols="4">
                <v-switch
                  v-model="banderaProgramado"
                  label="Pedido programado"
                ></v-switch>

                <v-dialog
                  ref="dialogf"
                  v-model="modal"
                  :return-value.sync="date"
                  persistent
                  width="290px"
                  v-if="banderaProgramado == true"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fecha_programado"
                      label="Fecha"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_programado"
                    scrollable
                    :min="date"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialogf.save(fecha_programado)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>

            <v-btn
              block
              elevation="2"
              color="success"
              large
              rounded
              v-if="customerSelect && cart.length != 0"
              @click="setOrder()"
            > 
            <v-icon dark> mdi-check </v-icon>
              Comprar Ahora
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
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
    <!-- Dialog loading -->
    <v-row justify="center">
      <v-dialog
        v-model="dialogCatalogo"
        hide-overlay
        width="600"
        transition="dialog-bottom-transition"
        justify="center"
      >
        <v-card justify="center" v-if="itemSelect">
          <v-card-text> Detalle del producto </v-card-text>
          <v-avatar class="ma-3" size="100" tile>
            <v-img
              :src="itemSelect.imagen_url"
              width="100"
              style="
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
                  0 3px 6px rgba(0, 0, 0, 0.23);
              "
            />
          </v-avatar>
          <v-card-text>
            Ficha tecnica
            <ul>
              <li>
                {{ itemSelect.codigo_material }} -
                {{ itemSelect.nombre_material }}
              </li>
            </ul>
            <ul>
              <li>Sin datos</li>
            </ul>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialogCatalogo = false">Cerrar</v-btn>
          </v-card-actions>
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
.Disponible {
  background-color: green;
  color: white;
}
.Parcial {
  background-color: orangered;
  color: white;
}
.vertical {
      border-left: 6px solid blue;
      height: 200px;
      position:absolute;
      left: 50%;
    }
</style>
<script>
import axios from "axios";
export default {
  data: () => ({
    dialogLoading: false,
    dialogCatalogo: false,
    snackbar: false,
    textAlert: null,
    order: null,
    hasError: null,
    msg: null,
    cart: [],
    materialError: null,
    units: null,
    code: null,
    orden_compra: null,
    destino: null,
    customerList: [],
    metodo_pago: null,
    via_pago: null,
    uso_cfdi: null,
    documentos_relacionados: null,
    cfdi_relac: null,
    credi: null,
    subtotal: 0,
    iva: 0,
    total: 0,
    customerInfo: null,
    banderaProgramado: false,
    fecha_programado: null,
    customerSelect: null,
    cliente_datos: null,
    modal: false,
    porcentaje: null,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    itemSelect: null,
    cfdi_relac_array: [
      { id: "00", des: "0 - Sin selección" },
      { id: "04", des: "04 - Refacturacion" },
    ],
    metodos_de_pago: [
      { id: "PPD", des: "Pago Parc o Diferido" },
      { id: "PUE", des: "Pago en 1 Sola Exhib" },
    ],
    via_de_pago_array: [
      { id: "S", des: " 01 Efectivo" },
      { id: "T", des: " 03 Transferencia" },
      { id: "U", des: " 03 Transf Electrónica d Fondos" },
      { id: "5", des: " 15 Condonación" },
      { id: "6", des: " 06 Dinero electrónico" },
      { id: "7", des: " 27 A satisfacción del acreedor" },
      { id: "A", des: " 02 Cheque nominativo" },
      { id: "B", des: " 03 Transfer. Bancomer Terceros" },
      { id: "C", des: " 02 Cheque" },
      { id: "D", des: " 02 CHEQUE OCURRE" },
      { id: "E", des: " 01 Efectivo" },
      { id: "F", des: " 99 No Identificado" },
      { id: "G", des: " 03 Transferencia InterbancHSBC" },
      { id: "H", des: " 03 Transferencia Bancaria HSBC" },
      { id: "I", des: " 03 Transferencia Interbancaria" },
      { id: "J", des: " 30 Aplicación Anticipos" },
      { id: "K", des: " 12 Dación de pago" },
      { id: "L", des: " 02 Cheque sin Leyenda p/Abono" },
      { id: "M", des: " Pagado/Prepaid" },
      { id: "N", des: " Por Cobrar/Collect" },
      { id: "O", des: " 28 Tarjeta de Débito" },
      { id: "P", des: " Pagaré" },
      { id: "Q", des: " 17 Compensación" },
      { id: "R", des: " 04 Tarjeta de Crédito" },
      { id: "V", des: " 03 TRANSFERENCIA ELECTRONICA" },
      { id: "W", des: " 99 Otros" },
      { id: "X", des: " Check BOFA - FX or Single Curr" },
      { id: "Y", des: " Bank Transfer BOFA - IFT" },
      { id: "Z", des: " Wire BOFA - Fx Funds Transfer" },
    ],
    uso_cfdi_array: [
      { id: "G03", des: " Gastos en general" },
      { id: "D01", des: " Hon Medicos,Dentales" },
      { id: "D02", des: " Gts Med x incap o di" },
      { id: "D04", des: " Donativos" },
      { id: "D05", des: " Int reales efec pag" },
      { id: "D06", des: " Aport volunt al SAR" },
      { id: "D07", des: " Primas x seg gts med" },
      { id: "D08", des: " Gts transp esc oblig" },
      { id: "D09", des: " Dep ctas p el ahorro" },
      { id: "D10", des: " Pago x serv educativ" },
      { id: "G01", des: " Adq de mercancías" },
      { id: "G02", des: " Devol, desc y bonif" },
      { id: "D03", des: " Gastos funerales" },
      { id: "I01", des: " Construcciones" },
      { id: "I02", des: " Mob y eq of x invers" },
      { id: "I03", des: " Equipo de transporte" },
      { id: "I04", des: " Eq de computo y accs" },
      { id: "I05", des: " Dados,troq,mod,matr" },
      { id: "I06", des: " Comunic telefónicas" },
      { id: "I07", des: " Comunic satelitales" },
      { id: "I08", des: " Otra maquinaria y eq" },
      { id: "P01", des: " Por definir" },
    ],
  }),
  async mounted() {
    let self = this;
    self.getCustomers();
  },
  methods: {
    async getCustomers() {
      this.dialogLoading = true;
      await axios
        .post("getCustomers", {
          usuario: localStorage.getItem("employee_number"),
          tipo: localStorage.getItem("employee_type"),
        })
        .then((response) => {
          this.dialogLoading = false;
          this.customerList = response.data;
          this.customerList.pop();
          this.customerList.push({
                  KTOKD:"CPD",
                  KUNNR:"0000002674",
                  NAME1:"CLIENTE DESARROLLO MINORISTA",
                  VKBUR:"IU44",
                  VTWEG:"DT"
                })
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
    },
    setInfoCustomer() {
      this.dialogLoading = true;
      axios
        .post("InfoCustomer", {
          usuario: localStorage.getItem("employee_number"),
          tipo: localStorage.getItem("employee_type"),
          cliente: this.customerSelect.KUNNR,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.customerInfo = response.data;
          this.saldo = this.customerInfo.cliente_datos.SKFOR.replace(/,/g, "");
          this.limite = this.customerInfo.cliente_datos.KLIMK.replace(/,/g, "");
          this.porcentaje =
            (parseInt(this.saldo) * 100) / parseInt(this.limite);
          this.porcentaje = parseInt(this.porcentaje);
          this.customerInfo.destinos_cliente.pop();
        })
        .catch((error) => {
          this.dialogLoading = false;
          alert(error);
        })
        .finally(() => (this.dialogLoading = false));
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
          .post("getMaterialEsporadico", {
            code: this.code,
            units: this.units,
            vendedor: localStorage.getItem("employee_number"),
            puesto: localStorage.getItem("employee_type"),
            idCliente: this.customerSelect.KUNNR,
            VKORG: "IUS2",
            VTWEG: this.customerSelect.VTWEG,
            VKBUR: this.customerSelect.VKBUR,
          })
          .then((response) => {
            this.dialogLoading = false;
            this.hasError = response.data.mensaje_error;
            if (this.hasError === "") {
              this.cart.push(response.data.cadena_result);
              this.code = null;
              this.units = null;
              this.validacionCredicticia();
            }
          })
          .catch((error) => {
            this.dialogLoading = false;
            this.hasError = error;
          })
          .finally(() => (this.dialogLoading = false));
      }
    },
    validacionCredicticia() {
      this.credi = 1;
      this.bloqueo = 1;
      this.subtotal = 0;
      this.iva = 0;
      this.total = 0;
      this.errorgerente = 0;
      this.errorcomercial = 0;
      this.total_margen_utilidad = null;
      if (this.cart.length == 1) {
        var ver_sector_1 = this.cart[0];
        var sector_1 = ver_sector_1["sector"];
      }
      for (let index = 0; index < this.cart.length; index++) {
        const element = this.cart[index];
        var importe_producto = element["importe_producto"];
        var margen = element["margen_utilidad"];
        var margen_minimo_definido = element["margen_minimo_definido"];
        var sector2 = element["sector"];
        if (sector2 != sector_1) {
          margen_minimo_definido = 8; //mezcla
        }
        this.subtotal += parseFloat(importe_producto);
        this.total_margen_utilidad += margen;
        this.errorgerente += element["errorgerente"];
        this.errorcomercial += element["errorcomercial"];
      } //end for
      this.iva = this.subtotal * 0.16;
      this.total = this.subtotal + this.iva;

      var margen_minimo = (this.total_margen_utilidad / this.subtotal) * 100;
      if (margen_minimo < margen_minimo_definido) {
        console.log("cambio gerente por el margen");
        this.errorgerente = this.errorgerente + 1;
      }
      //damos por echo que es un cliente de contado
      if (this.errorgerente == 0 && this.errorcomercial == 0) {
        console.log("El pedido sera bloqueado por credito");
        this.credi = 2;
      } else if (this.errorcomercial != 0 && this.errorgerente == 0) {
        console.log("El pedido sera bloqueado por autorisación gerente");
        this.credi = 4;
      } else if (this.errorcomercial == 0 && this.errorgerente != 0) {
        console.log(
          "El pedido sera bloqueado por autorisación de la gerencia y crédito"
        );
        this.credi = 6;
      } else if (this.errorcomercial != 0 && this.errorgerente != 0) {
        console.log(
          "El pedido sera bloqueado por autorisación de la gerencia, comercial y crédito"
        );
        this.credi = 8;
      }
      this.subtotal = this.subtotal.toFixed(2);
      this.iva = this.iva.toFixed(2);
      this.total = this.total.toFixed(2);
    },
    formatPrice(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    deleteItem(index) {
      this.cart.splice(index, 1);
      this.validacionCredicticia();
    },
    async setOrder() {
      if (this.total <= 5000 && this.banderaProgramado == false) {
        this.snackbar = true;
        this.textAlert = "El pedido debe ser mayor a $5000";
        this.snackbarOut();
      } else if (
        (this.customerInfo.cliente_datos.ZTERM == "IU00" &&
          this.metodo_pago == null) ||
        this.metodo_pago == ""
      ) {
        this.snackbar = true;
        this.textAlert = "Por favor seleccionar metodo de pago.";
        this.snackbarOut();
      } else if (
        (this.customerInfo.cliente_datos.ZTERM == "IU00" &&
          this.via_pago == null) ||
        this.via_pago == ""
      ) {
        this.snackbar = true;
        this.textAlert = "Por favor seleccionar Vía de pago.";
        this.snackbarOut();
      } else if (
        (this.customerInfo.cliente_datos.ZTERM == "IU00" &&
          this.uso_cfdi == null) ||
        this.uso_cfdi == ""
      ) {
        this.snackbar = true;
        this.textAlert = "Por favor seleccionar Uso de CFDI";
        this.snackbarOut();
      } else if (this.orden_compra == null || this.orden_compra == "") {
        this.snackbar = true;
        this.textAlert = "Por favor ingresar Orden de compra.";
        this.snackbarOut();
      } else if (this.destino == null || this.destino == "") {
        this.snackbar = true;
        this.textAlert = "Por favor ingresar destino.";
        this.snackbarOut();
      } else {
        if (this.customerInfo.cliente_datos.ZTERM == "IU00") {
          this.metodos_de_pago = this.metodo_pago.id;
          this.via_de_pago = this.via_pago.id;
          this.uso_cfdi = this.uso_cfdi.id;
        }
        this.dialogLoading = true;
        await axios
          .post("setOrderCustomer", {
            orden_compra: this.orden_compra,
            destino_compra: this.destino.KUNNR,
            carrito: this.cart,
            vendedor: localStorage.getItem("employee_number"),
            puesto: localStorage.getItem("employee_type"),
            idCliente: this.customerSelect.KUNNR,
            VKORG: "IUS2",
            VTWEG: this.customerSelect.VTWEG,
            VKBUR: this.customerSelect.VKBUR,
            metodos_de_pago: this.metodo_pago,
            via_de_pago: this.via_pago,
            uso_cfdi: this.uso_cfdi,
            documentos: this.documentos_relacionados,
            refacturacion: this.cfdi_relac,
            nombre: this.prospecto_nombre,
            direccion: this.prospecto_direccion,
            ciudad: this.prospecto_ciudad,
            cp: this.prospecto_cp,
            telefono: this.prospecto_telefono,
            region: this.customerSelect.KUNNR,
            rfc: this.rfc,
            credi: this.credi,
            bandera_programado: this.banderaProgramado,
            fecha_rec: this.formatDate(this.fecha_programado),
          })
          .then((response) => {
            this.dialogLoading = false;
            this.order = response.data;
            this.snackbar = true;
            this.textAlert = "Pedido Generado";
            this.snackbarOut();
            this.cart = [];
            this.customerSelect = null;
            this.orden_compra = null;
          })
          .catch((error) => {
            this.dialogLoading = false;
            alert(error);
          })
          .finally(() => (this.dialogLoading = false));
      }
    },
    actualizarItemMas(key) {
      this.cart[key].u_confirm++;
      this.actualizarItem(key);
    },
    actualizarItemMenos(key) {
      this.cart[key].u_confirm--;
      this.actualizarItem(key);
    },
    actualizarItem(key) {
      this.dialogLoading = true;
      axios
        .post("getMaterialEsporadico", {
          code: this.cart[key].codigo_material,
          units: this.cart[key].u_confirm,
          vendedor: localStorage.getItem("employee_number"),
          puesto: localStorage.getItem("employee_type"),
          idCliente: this.customerSelect.KUNNR,
          VKORG: "IUS2",
          VTWEG: this.customerSelect.VTWEG,
          VKBUR: this.customerSelect.VKBUR,
        })
        .then((response) => {
          this.dialogLoading = false;
          this.hasError = response.data.mensaje_error;
          if (this.hasError === "") {
            this.cart[key] = response.data.cadena_result;
            this.validacionCredicticia();
          }
        })
        .catch((error) => {
          this.dialogLoading = false;
          this.hasError = error;
        })
        .finally(() => (this.dialogLoading = false));
    },
    getItemTextCustomers(item) {
      return `${item.KUNNR} ${item.NAME1}  ${item.VKBUR}  ${item.VTWEG}`;
    },
    getItemTextDestinations(item) {
      return `${item.KUNNR} ${item.STRAS} ${item.ORT01}  ${item.PSTLZ} `;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    seeImageDetail(item) {
      this.dialogCatalogo = true;
      this.itemSelect = item;
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
