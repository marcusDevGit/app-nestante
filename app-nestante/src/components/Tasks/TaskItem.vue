<template>
    <div class="flex items-center justify-between border-b py-2 px-4 hover:bg-gray-100">
        <!-- Botão para marcar como concluído -->
        <button @click="$emit('toggle-completed', task.id)"
            class="h-6 w-6 rounded-full border border-gray-400 flex items-center justify-center mr-4"
            :class="{ 'bg-green-500': task.completed }">
            <i v-if="task.completed" class="pi pi-check text-white"></i>
        </button>

        <!-- Detalhes da tarefa -->
        <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ task.name }}</h3>
            <p class="text-sm text-gray-600">{{ task.description }}</p>
            <div class="flex items-center space-x-2 mt-1">
                <span v-for="tag in task.tags" :key="tag" class="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                    {{ tag }}
                </span>
            </div>
            <p class="text-xs text-gray-500 mt-2">
                Data: {{ task.dueDate }} | Alarme: {{ task.alarm }} | Repetir: {{ task.repeat }}
            </p>
        </div>

        <!-- Ações -->
        <div class="flex items-center space-x-2">
            <PrimeButton icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="$emit('edit', task.id)" />
            <PrimeButton icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                @click="$emit('delete', task.id)" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        task: Object,
    },
};
</script>
