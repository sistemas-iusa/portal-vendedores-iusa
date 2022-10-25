<template>
  <v-container fluid>
    <v-row>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="volverRutas()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>&nbsp;Fotografia Oportunidad</v-toolbar-title>
      </v-toolbar>
    </v-row>
    <v-row>
      <v-file-input
        v-model="fotografia"
        label="Seleccione imagen"
        accept="image/png, image/jpeg, image/bmp"
        prepend-icon="mdi-camera"
        @change="getSRC"
        capture="camera"
      ></v-file-input>
    </v-row>
    <v-row>
      <v-img
        max-height="350"
        max-width="250"
        :src="url"
        onload="resizeImg(this, 200, 100);"
      ></v-img>
    </v-row>
    <v-row>
      <v-btn dark color="success" block v-if="fotografia" @click="saveCamera()">
        Enviar
      </v-btn>
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
    fotografia: "",
    miFoto: "",
    previews: [],
    url: "",
    dialogLoading: false,
    snackbar: false,
    textAlert: null,
  }),
  async mounted() {},
  methods: {
    getSRC(evt) {
      const file = evt;
      console.log(file);
      this.url = URL.createObjectURL(file);
    },
    volverRutas() {
      router.replace("/routes");
    },
    resizeImg(img, height, width) {
      img.height = height;
      img.width = width;
    },
    saveCamera() {
      let me = this;
      me.dialogLoading = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          var blob1 = downscaleImage(me.url, "525");

          function downscaleImage(
            dataUrl,
            newWidth,
            imageType,
            imageArguments
          ) {
            "use strict";
            var image, oldWidth, oldHeight, newHeight, canvas, newDataUrl;

            // Provide default values
            imageType = imageType || "image/jpeg";
            imageArguments = imageArguments || 0.7;

            // Create a temporary image so that we can compute the height of the downscaled image.
            image = new Image();
            image.src = dataUrl;
            oldWidth = image.width;
            oldHeight = image.height;
            newHeight = Math.floor((oldHeight / oldWidth) * newWidth);

            // Create a temporary canvas to draw the downscaled image on.
            canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            var ctx = canvas.getContext("2d");

            // Draw the downscaled image on the canvas and return the new data URL.
            ctx.drawImage(image, 0, 0, newWidth, newHeight);
            newDataUrl = canvas.toDataURL(imageType, imageArguments);
            return newDataUrl;
          }
          var blob = dataURItoBlob(blob1);
          function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(",")[0].indexOf("base64") >= 0)
              byteString = atob(dataURI.split(",")[1]);
            else byteString = unescape(dataURI.split(",")[1]);

            // separate out the mime component
            var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {
              type: mimeString,
            });
          }
          var hoy = new Date();
          var fecha = hoy.getHours() + hoy.getMinutes() + hoy.getSeconds();

          var file = new File([blob], "imagenOportunidad" + fecha + ".jpeg", {
            type: "'image/jpeg'",
          });

          var fd = new FormData();
          var foto = file;
          var id_promotor = localStorage.getItem("id");
          var id_oportunidad = me.$route.params.id;
          var latitud = pos.coords.latitude;
          var longitud = pos.coords.longitude;
          fd.append("id_promotor", id_promotor);
          fd.append("id_oportunidad", id_oportunidad);
          fd.append("latitud", latitud);
          fd.append("longitud", longitud);
          fd.append("foto", foto);

          axios
            .post("./saveCamera", fd)
            .then(function () {
              me.dialogLoading = false;
              me.snackbar = true;
              me.textAlert = "Imagen almacenada con éxito!";
              me.snackbarOut();
              me.fotografia = null;
              me.url = null;
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
    snackbarOut() {
      setTimeout(function () {
        this.snackbar = false;
        this.textAlert = null;
      }, 5000);
    },
  },
};
</script>
