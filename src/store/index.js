import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.store({
    state: {
        user: undefined
    },
    mutations: {
        login (state, payload) {
            state.user = payload
        },
        logout (state) {
            state.user = undefined
        }
    },
    actions: {
        login (context, payload) {
            context.commit('login', payload)
        },
        logout (context) {
            context.commit('logout')
        }
    }
});

export default store