import { createStore } from "vuex"

function getCurrentUser() {
    var item = localStorage.getItem('user');
    if (item)
        return JSON.parse(item);
    else
        return null;
}

const store = createStore({
    state () {
      return {
        user: getCurrentUser()
      }
    },
    mutations: {
      setUser (state, user) {
        state.user = user
      }
    }
  });

export {
    store
}