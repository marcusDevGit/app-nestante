<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Tarefas</h2>
            <PrimeButton label="Nova Tarefa" icon="pi pi-plus" class="p-button-success" @click="openDialog" />
        </div>

        <!-- Lista de Tarefas Não Concluídas -->
        <div>
            <h3 class="text-xl font-semibold mb-2">Não Concluídas</h3>
            <div v-if="tasks.filter(t => !t.completed).length === 0" class="text-gray-500">
                Nenhuma tarefa pendente.
            </div>
            <TaskItem v-for="task in tasks.filter(t => !t.completed)" :key="task.id" :task="task"
                @toggle-completed="toggleCompleted" @edit="editTask" @delete="deleteTask" />
        </div>

        <!-- Lista de Tarefas Concluídas -->
        <div class="mt-6">
            <h3 class="text-xl font-semibold mb-2">Concluídas</h3>
            <div v-if="tasks.filter(t => t.completed).length === 0" class="text-gray-500">
                Nenhuma tarefa concluída.
            </div>
            <TaskItem v-for="task in tasks.filter(t => t.completed)" :key="task.id" :task="task"
                @toggle-completed="toggleCompleted" @edit="editTask" @delete="deleteTask" />
        </div>

        <!-- Diálogo de Tarefa -->
        <TaskDialog v-if="showDialog" :task="editingTask" @close="closeDialog" @save="saveTask" />
    </div>
</template>

<script>
import TaskItem from './TaskItem.vue';
import TaskDialog from './TaskDialog.vue';

export default {
    components: { TaskItem, TaskDialog },
    data() {
        return {
            tasks: [
                {
                    id: 1,
                    name: 'Comprar materiais',
                    description: 'Comprar papel, canetas e tinta para impressora.',
                    tags: ['compras', 'escritório'],
                    dueDate: '2024-12-25',
                    alarm: '08:00',
                    repeat: 'Semanalmente',
                    completed: false,
                },
                {
                    id: 2,
                    name: 'Reunião de equipe',
                    description: 'Discutir as metas do próximo trimestre.',
                    tags: ['trabalho'],
                    dueDate: '2024-12-22',
                    alarm: '14:00',
                    repeat: 'Nenhum',
                    completed: true,
                },
            ],
            showDialog: false,
            editingTask: null,
        };
    },
    methods: {
        toggleCompleted(taskId) {
            const task = this.tasks.find((t) => t.id === taskId);
            if (task) task.completed = !task.completed;
        },
        openDialog() {
            console.log('Abrindo o diálogo. Tarefa:');  // Log de depuração
            this.task = { name: '', dueDate: '', completed: false };  // Inicializa a tarefa
            this.editingTask = null;  // Define a tarefa que será editada ou null para nova tarefa
            this.showDialog = true;  // Altera o estado de showDialog para exibir o diálogo
        },
        closeDialog() {
            console.log('Fechando o diálogo.');  // Log de depuração
            this.showDialog = false;
            this.editingTask = null;  // Reseta a tarefa editada
        },
        saveTask(task) {
            console.log('Salvando tarefa:', task);  // Log de depuração
            if (task.id) {
                const index = this.tasks.findIndex((t) => t.id === task.id);
                if (index !== -1) {
                    this.tasks.splice(index, 1, { ...task });
                }
            } else {
                task.id = Date.now();
                this.tasks.push(task);
            }
            this.closeDialog();
        },
        editTask(taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                this.openDialog(task);  // Passa a tarefa para edição
            }
        },
        deleteTask(taskId) {
            this.tasks = this.tasks.filter((t) => t.id !== taskId);
        },
    },
};
</script>
