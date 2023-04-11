const listEl = document.getElementById('list')
const todosEl = document.getElementById('todos')
const doneEl = document.getElementById('done')
const deletedEl = document.getElementById('delete')

const deletedList = []
let doneTodos = 1;

let deleted = 0;

function rerender() {
    doneEl.innerHTML = doneTodos
    deletedEl.innerHTML = deletedList.length
    todosEl.innerText = listEl.children.length

}

function check(event) {
    const index = Array.from(
        listEl.children
    ).indexOf(event.target.parentElement);
    const el = listEl.children[index]
    if (el.classList[1]) {
        el.classList.remove('done')
        doneTodos--;
    }
    else {
        doneTodos++;
        el.classList.add('done')
    }
    rerender()
}
function deleteEl(event) {
    const index = Array.from(
        listEl.children
    ).indexOf(event.target.parentElement.parentElement);

    const el = listEl.children[index]
    deletedList.splice(0, 0, el)
    
    el.remove()
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