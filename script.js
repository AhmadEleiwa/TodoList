const listEl = document.getElementById('list')
const todosEl = document.getElementById('todos')
const doneEl = document.getElementById('done')
const deletedEl = document.getElementById('delete')
const pendingEl = document.getElementById('pending')




let total = [
    {
        title: 'Design TODO Application UI',
        done: false,
        assignee: 'Ahmad ilawa',
        editable: true

    },
    {
        title: 'Design TODO Application UI',
        done: true,
        assignee: 'Amin Nasser',
        editable: true

    }
]




function rerender() {
    let pending = 0
    let done = 0
    let deleted = 0;
    let elements = ""
    for(let i=0; i<total.length; i++){
        if(total[i].done){
            done+=1
        }else{
            pending +=1
        }
        elements+= `
        <div class="task ${total[i].done ? "done": ''}" key=${i}>
        <i class="fa-solid fa-check check-box" onclick="check(event)"></i>
        <div class="task-body">
            <input type="text" value="${total[i].title}" ${total[i].editable ? "disabled":""}>
            <p>${total[i].assignee}</p>
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


}

function check(event) {
   total[event.target.parentElement.getAttribute('key')].done = !total[event.target.parentElement.getAttribute('key')].done 


    rerender()
}
function deleteEl(event) {

    let x = event.target.parentElement.parentElement.getAttribute('key')
    total = total.filter((p, i) => i != x)
    rerender()
}


function edit(event) {

    const index = Array.from(
        listEl.children
    ).indexOf(event.target.parentElement.parentElement);
    const el = listEl.children[index]
    if (el.classList[1]) return;
    for (let item of listEl.children) {
        if (item !== el)
            item.children[1].children[0].disabled = true

    }

    if (el.children[1].children[0].disabled) {

        el.children[1].children[0].disabled = false
    } else {
        el.children[1].children[0].disabled = true
    }
}
addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        for (let item of listEl.children) {
            item.children[1].children[0].disabled = true

        }
    }
})

rerender()