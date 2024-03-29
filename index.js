require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const products = require('./controllers/products');
const sales = require('./controllers/sales');

const app = express();

app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});

app.get('/products', products.getAllProduct);

app.post('/products', 
  products.authName, products.authQuantity, products.authAlreadyExists, products.saveProduct);

app.get('/products/:id', products.getProduct);

app.put('/products/:id',
products.authName, products.authQuantity, products.authExistsProduct, products.updateProduct);

app.delete('/products/:id', products.authExistsProduct, products.deleteProduct);

app.get('/sales', sales.getAllSales);

app.get('/sales/:id', sales.getSale);

app.post('/sales', 
sales.authProduct, sales.authQuantity, sales.virifyStockProdut,
sales.updateQuantityProductStock,
sales.createSale);

app.put('/sales/:id', sales.authProduct, sales.authQuantity, sales.updateSale);

app.delete('/sales/:id', sales.deleteSale);