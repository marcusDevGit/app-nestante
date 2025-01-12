<!--TaskForm-->
<template>
    <form @submit.prevent="submitForm">
        <div class="mb-4">
            <label for="name" class="block text-sm font-medium">Nome</label>
            <PrimeInputText v-model="form.name" id="name" class="w-full" />
        </div>
        <div class="mb-4">
            <label for="description" class="block text-sm font-medium">Descrição</label>
            <textarea v-model="form.description" id="description" class="w-full"></textarea>
        </div>
        <div class="mb-4">
            <label for="tags" class="block text-sm font-medium">Tags</label>
            <PrimeInputText v-model="form.tags" id="tags" placeholder="Ex: trabalho, urgente" />
        </div>
        <div class="mb-4">
            <label for="dueDate" class="block text-sm font-medium">Data para Concluir</label>
            <PrimeInputText type="date" v-model="form.dueDate" id="dueDate" />
        </div>
        <div class="mb-4">
            <label for="alarm" class="block text-sm font-medium">Alarme</label>
            <PrimeInputText type="time" v-model="form.alarm" id="alarm" />
        </div>
        <div class="mb-4">
            <label for="repeat" class="block text-sm font-medium">Repetir</label>
            <PrimeInputText v-model="form.repeat" id="repeat" placeholder="Ex: Diário, Semanal" />
        </div>
        <div class="flex justify-end space-x-2">
            <PrimeButton label="Cancelar" class="p-button-text" @click="$emit('cancel')" />
            <PrimeButton label="Salvar" class="p-button-success" type="submit" />
        </div>
    </form>
</template>

<script>
export default {
    props: {
        task: Object,
    },
    data() {
        return {
            form: this.task ? { ...this.task } : { name: '', description: '', tags: '', dueDate: '', alarm: '', repeat: '' },
        };
    },
    methods: {
        submitForm() {
            // Emite a tarefa editada (garantindo que a tarefa seja reativa)
            this.$emit('save', { ...this.form });
        },
    }

};
</script>
