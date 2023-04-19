const listEl = document.getElementById('list')
const todosEl = document.getElementById('todos')
const doneEl = document.getElementById('done')
const deletedEl = document.getElementById('delete')
const pendingEl = document.getElementById('pending')
const thumbEl = document.getElementById('thumb')


const backdropEl = document.getElementById('backdrop')
const modelEl = document.getElementById('model')
const modelConform = document.getElementById('confrom-delete-model')


let darkMode = false;


let total = []

let stat = {
    total: 0,
    pending: 0,
    done: 0,
    deleteCount: 0
}

function setup() {
    const x = JSON.parse(localStorage.getItem('data'))
    const st = JSON.parse(localStorage.getItem('stat'))
    const mode = JSON.parse(localStorage.getItem('mode'))

    if (x !== null)
        total = x
    if (st !== null) {
        stat = st
    }
    if(mode !== null){
        darkMode = mode
    }
    switchMode()
}

function rerender(ls) {

    let elements = ""
    for (let i = 0; i < ls.length; i++) {

        elements += `
        <div class="task ${ls[i].done ? "done" : ''}" key=${i}>
        <i class="fa-solid fa-check check-box" onclick="check(event)"></i>
        <div class="task-body">
            <input type="text" oninput="onInputHandler(event)" value="${ls[i].title}" ${ls[i].editable ? "disabled" : ""}>
            <p>${ls[i].assignee}</p>
        </div>
        <div class="control">
            <i class="fa-solid fa-pen-to-square" onclick="edit(event)"></i>
            <i class="fa-solid fa-trash" onclick="onModelOpenHandler(event, 'deleteEl(event, ${i})', 'Are you sure to delete this task')"></i>
        </div>
    </div>
        `
    }
    listEl.innerHTML = elements

    localStorage.setItem('data', JSON.stringify(total))


}


function siwtchButtonHandler(event){
    darkMode = !darkMode
    switchMode()
    
    
}
function switchMode(){
    if(darkMode){
        thumbEl.style.left = '2em'  
    }
    else{
        thumbEl.style.left = '0px'
    }
    localStorage.setItem('mode', darkMode)
    document.body.className = darkMode ? "dark": ''
}
function renderStatisics() {
    doneEl.innerText = stat.done
    deletedEl.innerText = stat.deleteCount
    pendingEl.innerText = stat.pending
    todosEl.innerText = total.length

    localStorage.setItem('stat', JSON.stringify(stat))

}
function check(event) {
    if (total[event.target.parentElement.getAttribute('key')].done) {
        total[event.target.parentElement.getAttribute('key')].done = false
        stat = { ...stat, done: stat.done - 1, pending: stat.pending + 1 }

    } else {
        total[event.target.parentElement.getAttribute('key')].done = true
        total[event.target.parentElement.getAttribute('key')].editable = true
        stat = { ...stat, done: stat.done + 1, pending: stat.pending - 1 }
    }
    


    rerender(total)
    renderStatisics()

}
function deleteEl(event, index) {
    event.preventDefault()
    if (total[index].done) {
        stat = { ...stat, done: stat.done - 1, deleteCount: stat.deleteCount + 1 }
    }
    else {
        stat = { ...stat, pending: stat.pending - 1, deleteCount: stat.deleteCount + 1 }
    }
    total = total.filter((p, i) => i != index)
    onModelCloseHandler()
    rerender(total)
    renderStatisics()
}


function edit(event) {
    const key = event.target.parentElement.parentElement.getAttribute('key')
    if(total[parseInt(key)].done)return;
    total[parseInt(key)].editable = !total[parseInt(key)].editable
    rerender(total)



}
addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        for (let item of total) {
            item.editable = true
        }
        rerender(total)
    }
})
function onInputHandler(event) {
    const key = event.target.parentElement.parentElement.getAttribute('key')
    total[parseInt(key)].title = event.target.value;
}

function search(event) {
    let filtered_list = total.filter((item, index) => item.title.match(event.target.value))
    rerender(filtered_list)
}

function onModelOpenHandler(event,callback, message) {
    modelConform.innerHTML = `  
    <form action="" onsubmit="${callback}">
        <button class="btn">${message}</button>
        </form>
    <button class='btn'  onclick=' onModelCloseHandler()'>cancle<button>
    `
    if (modelConform.style.display === "none") {
        modelConform.style.display = 'flex'
        backdropEl.style.display = "block"
    } else {
        modelConform.style.display = 'none'
        backdropEl.style.display = "none"
    }
}
function onModelCloseHandler(){
    modelConform.style.display = 'none'
    backdropEl.style.display = "none"
}
function onAddTaskOpenHandler(event) {

    if (modelEl.style.display == "none") {
        modelEl.style.display = 'block'
        backdropEl.style.display = "block"
    } else {
        modelEl.style.display = 'none'
        backdropEl.style.display = "none"
    }
}
function modelCloseHandler() {
    modelEl.style.display = 'none'
    backdropEl.style.display = "none"
    modelConform.style.display = 'none'
}
function addTask(event) {
    event.preventDefault()
    let title = event.target.children[1].value
    let assignee = event.target.children[3].value

    total.push({ title, assignee, editable: true, done: false })

    event.target.children[1].value = ""
    event.target.children[3].value = ""
    stat = { ...stat, pending: stat.pending + 1 }
    modelCloseHandler()
    rerender(total)
    renderStatisics()
}




function markAllAsDone() {
    for (item of total) {
        item.done = true;
    }
    stat = { ...stat, done: total.length, pending: 0 }


    rerender(total)
    renderStatisics()

}
function markAllAsUnDone() {
    for (item of total) {
        item.done = false;
    }
    stat = { ...stat, pending: total.length, done: 0 }

    rerender(total)
    renderStatisics()

}

function clearDoneTasks() {
    event.preventDefault()

    let x = total.length
    total = total.filter((item) => item.done === false)
    stat = { ...stat, pending: total.length, done: 0,deleteCount:stat.deleteCount+(x-total.length) }
    onModelCloseHandler()
    rerender(total)
    renderStatisics()

}
function clearAll(event) {
    event.preventDefault()
    let deletedNo = total.length
    total = []
    stat = { ...stat, pending: 0, done: 0, deleteCount:stat.deleteCount+deletedNo }
    onModelCloseHandler()
    
    rerender(total)
    renderStatisics()

}
setup()
renderStatisics()
rerender(total)