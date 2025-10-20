var Cart = {
    items: [],
    
    init: function() {
        var stored = localStorage.getItem('pos-cart');
        if (stored) {
            try {
                this.items = JSON.parse(stored);
            } catch (e) {
                console.error('Ошибка при парсинге корзины из localStorage', e);
                this.items = [];
            }
        } else {
            this.items = [];
        }
    },
    
    save: function() {
        try {
            localStorage.setItem('pos-cart', JSON.stringify(this.items));
        } catch (e) {
            console.error('Ошибка при сохранении корзины в localStorage', e);
        }
    },
    
    addItem: function(product) {
        var existingItem = this.items.find(function(item) { 
            return item.name === product.name;
        });
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                quantity: 1 
            });
        }
        this.save();
    },
    
    updateQuantity: function(itemId, quantity) {
        if (quantity <= 0) {
            this.removeItem(itemId);
            return;
        }
        
        var item = this.items.find(function(item) { 
            return item.id === itemId || item.name === itemId; 
        });
        
        if (item) {
            item.quantity = quantity;
            this.save();
        }
    },
    
    removeItem: function(itemId) {
        var item = this.items.find(function(item) { 
            return item.id === itemId || item.name === itemId; 
        });
        
        if (item) {
            this.items = this.items.filter(function(i) { 
                return i.name !== item.name; 
            });
            this.save();
        }
    },
    
    clear: function() {
        this.items = [];
        this.save();
    },
    
    getTotal: function() {
        var total = 0;
        for (var i = 0; i < this.items.length; i++) {
            total += this.items[i].price * this.items[i].quantity;
        }
        return total;
    },
    
    getItemCount: function() {
        var count = 0;
        for (var i = 0; i < this.items.length; i++) {
            count += this.items[i].quantity;
        }
        return count;
    }
};