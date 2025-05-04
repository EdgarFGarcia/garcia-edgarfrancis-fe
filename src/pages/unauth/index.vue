<script setup lang="ts">
definePage({
  meta: {
    layout: 'unauth',
  },
});
import { onMounted, computed, ref } from 'vue';
// import { loginService } from "@/service/login.service"
// import { useUserStore } from '@/stores/user';
import { useRouter } from "vue-router";

// const userStore = useUserStore()
const users = computed(() => userStore.getUser);
const token = computed(() => userStore.getToken);

onMounted(async () => {
    // await loginService.getUser()
    document.title = "Login"
    if(token.value){
        router.push("/dashboard")
    }
})

// Form fields
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const showPassword = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')

// Function to handle login
const router = useRouter();
const handleLogin = async () => {
    errorMessage.value = "";
    try {
        const tp = {
            email: email.value,
            password: password.value
        }
        const login = await loginService.login({item: tp});
        if(login){
            router.push("/dashboard")
        }
        if(login == undefined){
            snackbarMessage.value = 'Login failed: No response from server.'
            snackbar.value = true
        }
    } catch (error) {
        errorMessage.value = "Login failed. Please check your credentials.";
    }
};

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

</script>

<template>
    <v-container class="fill-height">
        <v-responsive class="align-center fill-height mx-auto" max-width="400">
            <h3 class="mb-2 login-message">Login (use *admin@mail.com | password)</h3>

            <v-form @submit.prevent="handleLogin">
                <v-text-field 
                    variant="outlined" 
                    v-model="email" 
                    label="Email" 
                    type="email" 
                    required 
                    hint="Enter your email address" 
                    prepend-inner-icon="mdi-account"
                    density="comfortable"
                    class="mb-2 custom-text-field"
                ></v-text-field>
                <v-text-field 
                    variant="outlined" 
                    v-model="password" 
                    label="Password" 
                    :type="showPassword ? 'text' : 'password'" 
                    required 
                    hint="Enter your password to access this website"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-closed'"
                    @click:append-inner="togglePassword"
                    density="comfortable"
                    class="mb-2 custom-text-field"
                ></v-text-field>
                
                <v-btn type="submit" color="primary" block class="text-none">Login</v-btn>
            </v-form>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </v-responsive>
    </v-container>
    <v-snackbar v-model="snackbar" vertical>
      {{ snackbarMessage }}
      <template #actions>
        <v-btn color="red" variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
</template>

<!-- <template>
    <v-container class="fill-height">
        <v-responsive class="align-center fill-height mx-auto" max-width="900">
            <div v-if="users">
                <h3>Fetched Users:</h3>
                <ul>
                    <li v-for="(user, index) in users" :key="index">
                        {{ user.name }} - {{ user.email }}
                    </li>
                </ul>
            </div>
            <div v-else>
                <p>No users found.</p>
            </div>
        </v-responsive>
    </v-container>
</template> -->