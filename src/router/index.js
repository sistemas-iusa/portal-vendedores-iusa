import Vue from "vue";
import VueRouter from "vue-router";
import SignIn from "../views/auth/SignIn.vue";
import Dashboard from "../views/Dashboard.vue";
import Opportunities from "../views/Opportunities.vue";
import Routes from "../views/Routes.vue";
import Prospects from "../views/Prospects.vue";
import Survey from "../views/Survey.vue";
import Order from "../views/Order.vue";
import orderHistory from "../views/orderHistory.vue";
import store from "@/store";
import Tracking from "../views/Tracking.vue";
import Form from "../views/Form.vue";
import deleteOportunity from "../views/deleteOportunity.vue";
import agenda from "../views/agenda.vue";
import Camera from "../views/camera.vue";
import Catalogo from "../views/catalogo.vue";
import Perfil from "../views/Perfil.vue";
import DashboardCoordinador from "../views/coordinador/DashboardCoordinador.vue";
import OpportunitiesCoordinador from "../views/coordinador/Opportunities.vue";
import CreateRoute from "../views/coordinador/CreateRoute.vue";
import PromotoresCoordinador from "../views/coordinador/Promotores.vue";
import ActualizarInegi from "../views/coordinador/ActualizarInegi.vue";
import DashboardAdmin from "../views/administrador/DashboardAdmin.vue";
import PromotoresAdmin from "../views/administrador/Promotores.vue";
import agendaAdmin from "../views/administrador/agenda.vue";
import Reporte from "../views/coordinador/Reporte.vue";
import SeguimientoRuta from "../views/coordinador/SeguimientoRuta.vue";
import DashboardSupervisor from "../views/supervisor/DashboardSupervisor.vue";
import SeguimientoPromotor from "../views/supervisor/SeguimientoPromotor.vue";
import ReportePedidos from "../views/supervisor/ReportePedidos.vue";
import evaluacionSemanal from "../views/omar/EvaluacionSemanal.vue";

import EstadosOportunidad from "../views/administrador/EstadosOportunidad.vue";
import EstadosOportunidadTabla from "../views/administrador/OpportunitiesEstados.vue";

import PedidoExpordico from "../views/PedidoExporadico.vue";
import PedidoClientes from "../views/PedidoClientes.vue";
import HistorialPedidos from "../views/HistorialPedidos.vue";
import HistorialRecordatorios from "../views/HistorialRecordatorios.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/estadosOportunidades",
    name: "estadosOportunidades",
    component: EstadosOportunidad,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/estadosOportunidadesTabla",
    name: "estadosOportunidadesTabla",
    component: EstadosOportunidadTabla,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/",
    name: "signin",
    component: SignIn,
    beforeEnter: (to, from, next) => {
      if (store.getters["auth/authenticated"]) {
        return next({
          name: "dashboard",
        });
      }
      next();
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/opportunities",
    name: "opportunities",
    component: Opportunities,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/routes",
    name: "routes",
    component: Routes,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/prospects",
    name: "prospects",
    component: Prospects,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/suggested-order",
    name: "order",
    component: Order,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/order-history",
    name: "orderHistory",
    component: orderHistory,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/pedido-exporadico",
    name: "pedidoExporadico",
    component: PedidoExpordico,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/pedido-clientes",
    name: "pedidoClientes",
    component: PedidoClientes,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/historial-pedidos",
    name: "HistorialPedidos",
    component: HistorialPedidos,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/historial-recordatorios",
    name: "HistorialRecordatorios",
    component: HistorialRecordatorios,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/:id/survey",
    name: "Survey",
    component: Survey,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/tracking/:id",
    name: "tracking",
    component: Tracking,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/Form/:id",
    name: "Form",
    component: Form,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/deleteOportunity/:id",
    name: "deleteOportunity",
    component: deleteOportunity,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/agenda",
    name: "agenda",
    component: agenda,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/Camera/:id",
    name: "Camera",
    component: Camera,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/catalogo",
    name: "catalogo",
    component: Catalogo,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/perfil",
    name: "perfil",
    component: Perfil,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/dashboardCoordinador",
    name: "dashboardCoordinador",
    component: DashboardCoordinador,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/opportunitiesAdmin",
    name: "opportunitiesAdmin",
    component: OpportunitiesCoordinador,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/createRoute",
    name: "createRoute",
    component: CreateRoute,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/promotoresCoordinador",
    name: "promotoresCoordinador",
    component: PromotoresCoordinador,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/dashboardAdmin",
    name: "dashboardAdmin",
    component: DashboardAdmin,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/promotoresAdmin",
    name: "promotoresAdmin",
    component: PromotoresAdmin,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/actualizarInegi",
    name: "actualizarInegi",
    component: ActualizarInegi,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/agendaAdmin",
    name: "agendaAdmin",
    component: agendaAdmin,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/reporte",
    name: "reporte",
    component: Reporte,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/seguimientoRuta",
    name: "seguimientoRuta",
    component: SeguimientoRuta,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/dashboardSupervisor",
    name: "dashboardSupervisor",
    component: DashboardSupervisor,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/seguimientoPromotor",
    name: "seguimientoPromotor",
    component: SeguimientoPromotor,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/reportePedidos",
    name: "reportePedidos",
    component: ReportePedidos,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
  {
    path: "/evaluacionSemanal",
    name: "evaluacionSemanal",
    component: evaluacionSemanal,
    beforeEnter: (to, from, next) => {
      if (!store.getters["auth/authenticated"]) {
        return next({
          name: "signin",
        });
      }
      next();
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
