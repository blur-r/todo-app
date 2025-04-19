document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const form = document.querySelector('form');
    const taskInput = document.querySelector('input[type="text"]');
    const todosContainer = document.getElementById('todos');
    const filterSelect = document.getElementById('filter-options');
    const filterDiv = document.querySelector('.filter');

    // Initialize todos array from localStorage or empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function toggleFilterVisibility() {
        if (todos.length === 0) {
            filterDiv.style.display = 'none';
        } else {
            filterDiv.style.display = 'flex'; // Or whatever display value it had originally
        }
    }

    // Render todos based on current filter
    function renderTodos() {

        const filter = filterSelect.value;
        let filteredTodos = todos;

        if (filter === 'done') {
            filteredTodos = todos.filter(todo => todo.completed);
        } else if (filter === 'not-done') {
            filteredTodos = todos.filter(todo => !todo.completed);
        }

        todosContainer.innerHTML = '';

        if (filteredTodos.length === 0) {
            todosContainer.innerHTML = '<p>no task has been added, add one!!!!!!</p>';
        }

        filteredTodos.forEach((todo, index) => {
            const todoElement = document.createElement('div');
            todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoElement.dataset.id = todo.id;

            todoElement.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''} />
                <span class="task-text">${todo.text}</span>
                <button class="edit-btn">edit</button>
                <button class="delete-btn">delete</button>
            `;

            todosContainer.appendChild(todoElement);
        });

        toggleFilterVisibility();

        // Add event listeners to the new elements
        addEventListeners();
    }

    // Add event listeners to todo items
    function addEventListeners() {
        // Checkbox toggle
        document.querySelectorAll('.todo-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const todoId = this.closest('.todo-item').dataset.id;
                const todo = todos.find(t => t.id === todoId);
                todo.completed = this.checked;
                saveTodos();
                renderTodos();
            });
        });

        // Delete button
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const todoId = this.closest('.todo-item').dataset.id;
                todos = todos.filter(t => t.id !== todoId);
                saveTodos();
                renderTodos();
            });
        });


        // Edit button
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const todoItem = this.closest('.todo-item');
                const todoId = todoItem.dataset.id;
                const todo = todos.find(t => t.id === todoId);
                const taskText = todoItem.querySelector('.task-text');

                // Add editing class
                todoItem.classList.add('editing');

                const input = document.createElement('input');
                input.type = 'text';
                input.value = todo.text;
                input.className = 'edit-input';

                todoItem.replaceChild(input, taskText);
                input.focus();

                const saveEdit = (e) => {
                    if (e.key === 'Enter' || e.type === 'blur') {
                        const newText = input.value.trim();
                        if (newText) {
                            todo.text = newText;
                            saveTodos();
                        }
                        // Remove editing class
                        todoItem.classList.remove('editing');
                        renderTodos();
                    }
                };

                input.addEventListener('keypress', saveEdit);
                input.addEventListener('blur', saveEdit);
            });
        });
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Form submission - add new todo
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const text = taskInput.value.trim();

        if (text) {
            const newTodo = {
                id: Date.now().toString(),
                text: text,
                completed: false
            };

            todos.push(newTodo);
            saveTodos();
            renderTodos();
            taskInput.value = '';
        }
    });

    // Filter change
    filterSelect.addEventListener('change', renderTodos);



    // Initial render

    toggleFilterVisibility();
    renderTodos();
});