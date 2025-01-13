/** ----------- Navbar ----------- */
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

/** ----------- Slider ----------- */
let imgs = ["img/Slider/1.jpg", "img/Slider/2.jpg", "img/Slider/3.jpg", "img/Slider/4.jpg", "img/Slider/5.jpg", "img/Slider/6.jpg", "img/Slider/7.jpg", "img/Slider/8.jpg", "img/Slider/9.jpg", "img/Slider/10.jpg", "img/Slider/11.jpg", "img/Slider/12.jpg", "img/Slider/13.jpg", "img/Slider/14.jpg", "img/Slider/15.jpg", "img/Slider/16.jpg", "img/Slider/17.jpg", "img/Slider/18.jpg", "img/Slider/19.jpg", "img/Slider/20.jpg", "img/Slider/21.jpg", "img/Slider/22.jpg", "img/Slider/23.jpg", "img/Slider/24.jpg", "img/Slider/25.jpg", "img/Slider/26.jpg", "img/Slider/27.jpg", "img/Slider/28.jpg", "img/Slider/29.jpg", "img/Slider/30.jpg", "img/Slider/31.jpg", "img/Slider/32.jpg", "img/Slider/33.jpg", "img/Slider/34.jpg", "img/Slider/35.jpg", "img/Slider/36.jpg", "img/Slider/37.jpg", "img/Slider/38.jpg", "img/Slider/39.jpg","img/Slider/40.jpg"];

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
let i = 0;
prev.addEventListener("click", function () {
  i--;
  if (i < 0) {
    i = imgs.length - 1;
  }
  setTimeout(() => {
    document.querySelector(".overlay-img").src = imgs[i];
  }, 500);
});

next.addEventListener("click", function () {
  i++;
  if (i > imgs.length - 1) {
    i = 0;
  }
  setTimeout(() => {
    document.querySelector(".overlay-img").src = imgs[i];
  }, 500);
});

let x = 0;
setInterval(() => {
  x++;
  if (x > imgs.length - 1) {
    x = 0;
  }
  document.querySelector(".overlay-img").src = imgs[x];
}, 3000);

/** --------- products ---------------- */

const pro = document.querySelectorAll(".pro-container")[0];
const filter = document.querySelectorAll(".filter-btn");
let productsData = [];

// Fetch product data from products.json
fetch('API/products.json')
  .then(response => response.json())
  .then(data => {
    productsData = data.products; // Store the data in a higher scope
    // Populate products
    requestAndBuild(productsData);
  })
  .catch(error => console.error('Error fetching products:', error));

