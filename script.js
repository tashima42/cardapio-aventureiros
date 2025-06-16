let products = [
  {
    id: 1,
    name: "Pastel de Carne",
    price: 1050,
    quantity: 0,
  },
  {
    id: 2,
    name: "Pastel de Queijo",
    price: 1050,
    quantity: 0,
  },
  {
    id: 3,
    name: "Refrigerante Coca",
    price: 500,
    quantity: 0,
  },
  {
    id: 4,
    name: "Refrigerante Guaraná",
    price: 500,
    quantity: 0,
  },
]

function loadProducts() {
  const productsDiv = document.getElementById("products")

  products.forEach(product => {
    const productDiv = document.createElement("div")
    productDiv.id = `product-${product.id}`
    productDiv.classList.add("product")

    const title = document.createElement("p")
    title.id = `product-name-${product.id}`
    title.innerHTML = product.name

    const price = document.createElement("p")
    price.id = `product-price-${product.id}`
    price.innerHTML = formatCurrency(product.price)

    const buttonsDiv = document.createElement("div")
    buttonsDiv.classList.add("product-buttons")

    const removeButton = document.createElement("button")
    removeButton.classList.add("btn")
    removeButton.classList.add("btn-danger")
    removeButton.innerHTML = "-"
    removeButton.addEventListener("click", () => changeQuantity(product.id, -1))

    const quantity = document.createElement("p")
    quantity.id = `pq-${product.id}`
    quantity.innerHTML = product.quantity

    const addButton = document.createElement("button")
    addButton.classList.add("btn")
    addButton.classList.add("btn-success")
    addButton.innerHTML = "+"
    addButton.addEventListener("click", () => changeQuantity(product.id, +1))

    buttonsDiv.appendChild(removeButton)
    buttonsDiv.appendChild(quantity)
    buttonsDiv.appendChild(addButton)

    productDiv.appendChild(title)
    productDiv.appendChild(price)
    productDiv.appendChild(buttonsDiv)

    productsDiv.appendChild(productDiv)
  })

  const totalDiv = document.createElement("div")
  totalDiv.classList.add("product")

  const totalP = document.createElement("p")
  totalP.innerHTML = "Total:"

  const totalValueP = document.createElement("p")
  totalValueP.id = "total-value"
  totalValueP.innerHTML = formatCurrency(0)

  totalDiv.appendChild(totalP)
  totalDiv.appendChild(document.createElement("span"))
  totalDiv.appendChild(totalValueP)

  productsDiv.appendChild(totalDiv)
}

function showPaymentModal() {
  const pedidoList = document.getElementById("pedido-list")

  for (const product of products) {
    if (product.quantity <= 0) {
      continue
    }
    const productLi = document.createElement("li")
    productLi.innerHTML = `${product.quantity}x - ${product.name}`

    pedidoList.appendChild(productLi)
  }

  const total = calcTotal()

  document.getElementById("modal-total").innerHTML = formatCurrency(total)

  _pix.Pix("chave", "nome", "cidade", (total / 100).toFixed(2), "pedido aventureiros", true).then(code => {
    const qrcode = document.getElementById("qrcode")
    qrcode.src = code
  });


  document.getElementById("payment-modal").style.display = "flex"
}

function closePaymentModal() {
  const pedidoList = document.getElementById("pedido-list")
  removeAllChildNodes(pedidoList)
  document.getElementById("payment-modal").style.display = "none"
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function changeQuantity(id, value) {
  const productIndex = findProduct(id)
  if (productIndex == null) {
    return
  }
  let { quantity } = products[productIndex]

  const productQuantity = document.getElementById(`pq-${id}`)
  quantity += value

  if (quantity < 0) {
    console.warn("quantity can't be less than 0")
    return
  }

  productQuantity.textContent = quantity
  products[productIndex].quantity = quantity

  updateTotalValue()
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
  }).format(amount / 100);
}

function findProduct(id) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i]

    if (product.id == id) {
      return i
    }
  }
  return null
}

function calcTotal() {
  let total = 0
  for (let i = 0; i < products.length; i++) {
    total += products[i].quantity * products[i].price
  }
  return total
}

function updateTotalValue() {
  let total = 0
  for (let i = 0; i < products.length; i++) {
    total += products[i].quantity * products[i].price

    const val = document.getElementById("pq-" + products[i].id)
    val.innerHTML = products[i].quantity
  }

  const showModal = document.getElementById("show-modal")
  showModal.setAttribute("disabled", "disabled")
  if (total > 0) {
    showModal.removeAttribute("disabled")
  }

  document.getElementById("total-value").innerHTML = formatCurrency(total)
}

function resetQuantities() {
  saveState()
  for (let i = 0; i < products.length; i++) {
    products[i].quantity = 0
  }
  updateTotalValue()
}

function saveState() {
  localStorage.setItem("last-order", JSON.stringify(products))
}

function loadState() {
  const lastOrder = localStorage.getItem("last-order")
  if (lastOrder == null) {
    return
  }
  products = JSON.parse(lastOrder)
  updateTotalValue()
}

function main() {
  loadProducts()
  updateTotalValue()
}

main()

