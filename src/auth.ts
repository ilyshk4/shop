import { computed } from "vue";
import { store } from './store';
import axios from "axios";

function getComputedUser() {
    return computed(() => {
        return store.state.user;
    })
}

async function login(username: string, password: string) {
    const form_data = new FormData()

    form_data.append("username", username)
    form_data.append("password", password)
    
    let token = null;

    await axios.post('/token', form_data)
    .then(function (response) {
        token = response.data.access_token
    })
    .catch(function (error) {
        console.log(error);
    });

    if (!token)
        return;
    
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }

    await axios.get('/users/me').then(response => {

        let user = {
            username: username,
            token: token,
            data: response.data
        }

        store.commit('setUser', user);
        localStorage.setItem('user', JSON.stringify(user));

        console.log(`Successfully authenticated as ${form_data.get('username')}.`)
    });
}

function restoreToken() {
    let user = store.state.user;
    if (user)
        axios.defaults.headers.common = { 'Authorization': `Bearer ${user.token}` };
}

function isAdmin() {
    let user = store.state.user;
    return user && user.data.role == 0;
}

function isManager() {
    let user = store.state.user;
    return user && user.data.role <= 1;
}

function isUser() {
    let user = store.state.user;
    return user && user.data.role <= 2;
}

function logout() {
    store.commit('setUser', null);
    localStorage.removeItem('user');
}

export {
    isAdmin, isManager, isUser,
    restoreToken,
    getComputedUser,
    login,
    logout
}