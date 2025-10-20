var UI = {
    renderProducts: function(products) {
        var container = document.getElementById('products-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            var productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = 
                '<h3>' + product.name + '</h3>' +
                '<div class="price">' + product.price + ' ₽</div>' +
                '<button class="add-btn" onclick="event.stopPropagation(); App.selectProduct(' + product.id + ')">➕ Добавить</button>';
            productElement.onclick = (function(id) {
                return function() {
                    App.selectProduct(id);
                };
            })(product.id);
            container.appendChild(productElement);
        }
    },
    
    renderCart: function() {
        var container = document.getElementById('cart-container');
        var totalElement = document.getElementById('cart-total');
        
        if (!container || !totalElement) return;
        
        if (Cart.items.length === 0) {
            container.innerHTML = '<p>🛒 Корзина пуста</p>';
            totalElement.textContent = '💰 Итого: 0 ₽';
            return;
        }
        
        container.innerHTML = '';
        var total = Cart.getTotal();
        
        for (var i = 0; i < Cart.items.length; i++) {
            var item = Cart.items[i];
            var itemTotal = item.price * item.quantity;
            
            var itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            var nameSpan = document.createElement('span');
            nameSpan.textContent = item.name;
            
            var priceSpan = document.createElement('span');
            priceSpan.textContent = item.price + ' ₽';
            
            var quantityControls = document.createElement('div');
            quantityControls.className = 'quantity-controls';
            
            var minusBtn = document.createElement('button');
            minusBtn.className = 'quantity-btn';
            minusBtn.textContent = '➖';
            minusBtn.onclick = (function(name, qty) {
                return function() {
                    App.updateQuantity(name, qty - 1);
                };
            })(item.name, item.quantity);
            
            var quantitySpan = document.createElement('span');
            quantitySpan.className = 'quantity-display';
            quantitySpan.textContent = item.quantity;
            quantitySpan.style.minWidth = '20px';
            
            var plusBtn = document.createElement('button');
            plusBtn.className = 'quantity-btn';
            plusBtn.textContent = '➕';
            plusBtn.onclick = (function(name, qty) {
                return function() {
                    App.updateQuantity(name, qty + 1);
                };
            })(item.name, item.quantity);
            
            quantityControls.appendChild(minusBtn);
            quantityControls.appendChild(quantitySpan);
            quantityControls.appendChild(plusBtn);
            
            var totalSpan = document.createElement('span');
            totalSpan.textContent = itemTotal.toFixed(2) + ' ₽';
            
            var removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '❌';
            removeBtn.onclick = (function(name) {
                return function() {
                    App.removeFromCart(name);
                };
            })(item.name);
            
            itemElement.appendChild(nameSpan);
            itemElement.appendChild(priceSpan);
            itemElement.appendChild(quantityControls);
            itemElement.appendChild(totalSpan);
            itemElement.appendChild(removeBtn);
            
            container.appendChild(itemElement);
        }
        
        totalElement.textContent = '💰 Итого: ' + total.toFixed(2) + ' ₽';
    },
    
    renderOrderHistory: function(orders) {
        var container = document.getElementById('order-history-container');
        if (!container) return;
        
        if (orders.length === 0) {
            container.innerHTML = '<p>📭 Нет заказов</p>';
            return;
        }
        
        container.innerHTML = '';
        
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            
            var orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            
            var headerDiv = document.createElement('div');
            headerDiv.className = 'order-item-header';
            
            var infoDiv = document.createElement('div');
            infoDiv.innerHTML = 
                '<strong><span class="emoji">📋</span> Заказ №' + (i + 1) + '</strong><br><span class="order-total"><span class="emoji">💰</span> ' + order.total.toFixed(2) + ' ₽</span>';
            
            var removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<span class="emoji">❌</span>Удалить';
            removeBtn.onclick = (function(index) {
                return function() {
                    App.removeOrder(index);
                };
            })(i);
            
            headerDiv.appendChild(infoDiv);
            headerDiv.appendChild(removeBtn);
            
            var itemsList = document.createElement('ul');
            for (var j = 0; j < order.items.length; j++) {
                var item = order.items[j];
                var itemTotal = item.price * item.quantity;
                
                var listItem = document.createElement('li');
                
                var productSpan = document.createElement('span');
                productSpan.className = 'order-item-product';
                if (item.name.indexOf('🌯') !== -1 || item.name.indexOf('🌭') !== -1 || 
                    item.name.indexOf('🥤') !== -1 || item.name.indexOf('☕') !== -1 ||
                    item.name.indexOf('➕') !== -1) {
                    productSpan.innerHTML = item.name;

                    productSpan.textContent = item.name;
                }
                
                var quantitySpan = document.createElement('span');
                quantitySpan.className = 'order-item-quantity';
                quantitySpan.textContent = 'x' + item.quantity;
                
                var priceSpan = document.createElement('span');
                priceSpan.className = 'order-item-price';
                priceSpan.textContent = itemTotal.toFixed(2) + ' ₽';
                
                listItem.appendChild(productSpan);
                listItem.appendChild(quantitySpan);
                listItem.appendChild(priceSpan);
                itemsList.appendChild(listItem);
            }
            
            var timestampSmall = document.createElement('small');
            timestampSmall.innerHTML = '<span class="emoji">🕐</span> ' + (order.timestamp || 'Дата не указана');
            
            orderElement.appendChild(headerDiv);
            orderElement.appendChild(itemsList);
            orderElement.appendChild(timestampSmall);
            
            container.appendChild(orderElement);
        }
    },
    
    showToppingsModal: function(toppings, product) {
        var existingModal = document.getElementById('toppings-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        var modal = document.createElement('div');
        modal.id = 'toppings-modal';
        
        var modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        var title = document.createElement('h2');
        title.textContent = 'Выберите топпинги для ' + product.name.replace(/🌯|🌭/g, '').trim();
        
        var toppingsGrid = document.createElement('div');
        toppingsGrid.className = 'toppings-grid';
        
        for (var i = 0; i < toppings.length; i++) {
            var topping = toppings[i];
            var toppingElement = document.createElement('div');
            toppingElement.className = 'topping-card';
            toppingElement.innerHTML = 
                '<h4>' + topping.name + '</h4>' +
                '<div>' + topping.price + ' ₽</div>';
            
            (function(toppingId) {
                toppingElement.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    App.toggleTopping(toppingId);
                    this.classList.toggle('selected');
                });
            })(topping.id);
            
            toppingElement.setAttribute('data-topping-id', topping.id);
            toppingsGrid.appendChild(toppingElement);
        }
        
        var buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'modal-buttons';
        
        var addButton = document.createElement('button');
        addButton.className = 'checkout-btn';
        addButton.textContent = 'Добавить в заказ';
        addButton.style.flex = '1';
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            App.addProductWithToppings();
        });
        
        var cancelButton = document.createElement('button');
        cancelButton.className = 'clear-btn';
        cancelButton.textContent = 'Отмена';
        cancelButton.style.flex = '1';
        cancelButton.addEventListener('click', function(e) {
            e.preventDefault();
            UI.hideToppingsModal();
        });
        
        buttonsDiv.appendChild(addButton);
        buttonsDiv.appendChild(cancelButton);
        
        modalContent.appendChild(title);
        modalContent.appendChild(toppingsGrid);
        modalContent.appendChild(buttonsDiv);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    },
    
    hideToppingsModal: function() {
        var modal = document.getElementById('toppings-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(function() {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        }
    },
    
    updateToppingsSelection: function(selectedToppings) {
    }
};
