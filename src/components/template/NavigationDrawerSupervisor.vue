<template>
  <div>
    <v-app-bar
      color="#FF000A"
      dark
      v-if="authenticated && authenticated.type == '4'"
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-img
          style="width: 100%; height: 100%"
          src="img/logo_iusa_w.svg"
        ></v-img>
      </v-toolbar-title>
      <v-toolbar-title style="margin-left: 15px; margin-top: 10px">
      <h6 style="font-size: 22px">Supervisor</h6></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
        <router-link :to="{ name: 'perfil' }" style="text-decoration: none">
          <v-avatar size="40" v-if="user.image_perfil == null">
            <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
          </v-avatar>
          <v-avatar size="40" v-if="user.image_perfil != null">
            <v-img :src="$hostImage + user.image_perfil"></v-img>
          </v-avatar>
        </router-link>
      </v-badge>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      v-if="authenticated && authenticated.type == '4'"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            v-if="user.image_perfil == null"
            src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
          ></v-img>
          <v-img
            v-if="user.image_perfil != null"
            :src="$hostImage + user.image_perfil"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content style="padding-top: 28px">
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <p>{{ user.email }}</p>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <router-link :to="{ name: 'reporte' }" style="text-decoration: none">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            :to="{ name: 'dashboardSupervisor' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-map</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mapa</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            :to="{ name: 'estadosOportunidadesTabla' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Oportunidades Estado</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            :to="{ name: 'opportunitiesAdmin' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Oportunidades Municipio</v-list-item-title>
            </v-list-item>
          </router-link>

          <!--<router-link :to="{ name: 'reporte' }" style="text-decoration: none">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-chart-bar</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Reporte Indicadores</v-list-item-title>
            </v-list-item>
          </router-link>-->

          <router-link
            :to="{ name: 'seguimientoRuta' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-chart-pie</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Reporte oportunidades</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            :to="{ name: 'reportePedidos' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-cart</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Rep. Pedido Sugerido</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            :to="{ name: 'seguimientoPromotor' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-car</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Seguimiento Promotor</v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link
            :to="{ name: 'agendaAdmin' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Agenda</v-list-item-title>
            </v-list-item>
          </router-link>

          <a
            href="catalogo/catalogo-de-construccion.pdf"
            target="_blank"
            style="font-size: 14px; text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-file-find</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Cátalogo</v-list-item-title>
            </v-list-item>
          </a>

          <router-link :to="{ name: 'perfil' }" style="text-decoration: none">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Perfil</v-list-item-title>
            </v-list-item>
          </router-link>

          <v-divider></v-divider>
          <v-list-item @click.prevent="signOut">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    drawer: false,
    group: null,
  }),
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      signOutAction: "auth/signOut",
    }),
    signOut() {
      this.signOutAction().then(() => {
        this.$router.replace({
          name: "signin",
        });
      });
    },
  },
};
</script>
