<template>
  <v-dialog :model-value="dialog" width="600px">
    <v-card :title="'Удаление'">
      <v-form class="ma-3" validate-on="submit lazy" @submit.prevent="onDialogSubmit">
        <v-card-actions>
          <v-btn :loading="dialogLoading" variant="outlined" text="Удалить" type="submit"></v-btn>
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
  "url",
  "updateGood"
])

const emit = defineEmits([
  "close"
]);

let dialog = ref(false);
let dialogLoading = ref(false);

async function onDialogSubmit() {
  dialogLoading.value = true;

  axios.delete(props.url, {
    params: { brand_id: props.updateGood.id }
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