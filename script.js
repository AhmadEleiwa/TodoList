const listEl = document.getElementById('list')
const todosEl = document.getElementById('todos')
const doneEl = document.getElementById('done')
const deletedEl = document.getElementById('delete')
const pendingEl = document.getElementById('pending')


const backdropEl = document.getElementById('backdrop')
const modelEl = document.getElementById('model')



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
    if(x !== null)
        total = x
    if (st !== null) {
        stat =   st  
    }
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
            <i class="fa-solid fa-trash" onclick="deleteEl(event)"></i>
        </div>
    </div>
        `
    }
    listEl.innerHTML = elements

    localStorage.setItem('data', JSON.stringify(total))


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
        stat = { ...stat, done: stat.done + 1, pending: stat.pending - 1 }
    }
    // total[event.target.parentElement.getAttribute('key')].done


    rerender(total)
    renderStatisics()

}
function deleteEl(event) {

    let x = event.target.parentElement.parentElement.getAttribute('key')
    if(total[parseInt(x)].done ){
        stat={...stat, done:stat.done-1, deleteCount:stat.deleteCount+1}
    }
    else{
        stat={...stat, pending:stat.pending-1, deleteCount:stat.deleteCount+1}
    }
    total = total.filter((p, i) => i != x)
    rerender(total)
    renderStatisics()
}


function edit(event) {
    const key = event.target.parentElement.parentElement.getAttribute('key')
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

function onAddTasnOpenHandler(event) {
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
    stat={...stat, done:total.length, pending:0}


    rerender(total)
    renderStatisics()

}
function markAllAsUnDone() {
    for (item of total) {
        item.done = false;
    }
    stat={...stat, pending:total.length, done:0}

    rerender(total)
    renderStatisics()

}

function clearDoneTasks() {
    total = total.filter((item) => item.done === false)
    stat={...stat, pending:total.length, done:0}
    rerender(total)
    renderStatisics()

}
function clearAll() {
    total = []
    stat={...stat, pending:0,done:0}
    rerender(total)
    renderStatisics()

}
setup()
renderStatisics()
rerender(total)