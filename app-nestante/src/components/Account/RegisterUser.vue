<template>
    <div class="flex items-center justify-center h-screen bg-gray-900">
        <PrimeCard class="w-full max-w-lg p-6 bg-gray-800 text-gray-300 shadow-md">
            <template #header>
                <h2 class="text-xl font-semibold text-center text-white">Register</h2>
            </template>
            <template #content>
                <form @submit.prevent="handleRegister" class="mt-4 space-y-4">
                    <!-- Full Name -->
                    <div>
                        <label class="block mb-2 text-sm font-medium" for="fullname">Full Name</label>
                        <PrimeInputText id="fullname" v-model="fullName" class="w-full"
                            placeholder="Enter your full name" />
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block mb-2 text-sm font-medium" for="email">Email</label>
                        <PrimeInputText id="email" v-model="email" type="email" class="w-full"
                            placeholder="Enter your email" />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block mb-2 text-sm font-medium" for="password">Password</label>
                        <PrimePassword id="password" v-model="password" :feedback="false" class="w-full"
                            placeholder="Enter your password" />
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label class="block mb-2 text-sm font-medium" for="confirm-password">Confirm Password</label>
                        <PrimePassword id="confirm-password" v-model="confirmPassword" :feedback="false" class="w-full"
                            placeholder="Confirm your password" />
                    </div>

                    <!-- Submit Button -->
                    <PrimeButton label="Register" :loading="loading" class="w-full" type="submit"
                        :icon="loading ? 'pi pi-spin pi-spinner' : ''" :disabled="loading"></PrimeButton>
                </form>

                <!-- Link to Login -->
                <p class="mt-6 text-sm text-center">
                    Already have an account?
                    <router-link to="/login" class="font-medium text-purple-500 hover:underline">
                        Sign in
                    </router-link>
                </p>

                <!-- Feedback Messages -->
                <PrimeToast ref="toast"></PrimeToast>
            </template>
        </PrimeCard>
    </div>
</template>

<script>
import { registerUser } from "../../../Api"
export default {
    data() {
        return {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            loading: false,
        };
    },
    methods: {
        async handleRegister() {
            // Reset loading state
            this.loading = true;

            try {
                // basic validation
                if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
                    this.showToast("Todos os campos são obrigatórios", "warn");
                    return;
                }

                if (this.password !== this.confirmPassword) {
                    this.showToast("Senhas não confere", "error");
                    return;
                }

                //API call
                await registerUser({
                    nome: this.fullName,
                    email: this.email,
                    senha: this.password,
                });

                // successful registration
                this.showToast("Usuario registrado com sucesso!", "success");
                this.$router.push("/login");
            } catch (error) {
                this.showToast(error.response?.data?.error || error.message || "Falha ao registrar usuario", "error");
            } finally {
                this.loading = false;
            }
        },
        showToast(message, severity) {
            this.$refs.toast.add({ severity, summary: "Registration", detail: message, life: 3000 });
        },
    },
};
</script>

<style scoped>
/* Personalize conforme necessário */
</style>