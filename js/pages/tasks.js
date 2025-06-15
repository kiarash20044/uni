// js/pages/tasks.js

import { AppState } from '../state.js';
import { StorageService } from '../services/storageService.js';
import { fadeIn } from '../utils/animations.js';
import { exportElementToPdf } from '../services/printService.js';

const storage = new StorageService();

function getInitialTasks() {
    const defaultTasks = [
        { id: `task-${Date.now() + 1}`, content: 'Complete project proposal', column: 'todo' },
        { id: `task-${Date.now() + 2}`, content: 'Study for calculus exam', column: 'todo' },
        { id: `task-${Date.now() + 3}`, content: 'Work on physics assignment', column: 'inprogress' },
        { id: `task-${Date.now() + 4}`, content: 'Submit history essay', column: 'done' },
    ];
    return storage.get('tasks', defaultTasks);
}

let tasks = getInitialTasks();
let draggedItem = null;

function saveTasks() {
    storage.set('tasks', tasks);
}

function renderTaskCard(task) {
    return `
        <div class="kanban-card" id="${task.id}" draggable="true">
            <p>${task.content}</p>
        </div>
    `;
}

function renderKanbanColumns(i18n) {
    const columns = [
        { id: 'todo', title: i18n.translate('todo') },
        { id: 'inprogress', title: i18n.translate('inProgress') },
        { id: 'done', title: i18n.translate('done') }
    ];

    return columns.map(col => {
        const columnTasks = tasks.filter(task => task.column === col.id);
        return `
            <div class="kanban-column" id="column-${col.id}" data-column-id="${col.id}">
                <h3 class="kanban-column-title">${col.title}</h3>
                <div class="kanban-cards">
                    ${columnTasks.map(renderTaskCard).join('')}
                </div>
                <form class="add-task-form">
                    <input type="text" class="input is-small add-task-input" placeholder="${i18n.translate('addTask')}...">
                </form>
            </div>
        `;
    }).join('');
}

function addDragAndDropListeners() {
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');

    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            draggedItem = card;
            setTimeout(() => card.classList.add('is-dragging'), 0);
        });

        card.addEventListener('dragend', () => {
            draggedItem.classList.remove('is-dragging');
            draggedItem = null;
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const cardsContainer = column.querySelector('.kanban-cards');
            if (afterElement == null) {
                cardsContainer.appendChild(draggedItem);
            } else {
                cardsContainer.insertBefore(draggedItem, afterElement);
            }
        });

        column.addEventListener('drop', e => {
            e.preventDefault();
            const columnId = column.dataset.columnId;
            const taskId = draggedItem.id;

            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.column = columnId;
                saveTasks();
            }
        });
    });
}

function getDragAfterElement(column, y) {
    const draggableElements = [...column.querySelectorAll('.kanban-card:not(.is-dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function addTaskFormListeners() {
    const forms = document.querySelectorAll('.add-task-form');
    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('.add-task-input');
            const content = input.value.trim();
            const columnId = form.closest('.kanban-column').dataset.columnId;

            if (content) {
                const newTask = {
                    id: `task-${Date.now()}`,
                    content: content,
                    column: columnId
                };
                tasks.push(newTask);
                saveTasks();
                
                const cardsContainer = form.previousElementSibling;
                const newTaskEl = document.createElement('div');
                newTaskEl.innerHTML = renderTaskCard(newTask);
                cardsContainer.appendChild(newTaskEl.firstElementChild);
                
                // This is a simplified way to re-attach listeners. In a more complex app,
                // you might delegate the event listener to the parent container.
                addDragAndDropListeners();
                input.value = '';
            }
        });
    });
}

function addPageActionListeners(i18n) {
    const exportBtn = document.getElementById('export-tasks-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportElementToPdf('kanban-board', i18n.translate('tasks'), 'student-dashboard-tasks.pdf');
        });
    }
}

export function renderTasksPage(appState, i18n) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'kanban-board-container';
    
    pageContainer.innerHTML = `
        <button class="button is-small export-pdf-btn" id="export-tasks-btn">
            <span class="icon"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,12L12,19L5,12H9V4H15V12H19M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg></span>
            <span>${i18n.translate('exportPdf')}</span>
        </button>
        <div class="kanban-board" id="kanban-board">
            ${renderKanbanColumns(i18n)}
        </div>
    `;

    setTimeout(() => {
        addDragAndDropListeners();
        addTaskFormListeners();
        addPageActionListeners(i18n);
        fadeIn(pageContainer);
    }, 0);
    
    return pageContainer;
}