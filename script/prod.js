let productImg = document.getElementById("product-img");
let productName = document.getElementById("name");
let productCategory = document.getElementById("brand");
let productPrice = document.getElementById("price");
let productPar = document.getElementById("par");
const id = new URLSearchParams(window.location.search).get("id");
fetch(`API/products.json`)
  .then((res) => res.json())
  .then((data) => {
    const product = data.products.find(p => p.id == id);
    if (product) {
      productImg.src = product.img;
      productName.innerHTML = product.name;
      productCategory.innerHTML = product.category;
      productPrice.innerHTML = `${product.oldPrice ? `<span style="color: red; text-decoration: line-through;">$${product.oldPrice}</span> ` : ''}$${product.price}`;
      productPar.innerHTML = product.description;
    } else {
      console.error('Product not found');
    }
  })
  .catch(error => console.error('Error fetching products:', error));

function scrollToTop() {
  document.documentElement.scrollTop = 0;
}

window.onscroll = function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
};

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
