<template>
    <v-dialog v-if="brands && categories" :model-value="dialog" width="600px">
        <v-card title="Изображения" append-icon="$close">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="emit('close')"></v-btn>
            </template>

            <v-form>
                <v-container v-if="updateGood.images.length" class="pa-5">
                    <v-row>
                        <v-col v-for="image in updateGood.images" :key="n" cols="12" sm="4">
                            <v-img height="170px" class="rounded" cover
                                :src="'http://localhost:8000/images/view/' + image.filename"></v-img>
                            <v-btn variant="outlined" class="mt-3" text="Удалить" @click="deleteImage(image)" outlined
                                block></v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>

            <v-divider class="ml-5 mr-5"></v-divider>

            <v-form class="ma-5" validate-on="submit lazy" @submit.prevent="onDialogSubmit">

                <v-file-input v-model="image" accept="image/*" label="Изображение" multiple chips></v-file-input>
                <v-btn :loading="dialogLoading" variant="outlined" text="Добавить" type="submit" block></v-btn>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const props = defineProps([
    "updateGood",
    "goods",
    "brands",
    "categories"
]);

const emit = defineEmits([
    "close",
    "update"
]);

let dialog = ref(false);
let dialogLoading = ref(false);
let image = ref(null);

function deleteImage(image) {
    axios.delete("images/", {
        params: {
            image_id: image.id
        }
    }
    ).then(response => {
        emit('update', props.updateGood);
    }).catch(error => {

    });
}

function onDialogSubmit() {
    for (let i = 0; i < image.value.length; i++) {
        let file = image.value[i];

        const form = new FormData();
        form.append('uploadFile', file);

        axios.post("images", form,
            {
                params: {
                    item_id: props.updateGood.id
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(response => {
            emit('update', props.updateGood);
            image.value = null;
        }).catch(error => {

        });
    }
}


</script>