<template>
  <v-dialog :model-value="dialog" width="600px">
    <v-card :title="'Покупка товара'">
      <v-form class="ma-3" validate-on="submit lazy" @submit.prevent="onDialogSubmit">
        <v-text-field v-model="quantity" label="Количество" single-line type="number" />
        <v-card-actions>
          <v-btn :loading="dialogLoading" variant="outlined" text="Купить" type="submit"></v-btn>
          <v-btn variant="outlined" text="Отменить" @click="emit('close', null)"></v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const props = defineProps([
  "updateGood"
])

const emit = defineEmits([
  "close"
]);

let dialog = ref(false);
let dialogLoading = ref(false);

let quantity = ref(0);

async function onDialogSubmit() {
  dialogLoading.value = true;

  axios.post("purchases", {
    item_id: props.updateGood.id,
    quantity: quantity.value
  }
  ).then(response => {
    dialogLoading.value = false;
    emit('close', response)
  }).catch(error => {
    dialogLoading.value = false;
    emit('close', error)
  });
}

</script>