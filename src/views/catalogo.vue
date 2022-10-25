<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <h4>Catalogo</h4>
    </v-row>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="page--" v-if="page > 1">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-text-field label="Pagina" v-model.number="page"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="page++" v-if="page < pageCount">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-row>
      <pdf
        src="./catalogo/catalogo-de-construccion.pdf"
        @num-pages="pageCount = $event"
        :page="page"
      ></pdf>
    </v-row>
  </v-container>
</template>

<script>
import pdf from "vue-pdf";
export default {
  components: {
    pdf,
  },
  data: () => ({
    url: "",
    pageCount: 0,
    page: 1,
  }),
};
</script>
