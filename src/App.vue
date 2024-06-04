<template>
  <v-app>
    <v-main>
      <NavBar />
      <RouterView />
    </v-main>
  </v-app>

  <v-snackbar v-model="snackbar" timeout="2000">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { store } from './store'
import { ref, watchEffect } from 'vue'
import { getComputedUser } from './auth';

let ws = null;
watchEffect(() => {
  let user = store.state.user;

  if (user) {
    let token = user.token;

    ws = new WebSocket("ws://localhost:8000/ws?token=" + token);

    ws.onmessage = function (event) {
      let data = JSON.parse(event.data);
      console.log(data)
      let text = "Пользователь " + data.user_name + " купил " + data.purchase.item_name + " ( " + data.purchase.quantity + "шт.)"
      snackbar.value = true;
      snackbarText.value = text;
    };
  } else if (ws) {
    ws.close()
    ws = null;
  }
});

let snackbar = ref(false);
let snackbarText = ref('');

</script>