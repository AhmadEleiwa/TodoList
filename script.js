const listEl = document.getElementById('list')
const todosEl = document.getElementById('todos')
const doneEl = document.getElementById('done')
const deletedEl = document.getElementById('delete')
const pendingEl = document.getElementById('pending')


const backdropEl  = document.getElementById('backdrop')
const modelEl  = document.getElementById('model')



let total = []


function setup(){
    const x = localStorage.getItem('data')
    data = JSON.parse(x)
    total = data
}

function rerender(ls) {
    let pending = 0
    let done = 0
    let deleted = 0;
    let elements = ""
    for(let i=0; i<ls.length; i++){
        if(ls[i].done){
            done+=1
        }else{
            pending +=1
        }
        elements+= `
        <div class="task ${ls[i].done ? "done": ''}" key=${i}>
        <i class="fa-solid fa-check check-box" onclick="check(event)"></i>
        <div class="task-body">
            <input type="text" oninput="onInputHandler(event)" value="${ls[i].title}" ${ls[i].editable ? "disabled":""}>
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
    doneEl.innerText = done
    deletedEl.innerText = deleted
    pendingEl.innerText = pending
    todosEl.innerText = listEl.children.length

    localStorage.setItem('data', JSON.stringify(total))


}

function check(event) {
   total[event.target.parentElement.getAttribute('key')].done = !total[event.target.parentElement.getAttribute('key')].done 


    rerender(total)
}
function deleteEl(event) {

    let x = event.target.parentElement.parentElement.getAttribute('key')
    total = total.filter((p, i) => i != x)
    rerender(total)
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
function onInputHandler(event){
    const key = event.target.parentElement.parentElement.getAttribute('key')
    total[parseInt(key)].title = event.target.value;
}

function search(event){
    let filtered_list = total.filter((item ,index) => item.title.match(event.target.value))
    rerender(filtered_list)
}

function onAddTasnOpenHandler(event){
    if(modelEl.style.display == "none" ){
        modelEl.style.display= 'block'
        backdropEl.style.display = "block"
    }else{
        modelEl.style.display= 'none'
        backdropEl.style.display = "none"
    }
}
function modelCloseHandler(){
    modelEl.style.display= 'none'
    backdropEl.style.display = "none"
}
function addTask(event){
    event.preventDefault()
    let title =  event.target.children[1].value
    let assignee = event.target.children[3].value
    total.push({title, assignee, editable:true, done:false})
    event.target.children[1].value = ""
    event.target.children[3].value = ""

    modelCloseHandler()
    rerender(total)
    
}




function markAllAsDone(){
    for(item of total){
        item.done = true;
    }
    rerender(total)
}
function markAllAsUnDone(){
    for(item of total){
        item.done = false;
    }
    rerender(total)
}

function clearDoneTasks(){
    total = total.filter((item) => item.done === false )
    rerender(total)
}
function clearAll(){
    total = []
    rerender(total)
}
setup()
rerender(total)