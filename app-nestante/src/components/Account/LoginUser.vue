<template>
    <div class="flex items-center justify-center h-screen bg-gray-900">
        <PrimeCard class="w-full max-w-md p-6 bg-gray-800 text-gray-300 shadow-md">
            <template #header>
                <h2 class="text-xl font-semibold text-center">Sign in</h2>
            </template>
            <template #content>
                <form @submit.prevent="handleLogin" class="mt-4">
                    <!-- username -->
                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-medium" for="email">Email</label>
                        <PrimeInputText id="email" v-model="email" class="w-full" placeholder="Enter your email" />
                    </div>

                    <!-- Password -->
                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-medium" for="password">password</label>
                        <PrimePassword id="password" v-model="password" :feedback="false" class="w-full p-inputtext-sm"
                            placeholder="Enter your senha" />
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center">
                            <PrimeCheckbox inputId="remember" v-model="rememberMe" :value="true" />
                            <label for="remember" class="ml-2 text-sm">Remember me</label>
                        </div>
                        <RouterLink to="/recover-password" class="text-sm text-purple-500 hover:underline">Forgot
                            password?</RouterLink>
                    </div>

                    <!-- Submit Button -->
                    <PrimeButton label="Get started" :loading="loading" class="w-full" type="submit"
                        :icon="loading ? 'pi pi-spin pi-spinner' : ''" :disabled="loading"></PrimeButton>
                </form>

                <div v-if="showSpinner" class="flex justify-center mt-4">
                    <PrimeSpinner style="width: 50px; height: 50px;"></PrimeSpinner>
                </div>

                <!-- Feedback Message -->
                <PrimeToast ref="toast"></PrimeToast>

                <p class="mt-6 text-sm text-center">
                    Don’t have an account?
                    <router-link to="/register" class="font-medium text-purple-500 hover:underline">
                        Sign up
                    </router-link>
                </p>
            </template>
        </PrimeCard>
        <PrimeSpinner v-if="loading"
            class="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
</template>

<script>
import { loginUser } from "../../../Api";

export default {
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false,
            loading: false,
            showSpinner: false,
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;

            try {
                //  API call
                const response = await loginUser({ email: this.email, senha: this.password });
                this.showToast("Login successful!", "success");
                this.showSuccessSpinner();
                // armazena o token no local storage
                localStorage.setItem("token", response.token);
            } catch (error) {
                this.showToast(error.response?.data?.error || "Login failed!", "error");
            } finally {
                this.loading = false;
            }
        },
        showSuccessSpinner() {
            this.showSpinner = true;
            setTimeout(() => {
                this.showSpinner = false; // Hide spinner after 2 seconds
            }, 2000);
        },
        showToast(message, severity) {
            this.$refs.toast.add({ severity, summary: "Login", detail: message, life: 3000 });
        },
    },
};
</script>
<style scoped></style>