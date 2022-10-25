<template>
  <div>
    <v-app-bar
      color="#FF000A"
      dark
      v-if="authenticated && authenticated.type == '1'"
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-img
          style="width: 100%; height: 100%"
          src="img/logo_iusa_w.svg"
        ></v-img>
      </v-toolbar-title>
      <v-toolbar-title style="margin-left: 15px; margin-top: 10px">
        <h6 style="font-size: 22px">Portal Vendedor</h6>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-badge bordered bottom color="green" dot offset-x="10" offset-y="10">
        <router-link :to="{ name: 'perfil' }" style="text-decoration: none">
          <v-avatar
            size="40"
            v-if="user.image_perfil == null"
            style="border: solid 2px #fff"
          >
            <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
          </v-avatar>
          <v-avatar
            size="40"
            v-if="user.image_perfil != null"
            style="border: solid 2px #fff"
          >
            <v-img :src="$hostImage + user.image_perfil"></v-img>
          </v-avatar>
        </router-link>
      </v-badge>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      v-if="authenticated && authenticated.type == '1'"
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
          <router-link
            :to="{ name: 'dashboard' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link
            :to="{ name: 'opportunities' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Oportunidades</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link :to="{ name: 'routes' }" style="text-decoration: none">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-map-marker-distance</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mis Rutas</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link
            :to="{ name: 'prospects' }"
            style="text-decoration: none"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Prospectos</v-list-item-title>
            </v-list-item>
          </router-link>
          <!-- <router-link :to="{ name: 'order' }" style="text-decoration: none">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-clipboard-list</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Pedido Sugerido</v-list-item-title>
            </v-list-item>
          </router-link> -->
          <v-list-group :value="false" prepend-icon="mdi-clipboard-list">
            <template v-slot:activator>
              <v-list-item-title>Pedido Sugerido</v-list-item-title>
            </template>
            <router-link :to="{ name: 'order' }" style="text-decoration: none">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-clipboard-list</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Crear Pedido Sugerido</v-list-item-title>
              </v-list-item>
            </router-link>
            <router-link
              :to="{ name: 'orderHistory' }"
              style="text-decoration: none"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-clipboard-list</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Historial Pedido Sugerido</v-list-item-title>
              </v-list-item>
            </router-link>
          </v-list-group>
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

          <v-list-group :value="false" prepend-icon="mdi-clipboard-list">
            <template v-slot:activator>
              <v-list-item-title>Facturación</v-list-item-title>
            </template>
            <router-link
              :to="{ name: 'pedidoExporadico' }"
              style="text-decoration: none"
            >
              <v-list-item>
                <!--<v-list-item-icon>
                  <v-icon>mdi-clipboard-list</v-icon>
                </v-list-item-icon>-->
                <v-list-item-title>Crear Pedido Esporadico</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link
              :to="{ name: 'pedidoClientes' }"
              style="text-decoration: none"
            >
              <v-list-item>
                <!--<v-list-item-icon>
                  <v-icon>mdi-clipboard-list</v-icon>
                </v-list-item-icon>-->
                <v-list-item-title>Crear Pedido Clientes</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link
              :to="{ name: 'HistorialPedidos' }"
              style="text-decoration: none"
            >
              <v-list-item>
                <!--<v-list-item-icon>
                  <v-icon>mdi-clipboard-list</v-icon>
                </v-list-item-icon>-->
                <v-list-item-title>Historial Pedidos</v-list-item-title>
              </v-list-item>
            </router-link>

            <router-link
              :to="{ name: 'HistorialRecordatorios' }"
              style="text-decoration: none"
            >
              <v-list-item>
                <!--<v-list-item-icon>
                  <v-icon>mdi-clipboard-list</v-icon>
                </v-list-item-icon>-->
                <v-list-item-title>Historial Recordatorios</v-list-item-title>
              </v-list-item>
            </router-link>
          </v-list-group>

          <router-link :to="{ name: 'agenda' }" style="text-decoration: none">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Agenda</v-list-item-title>
            </v-list-item>
          </router-link>
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
<style></style>

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
