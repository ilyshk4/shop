<template>
  <v-dialog :model-value="dialog" width="600px">
    <v-card :title="updateGood ? 'Изменение' : 'Добавление'" append-icon="$close">
      <template v-slot:append>
        <v-btn icon="$close" variant="text" @click="emit('close', false)"></v-btn>
      </template>
      <v-form class="ma-5" validate-on="submit lazy" @submit.prevent="onDialogSubmit">
        <v-text-field v-model="dialogModel.name" label="Название"></v-text-field>
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
])

const emit = defineEmits([
  "close"
]);

let dialog = ref(false);
let dialogLoading = ref(false);

let dialogModel = ref({
  name: '',
})

function onDialogSubmit() {
  dialogLoading.value = true;

  if (props.updateGood) {
    let model = dialogModel.value;

    let data = {
      name: model.name,
    };

    axios.put("categories", data, {
      params: {
        category_id: props.updateGood.id,
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
    };

    axios.post("categories", data
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
    }
  } else {
    dialogModel.value = {
      name: '',
    }
  }
});

</script>