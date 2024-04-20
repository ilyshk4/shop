<template>
  <v-dialog v-if="brands && categories" :model-value="dialog" width="600px">
    <v-card :title="updateGood ? 'Изменение' : 'Добавление'" append-icon="$close">
      <template v-slot:append>
        <v-btn icon="$close" variant="text" @click="emit('close', false)"></v-btn>
      </template>
      <v-form class="ma-5" validate-on="submit lazy" @submit.prevent="onDialogSubmit">
        <v-text-field v-model="dialogModel.name" label="Название"></v-text-field>
        <v-combobox v-model="dialogModel.brand" label="Бренд" :items="brands.map((x) => x.name)"></v-combobox>
        <v-combobox v-model="dialogModel.category" label="Категория"
          :items="categories.map((x) => x.name)"></v-combobox>
        <v-text-field v-model="dialogModel.quantity" label="Количество" single-line type="number" />

        <v-btn :loading="dialogLoading" variant="outlined" text="Подтвердить" type="submit" block></v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';

const props = defineProps([
  "updateGood",
  "goods",
  "brands",
  "categories"
])

const emit = defineEmits([
  "close"
]);

let dialog = ref(false);
let dialogLoading = ref(false);

let dialogModel = ref({
  name: '',
  brand: '',
  category: '',
  quantity: 1
})

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

function onDialogSubmit() {
  dialogLoading.value = true;

  if (props.updateGood) {
    let model = dialogModel.value;

    let data = {
      name: model.name,
      brand_id: getId(props.brands, model.brand),
      category_id: getId(props.categories, model.category),
      quantity: Number(model.quantity)
    };

    console.log(data);

    axios.put("items", data, {
      params: {
        item_id: props.updateGood.id,
      }
    }
    ).then(response => {
      dialogLoading.value = false;
      emit('close', response)
    }).catch(error => {
      dialogLoading.value = false;
      emit('close', error)
    });
  } else {
    let model = dialogModel.value;

    let data = {
      name: model.name,
      brand_id: getId(props.brands, model.brand),
      category_id: getId(props.categories, model.category),
      quantity: Number(model.quantity)
    };

    axios.post("items", data
    ).then(response => {
      dialogLoading.value = false;
      emit('close', response)
    }).catch(error => {
      dialogLoading.value = false;
      emit('close', error)
    });
  }
}

watch(() => props.updateGood, value => {
  if (value) {
    dialogModel.value = {
      name: value.name,
      brand: getName(props.brands, value.brand_id),
      category: getName(props.categories, value.category_id),
      quantity: Number(value.quantity)
    }
  } else {
    dialogModel.value = {
      name: '',
      brand: '',
      category: '',
      quantity: 1
    }
  }
});

</script>