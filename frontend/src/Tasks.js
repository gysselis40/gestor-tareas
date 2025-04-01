import React, { useState, useEffect } from 'react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Llama al endpoint de Flask para obtener las tareas
        fetch('http://127.0.0.1:5000/tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error al obtener las tareas:', error));
    }, []);

    return (
        <div>
            <h1>Lista de Tareas</h1>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <strong>{task.title}</strong>: {task.description} ({task.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;
