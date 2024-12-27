<template>
    <div class="flex items-center justify-center h-screen bg-gray-900">
        <PrimeCard class="w-full max-w-md p-6 bg-gray-800 text-gray-300 shadow-md">
            <template #header>
                <h2 class="text-xl font-semibold text-center">Redefinir Senha</h2>
            </template>
            <template #content>
                <form @submit.prevent="handlePasswordReset" class="mt-4">
                    <!-- Nova Senha -->
                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-medium" for="newPassword">Nova Senha</label>
                        <PrimePassword id="newPassword" v-model="newPassword" :feedback="false" class="w-full"
                            placeholder="Digite sua nova senha" />
                    </div>

                    <!-- Confirmar Nova Senha -->
                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-medium" for="confirmNewPassword">Confirmar Nova
                            Senha</label>
                        <PrimePassword id="confirmNewPassword" v-model="confirmNewPassword" :feedback="false"
                            class="w-full" placeholder="Confirme sua nova senha" />
                    </div>

                    <!-- Botão de Envio -->
                    <PrimeButton label="Redefinir Senha" :loading="loading" class="w-full" type="submit"
                        :icon="loading ? 'pi pi-spin pi-spinner' : ''" :disabled="loading"></PrimeButton>
                </form>

                <!-- Mensagens de Feedback -->
                <PrimeToast ref="toast"></PrimeToast>
            </template>
        </PrimeCard>
    </div>
</template>

<script>

import { resetPassword } from '../../../Api';

export default {
    data() {
        return {
            newPassword: "",
            confirmNewPassword: "",
            loading: false,
        };
    },
    methods: {
        async handlePasswordReset() {
            this.loading = true;

            try {
                // Validação básica
                if (!this.newPassword || !this.confirmNewPassword) {
                    this.showToast("Todos os campos são obrigatórios", "warn");
                    this.loading = false;
                    return;
                }

                if (this.newPassword !== this.confirmNewPassword) {
                    this.showToast("As senhas não conferem", "error");
                    this.loading = false;
                    return;
                }

                // Obter token da URL
                const token = this.$route.query.token;
                if (!token) {
                    this.showToast("Token inválido ou ausente", "error");
                    this.loading = false;
                    return;
                }
                // Chamada à API
                await resetPassword(token, this.newPassword);
                this.showToast("Senha redefinida com sucesso!", "success");
                // Redirecionar para a página de login ou outra página
                this.$router.push('/login');
            } catch (error) {
                this.showToast(error.response?.data?.error || "Falha ao redefinir a senha", "error");
            } finally {
                this.loading = false;
            }
        },
        showToast(message, severity) {
            this.$refs.toast.add({ severity, summary: "Redefinição de Senha", detail: message, life: 3000 });
        },
    },
};
</script>

<style scoped>
/* Personalize conforme necessário */
</style>