<template>

  <v-container v-if="categories">
    <v-btn class="mb-4" v-if="isManager()" @click="showCreateDialog()">Добавить</v-btn>
    <v-list lines="two">
      <v-list-item
        v-for="cat in categories"
        :key="cat.id"
        :title="cat.name"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-watermark</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn v-if="isManager()" @click="showUpdateDialog(cat)">Изменить</v-btn>
          <v-btn v-if="isManager()" class="ms-5" @click="showDeleteDialog(cat)">Удалить</v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-container>

  <CategoryDeleteDialog v-model="deleteDialog" url="categories" :updateGood="updateBrand" @close="onDeleteDialogClosed" />
  <CategoryDialog v-model="brandDialog" :updateGood="updateBrand" @close="onBrandDialogClosed" />

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

let categories = ref([]);

function onBrandDialogClosed(result) {
  brandDialog.value = false;

  if (result.data) {
    snackbar.value = true;
    snackbarText.value = "Категория обновлена!";
    fetchCategories();
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
    snackbarText.value = "Категория удалена!";
    fetchCategories();
  }
}

function fetchCategories() {
  axios.get('/categories', {

  })
  .then(function (response) {
    categories.value = response.data;
  });
}

fetchCategories();

</script>
