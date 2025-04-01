import React, { useState, useEffect } from 'react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'sin empezar' });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch('http://127.0.0.1:5000/tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error al obtener las tareas:', error));
    };

    const handleCreateTask = () => {
        fetch('http://127.0.0.1:5000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        })
            .then(response => response.json())
            .then(() => {
                fetchTasks();
                setNewTask({ title: '', description: '', status: 'sin empezar' });
            })
            .catch(error => console.error('Error al crear la tarea:', error));
    };

    const handleUpdateTask = (taskId) => {
        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingTask),
        })
            .then(response => response.json())
            .then(() => {
                fetchTasks();
                setEditingTask(null);
            })
            .catch(error => console.error('Error al actualizar la tarea:', error));
    };

    const handleDeleteTask = (taskId) => {
        fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
            method: 'DELETE',
        })
            .then(() => fetchTasks())
            .catch(error => console.error('Error al eliminar la tarea:', error));
    };

    return (
        <div>
            <h1>Lista de Tareas</h1>

            {/* Formulario para crear una nueva tarea */}
            <div>
                <h2>Crear Tarea</h2>
                <input
                    type="text"
                    placeholder="Título"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                    <option value="sin empezar">Sin Empezar</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en proceso">En Proceso</option>
                    <option value="terminado">Terminado</option>
                </select>
                <button onClick={handleCreateTask}>Crear</button>
            </div>

            {/* Lista de tareas */}
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {editingTask && editingTask.id === task.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editingTask.description}
                                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                />
                                <select
                                    value={editingTask.status}
                                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                                >
                                    <option value="sin empezar">Sin Empezar</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="en proceso">En Proceso</option>
                                    <option value="terminado">Terminado</option>
                                </select>
                                <button onClick={() => handleUpdateTask(task.id)}>Guardar</button>
                                <button onClick={() => setEditingTask(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <div>
                                <strong>{task.title}</strong>: {task.description} ({task.status})
                                <button onClick={() => setEditingTask(task)}>Editar</button>
                                <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;