import { menu } from "./menu.js"

// VARIABLES
const order = []
let orderComplete = false
let name

// RENDER MENU
document.getElementById("menu-container")
.innerHTML = menu.map(e => `
    <div class="item" id="${e.id}">
        <p class="emoji">${e.emoji}</p>
        <div class="item-description">
            <p class="item-name text24">${e.item}</p>
            <p class="ingredients">${e.ingredients.map(i => {
                return i.charAt(0).toUpperCase() + i.slice(1)
            }).join(", ")}</p>
            <p class="price">$${e.price}</p>
        </div>
        <button class="add-btn btn" data-id="${e.id}">+</button>
    </div>
`).join('')

// EVENT LISTENERS
document.addEventListener("click", function(e){
    if(e.target.dataset.id){
        handleAddBtn(e.target.dataset.id)
    }else if(e.target.dataset.remove){
        handleRemoveOne(e.target.dataset.remove)
    }else if(e.target.dataset.removeAll){
        handleRemoveAll(e.target.dataset.removeAll)
    }else if(e.target.id === "complete-btn"){
        handleCompleteOrder()
    }else if(e.target.id === "close-btn" ||
    document.getElementById('payment-modal') &&
    !Array.from(e.target.classList).includes("modal")){
        handleCloseModal()
    }
})

document.addEventListener("submit", function(e){
    e.preventDefault()
    if(e.target.id === "payment-details"){
        handlePayment()
    }
})

// FUNCTIONS
function handleAddBtn(itemId){
    if(order.length === 0){
        document.getElementById('order-container').classList.remove('hidden')
    }

    const newItem = menu.filter(e => e.id === itemId)[0]

    if(order.filter(e => e.item === newItem.item).length === 0){
        order.push({item: newItem.item, price: newItem.price, quantity: 1})
    }else{
        order.filter(e => e.item === newItem.item)[0].quantity += 1
    }

    renderOrder()
    renderTotalPrice()
}

function renderOrder(){
    if(order.length){
        document.getElementById("user-order").innerHTML = order.map(e => `
            <div class="order-item">
                <p>${e.item}</p>
                <p class="order-item-quantity">x${e.quantity}</p>
                <button class="remove-btn btn" data-remove="${e.item}">remove one</button>
                <button class="remove-all-btn btn" data-remove-all="${e.item}">remove all</button>
                <p class="order-item-price">$${e.price}</p>
            </div>
        `).join("")
    }else{
        document.getElementById('order-container').classList.add('hidden')
    }
}

function renderTotalPrice(){
    const totalPrice = order.reduce((p,c) => p + (c.price *c.quantity), 0)
    document.getElementById('total-price').innerText = `$${totalPrice}`
}

function handleRemoveOne(item){
    const removeItem = order.filter(e => e.item === item)[0]
    removeItem.quantity--
    if(removeItem.quantity < 1){
        const index = order.indexOf(removeItem)
        order.splice(index, 1)
    }
    renderOrder()
}

function handleRemoveAll(item){
    const index = order.indexOf(order.filter(e => e.item === item)[0])
    order.splice(index,1)
    renderOrder()
}

function handleCompleteOrder(){
    const paymentModal = document.createElement("div")

    paymentModal.classList.add("payment-modal", "modal")
    paymentModal.setAttribute("id","payment-modal")

    paymentModal.innerHTML = `
        <button class="close-btn btn" id="close-btn">X</button>
        <h2 class="text24 modal">Enter Card details</h2>
        <form class="payment-details modal" id="payment-details">
            <label for="name" class="modal">
                <input type="text" placeholder="Name on card" id="name" pattern="^[a-zA-Z\\s]+$" required class="modal"/>
            </label>
            <label for="card-number" class="modal">
                <input type="text" placeholder="Enter your card number" id="card-number" pattern="[0-9]{16}"  maxlength="16" required class="modal"/>
            </label>
            <label for="cvv" class="modal">
                <input type="text" placeholder="Enter card cvv" id="cvv" pattern="[0-9]{3}" maxlength="3" required class="modal"/>
            </label>
            <button class="pay-btn green-btn btn modal" id="pay-btn">Pay</button>
        </form>
    `

    document.querySelector('body').appendChild(paymentModal)
}

function handlePayment(){
    name = document.getElementById("name").value

    const paymentModal = document.getElementById("payment-modal")

    paymentModal.style.textAlign = "center"

    paymentModal.innerHTML = `
        <button class="close-btn btn" id="close-btn" style="color: red; font-size: 10px">cancel</button>
        <img class="align-svg" src="./assets/tube-spinner.svg" alt="processing" width="200px" height="200px"/>
        <p>Processing...</p>
    `

    setTimeout(function(){
        paymentModal.innerHTML = `
        <button class="close-btn btn" id="close-btn">X</button>
        <img class="align-svg" src="./assets/correct.png" alt="order complete" width="150px" height="150px"/>
        <p class="thanks">Thank you ${name}, Order Complete!</p>

        <a class="attribution" href="https://www.flaticon.com/free-icons/correct" title="correct icons">Correct icons created by kliwir art - Flaticon</a>
        `
        orderComplete = true
    }, 2500)
}

function handleCloseModal(){
    document.getElementById("payment-modal").remove()
    if(orderComplete){
        document.getElementById('order-container').innerHTML = `
        <div class="order-container-completed">
            <p>Thanks ${name}! Your order is on its way! 🚚💨</p>
            <br/>
            <p>Please refresh the page to start a new order 🍴<p>
        </div>
        `
    }
}