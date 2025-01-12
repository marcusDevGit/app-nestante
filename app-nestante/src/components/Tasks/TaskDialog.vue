<!--TaskDialog-->
<template>
    <PrimeCard>
        <h3 class="text-lg font-semibold mb-4">
            {{ task?.id ? 'Editar Tarefa' : 'Nova Tarefa' }}
        </h3>
        <TaskForm :task="task" @save="handleSave" @cancel="$emit('close')" />
    </PrimeCard>
</template>

<script>
import TaskForm from './TaskForm.vue';

export default {
    props: {
        task: Object,
    },
    components: {
        TaskForm,
    },
    methods: {
        handleSave(task) {
            console.log('Tarefa salva:', task);  // Log de depuração
            this.$emit('save', task);
        },
    }


};
</script>