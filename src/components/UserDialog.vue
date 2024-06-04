<template>
  <v-dialog :model-value="dialog" width="600px">
    <v-card :title="updateGood ? 'Изменение' : 'Добавление'" append-icon="$close">
      <template v-slot:append>
        <v-btn icon="$close" variant="text" @click="emit('close', false)"></v-btn>
      </template>
      <v-form class="ma-5" validate-on="submit lazy" @submit.prevent="onDialogSubmit">
        <v-text-field v-model="dialogModel.name" label="Имя пользователя"></v-text-field>
        <v-text-field v-model="dialogModel.password" label="Пароль"></v-text-field>
        <v-combobox v-model="dialogModel.role" label="Роль" :items="roles"></v-combobox>
        <v-btn :loading="dialogLoading" variant="outlined" text="Подтвердить" type="submit" block></v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import axios from 'axios';
import { ref, watch } from 'vue';

const roles = [
  "Администратор",
  "Менеджер",
  "Пользователь"
]

const props = defineProps([
  "updateGood",
])

const emit = defineEmits([
  "close"
]);

let dialog = ref(false);
let dialogLoading = ref(false);

let dialogModel = ref({
  name: '',
  password: '',
  role: ''
})

function getId(items, name) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (item == name) {
      return i;
    }
  }
  return -1;
}

function onDialogSubmit() {
  dialogLoading.value = true;

  let model = dialogModel.value;

  let data = {
    name: model.name,
    password: model.password,
    role: getId(roles, model.role),
  };

  axios.post("users", data
  ).then(response => {
    dialogLoading.value = false;
    emit('close', response)
  }).catch(error => {
    dialogLoading.value = false;
    emit('close', error)
  });

}

</script>