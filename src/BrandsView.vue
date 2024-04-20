<template>

  <v-container v-if="brands">
    <v-btn class="mb-4" v-if="isManager()" @click="showCreateDialog()">Добавить</v-btn>
    <v-list lines="two">
      <v-list-item
        v-for="brand in brands"
        :key="brand.id"
        :title="brand.name"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-watermark</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn v-if="isManager()" @click="showUpdateDialog(brand)">Изменить</v-btn>
          <v-btn v-if="isManager()" class="ms-5" @click="showDeleteDialog(brand)">Удалить</v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-container>

  <BrandDeleteDialog v-model="deleteDialog" url="brands" :updateGood="updateBrand" @close="onDeleteDialogClosed" />
  <BrandDialog v-model="brandDialog" :updateGood="updateBrand" @close="onBrandDialogClosed" />

  <v-snackbar v-model="snackbar" timeout="2000">
    {{ snackbarText }}
  </v-snackbar>

</template>

<script setup>

import axios from 'axios';
import { ref } from 'vue';
import { isAdmin, isManager, isUser } from './auth'
import BrandDialog from './components/BrandDialog.vue';

let snackbar = ref(false);
let snackbarText = ref('');

let brandDialog = ref(false);
let deleteDialog = ref(false);

let updateBrand = ref(null);

let brands = ref([]);

function onBrandDialogClosed(result) {
  brandDialog.value = false;

  if (result.data) {
    snackbar.value = true;
    snackbarText.value = "Бренд обновлён!";
    fetchBrands();
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
    snackbarText.value = "Бренд удален!";
    fetchBrands();
  }
}

function fetchBrands() {
  axios.get('/brands', {

  })
  .then(function (response) {
    brands.value = response.data;
  });
}

fetchBrands();

</script>
