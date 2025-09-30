// Sample product data
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life."
    },
    {
        id: 2,
        title: "Smart Fitness Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3",
        description: "Advanced fitness tracking with heart rate monitor, GPS, and sleep tracking."
    },
    {
        id: 3,
        title: "Premium Chocolate Cake",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3",
        description: "Delicious chocolate cake made with premium ingredients for a rich taste experience."
    },
    {
        id: 4,
        title: "Ergonomic Office Chair",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3",
        description: "Premium ergonomic office chair with lumbar support and adjustable height."
    },
    {
        id: 5,
        title: "Mechanical Gaming Keyboard",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3",
        description: "RGB backlit mechanical keyboard with customizable keys and macro support."
    },
    {
        id: 6,
        title: "4K Ultra HD Laptop",
        price: 999.99,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3",
        description: "Powerful laptop with 4K display, perfect for work, gaming, and creative tasks."
    }
];

// Cart state
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCountElement = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const closeCartBtn = document.getElementById('closeCart');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.querySelector('.search-input');
const contactForm = document.getElementById('contactForm');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    
    // Make home section visible immediately
    document.getElementById('home').classList.add('visible');
    
    // Trigger scroll event to set initial active state
    setTimeout(() => {
        handleScroll();
    }, 100);
});

// Load products into the grid
function loadProducts() {
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
        
        // Animate product cards with delay
        setTimeout(() => {
            productCard.classList.add('visible');
        }, 200 * index);
    });
}

// Create product card element
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.transitionDelay = `${index * 0.1}s`;
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;

    // Add event listener to the add to cart button
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => addToCart(product));

    return card;
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.title} added to cart!`);
}

// Update cart display
function updateCart() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    cartCountElement.textContent = cartCount;
    cartTotalElement.textContent = cartTotal.toFixed(2);

    updateCartItems();
}

// Update cart items in modal
function updateCartItems() {
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Handle quantity changes
function handleQuantityChange(e) {
    const action = e.target.dataset.action;
    const productId = parseInt(e.target.dataset.id);

    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(e);
            return;
        }
    }

    updateCart();
}

// Remove item from cart
function removeFromCart(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Item removed from cart');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Cart button
    cartBtn.addEventListener('click', toggleCart);

    // Close cart modal
    closeCartBtn.addEventListener('click', closeCart);

    // Close cart when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });

    // Hamburger menu
    hamburger.addEventListener('click', toggleMobileMenu);

    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Contact form
    contactForm.addEventListener('submit', handleContactForm);

    // Enhanced smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                // Calculate the position to scroll to (accounting for fixed header)
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                // Smooth scroll to the target section
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation link
                updateActiveNavLink(targetId);
            }
        });
    });

    // CTA button
    document.querySelector('.cta-btn').addEventListener('click', function() {
        const productsSection = document.getElementById('products');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = productsSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        updateActiveNavLink('products');
    });

    // Scroll to top button
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        updateActiveNavLink('home');
    });

    // Add scroll event listener to update active nav link and show sections
    window.addEventListener('scroll', handleScroll);
}

// Function to update active navigation link based on scroll position
function updateActiveNavLink(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// Function to handle scroll events
function handleScroll() {
    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavLink(sectionId);
        }
        
        // Show section when it comes into view
        if (window.scrollY + window.innerHeight > sectionTop + 100) {
            section.classList.add('visible');
        }
    });
    
    // Show/hide scroll-to-top button
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Toggle cart modal
function toggleCart() {
    cartModal.classList.toggle('active');
    document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : 'auto';
}

// Close cart modal
function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Add smooth scrolling for mobile menu links
    if (navMenu.classList.contains('active')) {
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu
                    toggleMobileMenu();
                    
                    // Smooth scroll to the target section
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    setTimeout(() => {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        updateActiveNavLink(targetId);
                    }, 300); // Small delay to allow menu to close
                }
            });
        });
    }
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.length === 0) {
        loadProducts();
        return;
    }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-results">No products found matching your search.</p>';
        return;
    }

    filteredProducts.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
        
        // Animate product cards with delay
        setTimeout(() => {
            productCard.classList.add('visible');
        }, 200 * index);
    });
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
    const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
    const message = formData.get('message') || contactForm.querySelector('textarea').value;

    // Simulate form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.');

    // Reset form
    contactForm.reset();
}