function requestAndBuild(products) {
  // Build product cards
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <p>$${product.price}</p>
      <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
    `;
    pro.appendChild(productCard);
  });

  // Add event listeners to add-to-cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  const product = productsData.find(p => p.id == productId);
  if (product) {
    // Add product to cart logic here
    console.log('Product added to cart:', product);
    // Example: Add product to local storage or update cart UI
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  } else {
    console.error('Product not found');
  }
}

function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCounter = document.getElementById('cart-counter');
  cartCounter.textContent = cart.length;
  // Update other cart UI elements if needed
}

// Call updateCartUI on page load to reflect the current cart state
document.addEventListener('DOMContentLoaded', updateCartUI);

/** --------- product ----------- */
function clicked(id) {
  window.open("product.html?id=" + id, "_blank");
}

/** --------- arrow ----------- */
function scrollToTop() {
  document.documentElement.scrollTop = 0;
}

window.onscroll = function () {
  if (
    document.body.scrollTop > window.outerHeight ||
    document.documentElement.scrollTop > window.outerHeight
  ) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
};

/** ----------- cart ----------- */
const cartIcon = document.getElementById("cart-icon");
const cartContainer = document.getElementById("cart-section");
const closeCart = document.getElementById("close-cart");
let productIDs = [];

cartIcon.addEventListener("click", function () {
  cartContainer.classList.add("show");
});

closeCart.addEventListener("click", function () {
  cartContainer.classList.remove("show");
});

let countSpan = document.getElementById("cart-counter");
// function to load the cart content
async function loadCartContent() {
  // Clear the cart content before loading
  let cartContent = document.getElementById("cart-content");
  cartContent.innerHTML = "";

  let storedProductIDs = localStorage.getItem("productIDs");

  // Check if localStorage item exists
  if (storedProductIDs) {
    productIDs.push(...storedProductIDs.split(","));

    // Use Promise.all to wait for all fetch requests to complete
    await Promise.all(
      productIDs.map(async (id) => {
        try {
          const response = await fetch(
            `API/products.json?id=${id}`
          );
          const data = await response.json();

          cartContent.innerHTML += `<div id="cart-box" class="cart-box ${data[0].id}">
            <img id='cart-img' src="${data[0].img}" alt="">
            <div id="product-details">
              <h4 id="product-name">${data[0].name}</h4>
              <h5 id="product-price" class="product-price">$${data[0].price}</h5>
              <input type="number" id="product-quantity" class="product-quantity" value="1">
            </div>
            <i class="fa-solid fa-trash" id="remove"></i>
          </div>`;
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      })
    );
  }
  update(); // Call update function after loading the cart content
}

loadCartContent();

// start when the page is loaded
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", start);
  let counter = localStorage.getItem("counter");
  countSpan.innerHTML = counter;
} else {
  start();
}

//start function
function start() {
  addEvents();
}

//update & render
function update() {
  addEvents();
  updateTotal();
}

//add event
function addEvents() {
  //remove product from cart
  let removeCartBtn = document.getElementsByClassName("fa-trash");
  for (let i = 0; i < removeCartBtn.length; i++) {
    removeCartBtn[i].addEventListener("click", handle_removeProduct);
  }

  //change product quantity
  let quantityInputs = document.getElementsByClassName("product-quantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    quantityInputs[i].addEventListener("change", handle_changeProductQuantity);
  }

  //checkout
  let checkoutBtn = document.getElementById("checkout");
  checkoutBtn.addEventListener("click", handle_checkout);
}

//handle events

function handle_checkout() {
  if (productIDs.length == 0) {
    Swal.fire({
      icon: "error",
      title: "Cart is empty",
      text: "You need to add product first!",
    });
    return;
  }
  let cartcontent = document.getElementById("cart-content");
  cartcontent.innerHTML = "";
  productIDs = [];
  localStorage.setItem("counter", productIDs.length);
  localStorage.setItem("productIDs", productIDs);
  countSpan.innerHTML = 0;
  Swal.fire({
    position: "center-center",
    icon: "success",
    title: "Successfully Checkout!",
    showConfirmButton: false,
    timer: 1500,
  });
  update();
}

async function addToCart(id) {
  let cartContent = document.getElementById("cart-content");
  if (productIDs.find((element) => element == id)) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Product already added!",
    });
    return;
  }
  try {
    const response = await fetch(
      `API/products.json?id=${id}`
    );
    const data = await response.json();

    cartContent.innerHTML += `<div id="cart-box" class="cart-box ${data[0].id}">
      <img id='cart-img' src="${data[0].img}" alt="">
      <div id="product-details">
        <h4 id="product-name">${data[0].name}</h5>
        <h5 id="product-price" class="product-price">${data[0].price}</h5>
        <input type="number" id="product-quantity" class="product-quantity" value="1">
      </div>
      <i class="fa-solid fa-trash" id="remove"></i>
    </div>`;

    productIDs.push(data[0].id);
    localStorage.setItem("counter", productIDs.length);
    localStorage.setItem("productIDs", productIDs);
    countSpan.innerHTML = productIDs.length;
    update();
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "Your product has been added!",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}

function handle_removeProduct() {
  let removedProduct = this.parentElement.classList[1];
  this.parentElement.remove();
  productIDs = productIDs.filter((element) => element != removedProduct);
  localStorage.setItem("counter", productIDs.length);
  localStorage.setItem("productIDs", productIDs);
  countSpan.innerHTML = productIDs.length;
  update();
}

function handle_changeProductQuantity() {
  if (isNaN(this.value) || this.value <= 0) {
    this.value = 1;
  }
  this.value = Math.floor(this.value);
  update();
}

//update and render functions
function updateTotal() {
  let cartBoxes = document.getElementsByClassName("cart-box");
  let cartArray = Array.from(cartBoxes);
  let totalElement = document.getElementById("total-amount");
  let total = 0;
  cartArray.forEach((cartBox) => {
    let priceElement = cartBox.getElementsByClassName("product-price")[0];
    let price = parseFloat(priceElement.innerText.replace("$", ""));
    let quantity = cartBox.getElementsByClassName("product-quantity")[0].value;
    total = total + price * quantity;
  });

  total = total.toFixed(2);
  totalElement.innerHTML = `$${total}`;
}

// filepath: /c:/Users/NTG/Downloads/El-Wisam/El-Wisam/main.js
function addToCart(productId) {
  fetch('API/products.json')
    .then(response => response.json())
    .then(data => {
      const product = data.products.find(p => p.id == productId);
      if (product) {
        // Add product to cart logic here
        console.log('Product added to cart:', product);
        // Example: Add product to local storage or update cart UI
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
      } else {
        console.error('Product not found');
      }
    })
    .catch(error => console.error('Error fetching product:', error));
}

// Example usage of addToCart function
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.getAttribute('data-product-id');
    addToCart(productId);
  });
});

function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCounter = document.getElementById('cart-counter');
  cartCounter.textContent = cart.length;
  // Update other cart UI elements if needed
}

// Call updateCartUI on page load to reflect the current cart state
document.addEventListener('DOMContentLoaded', updateCartUI);
