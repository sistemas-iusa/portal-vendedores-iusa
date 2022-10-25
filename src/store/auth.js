import axios from "axios";

export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
    role: null,
  },

  getters: {
    authenticated(state) {
      return state.token && state.user;
    },
    user(state) {
      return state.user;
    },
    role(state) {
      return state.role;
    },
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, data) {
      state.user = data;
    },
    SET_ROLE(state, role) {
      state.role = role;
    },
  },
  actions: {
    async signIn({ dispatch }, credentials) {
      //localStorage.setItem("email", credentials.email);
      let response = await axios.post("auth/login", credentials, {});
      return dispatch("attempt", response.data.access_token);
    },
    async attempt({ commit, state }, token) {
      //let email = localStorage.getItem("email");
      if (token) {
        commit("SET_TOKEN", token);
        //console.log(token);
      }
      if (!state.token) {
        return;
      }
      try {
        let response = await axios.post("auth/getInfo", {
          /*headers: {
            Authorization: 'Bearer '+ token,
          }*/
        });
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("id", response.data.id);
          localStorage.setItem("type", response.data.type);
          localStorage.setItem("estatus", response.data.estatus);
          localStorage.setItem(
            "employee_number",
            response.data.employee_number
          );
          localStorage.setItem("employee_type", response.data.employee_type);
        }
        commit("SET_USER", response.data);
        commit("SET_ROLE", response.data.role);
      } catch (e) {
        commit("SET_TOKEN", null);
        localStorage.removeItem("token");
      }
    },
    signOut({ commit }) {
      localStorage.removeItem("token");
      //localStorage.removeItem("email");
      localStorage.removeItem("id");
      localStorage.removeItem("type");
      localStorage.removeItem("estatus");
      commit("SET_TOKEN", null);
      commit("SET_USER", null);
    },
    changeUser(context, data) {
      context.commit("SET_USER", data);
    },
  },
};
