const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('tasks-container');

let editStatus = false;
let id = '';


// Guardar datos en la base de datos
const saveTask = (title, description) => {
    db.collection('tasks').doc().set({
        title: title,
        description: description
    });
}

// Leer datos de la base de datos
const getTasks = () => db.collection('tasks').get();

const getTask = (id) => db.collection('tasks').doc(id).get();

// Actualizaciones
const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);
//const querySnapshot = await getTasks();

// Borrar Base de Datos
const deleteTask = id => db.collection('tasks').doc(id).delete();

// Editar Tarea
const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async(e) => {
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = '';
        querySnapshot.forEach(doc => {

            const task = doc.data();
            task.id = doc.id;
            taskContainer.innerHTML += `<div class='card card-body mt-2 border-primary'>
                <h3 class="h5">${task.title}</h3>   
                <p>${task.description}</p>
                <div>
                    <button class="btn btn-primary btn-delete" data-id="${task.id}">Delete</button>
                    <button class="btn btn-secondary btn-edit" data-id="${task.id}">Editar</button>
                </div>              
            </div>`
        });

        const btnsDelete = document.querySelectorAll('.btn-delete');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                //console.log(e.target.dataset.id);
                await deleteTask(e.target.dataset.id);
            });
        });

        const btnsEdit = document.querySelectorAll('.btn-edit');
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                //console.log(e.target.dataset.id);
                //await deleteTask(e.target.dataset.id);
                const doc = await getTask(e.target.dataset.id);

                const task = doc.data();

                editStatus = true;
                id = doc.id;

                taskForm['btn-task-form'].innerText = 'Update';
                taskForm['task-title'].value = task.title;
                taskForm['task-description'].value = task.description;
            });
        });
    })


});


taskForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    if (!editStatus) {
        await saveTask(title.value, description.value);
    } else {
        await updateTask(id, {
            title: title.value,
            description: description.value
        });

        editStatus = false;
        id = '';
        taskForm['btn-task-form'].innerText = 'Save';
    }



    taskForm.reset();
    title.focus();


});