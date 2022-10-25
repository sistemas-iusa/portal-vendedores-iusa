<template>
  <v-row align="center">
    <v-col cols="12">
      <v-autocomplete
        v-model="sellers"
        :items="data"
        item-text="NAME1"
        return-object
        dense
        filled
        rounded
        label="SELECCIONAR VENDEDOR"
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
    sellers: [],
    data: [],
  }),
  async mounted() {
    let self = this;
    self.getSellers();
  },
  methods: {
    setData() {
      this.$emit("getSeller", this.sellers);
    },
    async getSellers() {
      await axios
        .get("getSellers")
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
