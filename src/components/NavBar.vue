<template>
    <v-app-bar :elevation="0">
        <template v-slot:prepend>

            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props">
                        Меню
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item>
                        <v-btn @click="this.$router.push('/')">
                            Товары
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn @click="this.$router.push('/categories')">
                            Категории
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn @click="this.$router.push('/brands')">
                            Бренды
                        </v-btn>
                    </v-list-item>
                    <v-list-item>
                        <v-btn @click="this.$router.push('/users')">
                            Пользователи
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>


        <v-app-bar-title class="text-h5 font-weight-light">
            <route-link to="/" tag style="cursor:pointer">Интернет-магазин</route-link>
        </v-app-bar-title>

        <template v-if="user" v-slot:append>
            <h3 class="pe-5">{{ user.username }}</h3>
            <v-btn type="button" class="btn" @click="logout">
                Выйти
            </v-btn>
        </template>
        <template v-else v-slot:append>
            <v-btn type="button" class="btn" @click="loginDialog = true">
                Войти
            </v-btn>
        </template>
    </v-app-bar>

    <v-dialog v-model="loginDialog" width="600px">
        <v-card title="Авторизация" append-icon="$close">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="loginDialog = false"></v-btn>
            </template>
            <v-form class="ma-5" validate-on="submit lazy" @submit.prevent="onLoginFormSubmit">
                <v-text-field v-model="loginUsername" label="Имя пользователя"></v-text-field>
                <v-text-field v-model="loginPassword" label="Пароль" type="password"></v-text-field>
                <v-btn :loading="loginLoading" class="mt-2" text="Войти" type="submit" block></v-btn>
            </v-form>
        </v-card>
    </v-dialog>

    <v-snackbar v-model="loginSnackbar" timeout="2000">
        {{ loginSnackbarText }}
    </v-snackbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getComputedUser, login, logout } from '../auth'

const user = getComputedUser()

let loginDialog = ref(false);
let loginUsername = ref('');
let loginPassword = ref('');
let loginLoading = ref(false)
let loginSnackbar = ref(false)
let loginSnackbarText = ref('')

async function onLoginFormSubmit() {
    loginLoading.value = true;
    await login(loginUsername.value, loginPassword.value)
    loginLoading.value = false;
    loginSnackbar.value = true;
    loginPassword.value = '';

    if (user.value) {
        loginSnackbarText.value = 'Успешная авторизация.'
        loginDialog.value = false;
    } else {
        loginSnackbarText.value = 'Неверный логин или пароль.'
    }
}


</script>