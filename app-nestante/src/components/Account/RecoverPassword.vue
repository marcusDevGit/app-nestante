<template>
    <div class="flex items-center justify-center h-screen bg-gray-900">
        <PrimeCard class="w-full max-w-lg p-6 bg-gray-800 text-gray-300 shadow-md">
            <template #header>
                <h2 class="text-xl font-semibold text-center text-white">Recover Password</h2>
            </template>
            <template #content>
                <form @submit.prevent="handlePasswordRecovery" class="mt-4 space-y-4">
                    <!-- Email -->
                    <div>
                        <label class="block mb-2 text-sm font-medium" for="email">Email</label>
                        <PrimeInputText id="email" v-model="email" type="email" class="w-full"
                            placeholder="Enter your registered email" />
                    </div>

                    <!-- Submit Button -->
                    <PrimeButton label="Recover Password" :loading="loading" class="w-full" type="submit"
                        :icon="loading ? 'pi pi-spin pi-spinner' : ''" :disabled="loading"></PrimeButton>
                </form>

                <!-- Link to Login -->
                <p class="mt-6 text-sm text-center">
                    Remember your password?
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
import { requestPasswordReset } from "../../../Api";
export default {
    data() {
        return {
            email: "",
            loading: false,
        };
    },
    methods: {
        async handlePasswordRecovery() {
            this.loading = true;

            try {
                //validate email
                if (!this.email) {
                    this.showToast("O email é obrigatorio", "warn");
                    return;
                }

                // API call
                await requestPasswordReset(this.email);
                this.showToast("O email de recuperação foi enviado com sucesso", "success");


            } catch (error) {
                this.showToast(error.response?.data?.error || "Falha ao enviar o e-mail de recuperação", "error");
            } finally {
                this.loading = false;
            }
        },
        showToast(message, severity) {
            this.$refs.toast.add({ severity, summary: "Password Recovery", detail: message, life: 3000 });
        },
    },
};
</script>

<style scoped>
/* Personalize conforme necessário */
</style>