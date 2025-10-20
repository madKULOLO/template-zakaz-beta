var App = {
    products: [],
    orders: [],
    selectedProduct: null,
    selectedToppings: [],
    
    init: function() {
        Cart.init();
        this.products = ProductData.getProducts();
        this.orders = ProductData.getOrderHistory();
        UI.renderProducts(this.products);
        UI.renderCart();
        UI.renderOrderHistory(this.orders);
        this.bindEvents();
        this.initTabs();
    },
    
    initTabs: function() {
        var tabBtns = document.querySelectorAll('.tab-btn');
        var tabContents = document.querySelectorAll('.tab-content');
        
        for (var i = 0; i < tabBtns.length; i++) {
            tabBtns[i].addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var tabName = this.getAttribute('data-tab');
                
                for (var j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].classList.remove('active');
                }
                
                for (var k = 0; k < tabContents.length; k++) {
                    tabContents[k].classList.remove('active');
                }
                
                this.classList.add('active');
                document.getElementById(tabName + '-tab').classList.add('active');
            });
        }
    },
    
    bindEvents: function() {
        var clearBtn = document.getElementById('clear-btn');
        var checkoutBtn = document.getElementById('checkout-btn');
        var clearHistoryBtn = document.getElementById('clear-history-btn');
        
        if (clearBtn) {
            clearBtn.addEventListener('click', function(e) {
                e.preventDefault();
                App.clearCart();
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                App.checkout();
            });
        }
        
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', function(e) {
                e.preventDefault();
                App.clearOrderHistory();
            });
        }
    },
    
    selectProduct: function(productId) {
        this.selectedProduct = this.products.find(function(p) { return p.id === productId; });
        
        if (this.selectedProduct && 
            (this.selectedProduct.category.indexOf('Шаурма') !== -1 || 
             this.selectedProduct.category.indexOf('Сосиска') !== -1)) {
            UI.showToppingsModal(ProductData.getToppings(), this.selectedProduct);
        } else {
            this.addToCart(productId);
        }
    },
    
    addToCart: function(productId) {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].id === productId) {
                Cart.addItem(this.products[i]);
                UI.renderCart();
                this.animateAddToCart();
                return;
            }
        }
    },
    
    animateAddToCart: function() {
        var cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.style.transform = 'scale(1.1)';
            cartTotal.style.transition = 'transform 0.3s ease';
            setTimeout(function() {
                cartTotal.style.transform = 'scale(1)';
            }, 300);
        }
    },
    
    addProductWithToppings: function() {
        if (!this.selectedProduct) return;
        
        var productCopy = {
            id: this.selectedProduct.id,
            name: this.selectedProduct.name,
            price: this.selectedProduct.price,
            quantity: 1
        };
        
        if (this.selectedToppings.length > 0) {
            var toppingNames = this.selectedToppings.map(function(t) { 
                return t.name.replace(/🌶️|🧀|➕/g, '').trim(); 
            });
            productCopy.name += ' + ' + toppingNames.join(', ');
            
            var toppingsPrice = this.selectedToppings.reduce(function(sum, t) { 
                return sum + t.price; 
            }, 0);
            productCopy.price += toppingsPrice;
        }
        
        Cart.addItem(productCopy);
        UI.renderCart();
        this.animateAddToCart();
        UI.hideToppingsModal();
        this.selectedProduct = null;
        this.selectedToppings = [];
    },
    
    toggleTopping: function(toppingId) {
        var topping = ProductData.getToppings().find(function(t) { return t.id === toppingId; });
        if (!topping) return;
        
        var index = this.selectedToppings.findIndex(function(t) { return t.id === toppingId; });
        if (index !== -1) {
            this.selectedToppings.splice(index, 1);
        } else {
            this.selectedToppings.push(topping);
        }
    },
    
    updateQuantity: function(itemName, quantity) {
        Cart.updateQuantity(itemName, quantity);
        UI.renderCart();
    },
    
    removeFromCart: function(itemName) {
        Cart.removeItem(itemName);
        UI.renderCart();
    },
    
    clearCart: function() {
        if (Cart.items.length === 0) return;
        
        if (confirm('🗑️ Вы уверены, что хотите очистить корзину?')) {
            Cart.clear();
            UI.renderCart();
        }
    },
    
    checkout: function() {
        if (Cart.items.length === 0) {
            alert('🛒 Корзина пуста!');
            return;
        }
        
        var total = Cart.getTotal();
        var newOrder = {
            id: Date.now(),
            items: [],
            total: total,
            timestamp: ProductData.formatDateTime(new Date())
        };
        
        for (var i = 0; i < Cart.items.length; i++) {
            newOrder.items.push({
                id: Cart.items[i].id,
                name: Cart.items[i].name,
                price: Cart.items[i].price,
                quantity: Cart.items[i].quantity
            });
        }
        
        this.orders.push(newOrder);
        ProductData.saveOrderHistory(this.orders);
        
        Cart.clear();
        UI.renderCart();
        UI.renderOrderHistory(this.orders);
        
        alert('✅ Заказ оформлен!\n💰 Сумма: ' + total.toFixed(2) + ' ₽');
        
        document.querySelector('.tab-btn[data-tab="history"]').click();
    },
    
    removeOrder: function(orderIndex) {
        if (confirm('🗑️ Вы уверены, что хотите удалить этот заказ?')) {
            this.orders.splice(orderIndex, 1);
            ProductData.saveOrderHistory(this.orders);
            UI.renderOrderHistory(this.orders);
        }
    },
    
    clearOrderHistory: function() {
        if (this.orders.length === 0) return;
        
        if (confirm('🗑️ Вы уверены, что хотите очистить всю историю заказов?')) {
            this.orders = [];
            ProductData.saveOrderHistory(this.orders);
            UI.renderOrderHistory(this.orders);
        }
    }
};

if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function() {
        App.init();
    });
} else {
    document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') {
            App.init();
        }
    });
}