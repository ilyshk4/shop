<template>

  <v-container v-if="users">
    <v-btn class="mb-4" v-if="isManager()" @click="showCreateDialog()">Добавить</v-btn>
    <v-list lines="two">
      <v-list-item
        v-for="user in users"
        :key="user.id"
        :title="user.name"
        :subtitle="getRoleName(user.role)"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-watermark</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn v-if="isManager()" @click="showUpdateDialog(user)">Изменить</v-btn>
          <v-btn v-if="isManager()" class="ms-5" @click="showDeleteDialog(user)">Удалить</v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-container>

  <UserDeleteDialog v-model="deleteDialog" url="users" :updateGood="updateBrand" @close="onDeleteDialogClosed" />
  <UserDialog v-model="brandDialog" :updateGood="updateBrand" @close="onBrandDialogClosed" />

  <v-snackbar v-model="snackbar" timeout="2000">
    {{ snackbarText }}
  </v-snackbar>

</template>

<script setup>

import axios from 'axios';
import { ref } from 'vue';
import { isAdmin, isManager, isUser } from './auth'

let snackbar = ref(false);
let snackbarText = ref('');

let brandDialog = ref(false);
let deleteDialog = ref(false);

let updateBrand = ref(null);

let users = ref([]);

function getRoleName(id)
{
  if (id == 0)
    return "Администратор";
  if (id == 1)
    return "Менеджер";
  if (id == 2)
    return "Пользователь";
  return "Неизвестная роль";
}

function onBrandDialogClosed(result) {
  brandDialog.value = false;

  if (result.data) {
    snackbar.value = true;
    snackbarText.value = "Пользователь обновлён!";
    fetchUsers();
  }
}

function showCreateDialog() {
  updateBrand.value = null;
  brandDialog.value = true;
}

function showUpdateDialog(good) {
  updateBrand.value = good;
  brandDialog.value = true;
}

function showDeleteDialog(good) {
  updateBrand.value = good;
  deleteDialog.value = true;
}

function onDeleteDialogClosed(result) {
  deleteDialog.value = false;

  if (result.data) {
    snackbar.value = true;
    snackbarText.value = "Пользователь удален!";
    fetchUsers();
  }
}

function fetchUsers() {
  axios.get('/users', {

  })
  .then(function (response) {
    users.value = response.data;
  });
}

fetchUsers();

</script>
