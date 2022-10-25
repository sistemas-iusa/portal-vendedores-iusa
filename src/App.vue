<template>
  <div id="app">
    <v-app>
      <v-main>
        <NavigationDrawer />
        <NavigationDrawerCoordinador />
        <NavigationDrawerAdmin />
        <NavigationDrawerSupervisor />
        <router-view />
      </v-main>
    </v-app>
  </div>
</template>
<script>
import NavigationDrawer from "@/components/template/NavigationDrawer.vue";
import NavigationDrawerAdmin from "@/components/template/NavigationDrawerAdmin.vue";
import NavigationDrawerCoordinador from "@/components/template/NavigationDrawerCoordinador.vue";
import NavigationDrawerSupervisor from "@/components/template/NavigationDrawerSupervisor.vue";

export default {
  components: {
    NavigationDrawer,
    NavigationDrawerAdmin,
    NavigationDrawerCoordinador,
    NavigationDrawerSupervisor,
  },
};
</script>
