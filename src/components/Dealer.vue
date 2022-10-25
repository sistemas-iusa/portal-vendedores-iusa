<template>
  <v-row align="center">
    <v-col cols="12">
      <v-autocomplete
        v-model="dealers"
        :items="data"
        item-text="DEALER"
        return-object
        dense
        filled
        rounded
        label="SELECCIONAR DISTRIBUIDOR"
        class="mt-xs-4 mt-md-4 mt-lg-4"
        @change="setData"
      >
      </v-autocomplete>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    dealers: [],
    data: [],
  }),
  async mounted() {
    let self = this;
    self.getDealers();
  },
  methods: {
    setData() {
      this.$emit("getData", this.dealers);
    },
    async getDealers() {
      await axios
        .get("getDealers")
        .then((response) => {
          this.data = response.data;
          this.data.pop();
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
