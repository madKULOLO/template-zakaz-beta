const ProductData = {
    parseProductsFromText: function(text) {
        var lines = text.trim().split('\n');
        var products = [];
        
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line) continue;
            
            var columns = line.split('\t');
            if (columns.length >= 8) {
                var product = {
                    id: parseInt(columns[0]) || (i + 1000),
                    category: columns[1] || 'Без категории',
                    name: columns[2] || 'Без названия',
                    description: columns[3] || '',
                    shortDescription: columns[4] || '',
                    photo: columns[5] || '',
                    link: columns[6] || '',
                    price: parseFloat(columns[7]) || 0,
                    quantity: parseInt(columns[8]) || 1,
                    unit: columns[9] || 'ШТУКА',
                    popular: columns[10] === 'да',
                    available: columns[11] === 'да'
                };
                
                if (product.category.indexOf('напитки') !== -1) {
                    product.name = '🥤 ' + product.name;
                } else if (product.category.indexOf('Добавки') !== -1) {
                    product.name = '➕ ' + product.name;
                } else if (product.category.indexOf('Сосиска') !== -1) {
                    product.name = '🌭 ' + product.name;
                } else if (product.category.indexOf('Шаурма') !== -1) {
                    product.name = '🌯 ' + product.name;
                }
                
                products.push(product);
            }
        }
        
        return products;
    },
    
    getProducts: function() {
        var stored = localStorage.getItem('pos-products');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Ошибка при парсинге товаров из localStorage', e);
            }
        }
        
        var products = [
            { id: 10, category: 'Шаурма', name: '🌯 🐷 Шаурма со свининой', price: 350, available: true },
            { id: 12, category: 'Шаурма', name: '🌯 🐔 Шаурма с курицей', price: 300, available: true },
            { id: 11, category: 'Шаурма', name: '🌯 🌿 Шаурма вегетарианская', price: 300, available: true },
            { id: 9, category: 'Сосиска в лаваше', name: '🌭 Сосиска в лаваше', price: 200, available: true },
            { id: 1, category: 'напитки', name: '🥤 Чай домашний с облепихой', price: 100, available: true },
            { id: 2, category: 'напитки', name: '🥤 Чай домашний с малиной', price: 100, available: true },
            { id: 3, category: 'напитки', name: '🥤 Чай', price: 50, available: true },
            { id: 4, category: 'напитки', name: '☕ Кофе', price: 50, available: true }
        ];
        
        return products;
    },
    
    getToppings: function() {
        return [
            { id: 5, category: 'Добавки', name: '🌶️ Табаско', price: 30, available: true },
            { id: 6, category: 'Добавки', name: '🌶️ Халапеньо', price: 30, available: true },
            { id: 7, category: 'Добавки', name: '🌶️ Чили', price: 30, available: true },
            { id: 8, category: 'Добавки', name: '🧀 Сыр', price: 50, available: true }
        ];
    },
    
    formatDateTime: function(date) {
        if (!date) return '';
        
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        var day = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var year = date.getFullYear();
        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        var seconds = String(date.getSeconds()).padStart(2, '0');
        
        return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    },
    
    saveProducts: function(products) {
        try {
            localStorage.setItem('pos-products', JSON.stringify(products));
        } catch (e) {
            console.error('Ошибка при сохранении товаров в localStorage', e);
        }
    },
    
    getOrderHistory: function() {
        var stored = localStorage.getItem('pos-orders');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Ошибка при парсинге истории заказов из localStorage', e);
            }
        }
        return [];
    },
    
    saveOrderHistory: function(orders) {
        try {
            localStorage.setItem('pos-orders', JSON.stringify(orders));
        } catch (e) {
            console.error('Ошибка при сохранении истории заказов в localStorage', e);
        }
    }
};