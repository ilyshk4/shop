<template>

  <v-container v-if="goods && brands && categories">
    <v-btn class="mb-4" v-if="isManager()" @click="showCreateDialog()">Добавить</v-btn>
    <v-row>
      <v-col v-for="good in goods" :key="good.id" cols="12" sm="4">
        <v-card :title="good.name" :subtitle="good.quantity + ' шт.'"
          :text="getName(brands, good.brand_id) + ' | ' + getName(categories, good.category_id)">
          <v-carousel v-if="good.images" width="auto" height="400px" class="rounded">
            <v-carousel-item v-for="image in good.images" class="pa-5"
              :src="'http://localhost:8000/images/view/' + image.filename" cover></v-carousel-item>
          </v-carousel>
          <v-card-actions class="d-block">
            <v-btn v-if="isUser()" @click="showPurchaseDialog(good)" :disabled="good.quantity == 0" block>
              {{ good.quantity ? "Купить" : "(Нет в наличии)"  }}
            </v-btn>
            <v-btn v-if="isManager()" @click="showUpdateDialog(good)">Изменить</v-btn>
            <v-btn v-if="isManager()" @click="showImagesDialog(good)">Изображения</v-btn>
            <v-btn v-if="isManager()" @click="showDeleteDialog(good)" :disabled="good.purchases?.length">Удалить</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination class="mt-5" v-model="page" :length="pageCount"></v-pagination>
  </v-container>

  <GoodDialog v-model="goodDialog" :updateGood="updateGood" @close="onGoodDialogClosed" :goods="goods" :brands="brands"
    :categories="categories" />
  <GoodDeleteDialog v-model="deleteDialog" url="items" :updateGood="updateGood" @close="onDeleteDialogClosed" />
  <PurchaseDialog v-model="purchaseDialog" :updateGood="updateGood" @close="onPurchaseDialogClosed" />

  <ImagesDialog v-model="imagesDialog" :updateGood="updateGood" @update="onImageDialogUpdate"
    @close="imagesDialog = false" :goods="goods" :brands="brands" :categories="categories" />

  <v-snackbar v-model="snackbar" timeout="2000">
    {{ snackbarText }}
  </v-snackbar>

</template>

<script setup>

import axios from 'axios';
import { ref, computed, watch } from 'vue';
import { isAdmin, isManager, isUser } from './auth'

let snackbar = ref(false);
let snackbarText = ref('');

let goodDialog = ref(false);
let deleteDialog = ref(false);
let purchaseDialog = ref(false);
let imagesDialog = ref(false);

let updateGood = ref(null);

let page = ref(1);
let goodsCount = ref(0);

let goods = ref([]);
let brands = ref([]);
let categories = ref([]);

let pageCount = computed(() => Math.ceil(goodsCount.value / 3));

watch(page, value => {
  fetchGoods();
});

function onGoodDialogClosed(result) {
  goodDialog.value = false;

  if (result.data) {
    snackbar.value = true;
    snackbarText.value = "Товар обновлён!";
    fetchGoods();
  }
}

function showCreateDialog(good) {
  updateGood.value = null;
  goodDialog.value = true;
}

function showUpdateDialog(good) {
  updateGood.value = good;
  goodDialog.value = true;
}

function showImagesDialog(good) {
  updateGood.value = good;
  imagesDialog.value = true;
}

function showPurchaseDialog(good) {
  updateGood.value = good;
  purchaseDialog.value = true;
}

function showDeleteDialog(good) {
  updateGood.value = good;
  deleteDialog.value = true;
}

function onDeleteDialogClosed(result) {
  deleteDialog.value = false;

  if (result.data) {
    snackbar.value = true;
    snackbarText.value = "Товар удален!";
    fetchGoods();
  }
}

function onPurchaseDialogClosed(result) {
  purchaseDialog.value = false;

  if (result.data) {
    snackbar.value = true;
    snackbarText.value = "Товар куплен!";
    fetchGoods();
  }
}

function onImageDialogUpdate(good) {
  good.images = null;
  axios.get('/images/', {
    params: {
      item_id: good.id
    }
  })
    .then(function (response) {
      good.images = response.data;
    });
}

function getId(items, name) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (item.name == name) {
      return item.id;
    }
  }
  return -1;
}

function getName(items, id) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (item.id == id) {
      return item.name;
    }
  }
  return "";
}

function fetchBrands() {
  axios.get('/brands', {

  })
    .then(function (response) {
      brands.value = response.data;
    });
}

function fetchCategories() {
  axios.get('/categories', {

  })
    .then(function (response) {
      categories.value = response.data;
    });
}

async function fetchGoods() {
  await axios.get('/itemscount').then(response => {
    goodsCount.value = Number(response.data)
  });

  await axios.get('/items', {
    params: {
      skip: (page.value - 1) * 3,
      limit: 3
    }
  })
    .then(function (response) {
      goods.value = response.data;
      for (let i = 0; i < goods.value.length; i++) {
        let good = goods.value[i];
        axios.get('/images/',
          {
            params: {
              item_id: good.id
            }
          })
          .then(function (response) {
            good.images = response.data;
          });

        axios.get('/purchases/item',
          {
            params: {
              item_id: good.id
            }
          })
          .then(function (response) {
            good.purchases = response.data;
          });

        goods.value[i] = good;
      }
    });
}

fetchBrands();
fetchCategories();
fetchGoods();

</script>
