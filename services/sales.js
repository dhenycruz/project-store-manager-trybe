const model = require('../models/sales');
const modelProduct = require('../models/products');

const authProduct = async (dataRequest) => {
  const authFail = { validate: false,
        message: '"product_id" is required',
        status: 400,
  };
  const products = await modelProduct.getAllProduct();
  const authProductBody = dataRequest.some((
    data,
    ) => data.product_id === '' || data.product_id === undefined || data.product_id === null);

  if (authProductBody) return authFail;

  const productsBody = dataRequest.some((data) => {
    const filterProduct = products.filter((el) => data.product_id === el.id);
    if (filterProduct.length < 1) return true;
    return false;
  });

  if (productsBody) return authFail;

  return true;
};

const authQuantity = (dataRequest) => {
  const authQuantityArray = dataRequest.some((
    data,
    ) => data.quantity === '' || data.quantity === undefined);
  if (authQuantityArray) return { validate: false, message: '"quantity" is required', status: 400 };
  
  const authQuantityType = dataRequest.some((
    data,
  ) => typeof data.quantity === 'string' || data.quantity <= 0);
  if (authQuantityType) { 
    return {
      validate: false,
      message: '"quantity" must be a number larger than or equal to 1',
      status: 422,
    };
  }

  return true;
};

const getAllSales = async () => {
  const sales = await model.getAllSales();
  return sales;
};

const getSale = async (id) => {
  const sale = await model.getSale(id);
  if (sale.length < 1) return false;
  return sale;
};

const createSale = async (data) => {
  const sale = await model.createSale(data);
  return sale;
};

const virifyStockProdut = async (arrayProduct) => {
  const productsAll = await modelProduct.getAllProduct();

  const result = arrayProduct.some((data) => {
    const [filterProduct] = productsAll.filter((el) => data.product_id === el.id);
    console.log(filterProduct.quantity, data.quantity);
    if (filterProduct.quantity < data.quantity) return true;
    return false;
  });

  if (result) { 
    return {
      validate: false,
      status: 422,
      message: 'Such amount is not permitted to sell',
    };
  }

  return true;
};

const updateQuantityProductStock = async (arrayProduct, deleteSale = false) => {
  const productsAll = await modelProduct.getAllProduct();
  arrayProduct.forEach(async (product) => {
    const [prodFilter] = productsAll.filter((prod) => prod.id === product.product_id);
    let newQuantity = 0;
    if (deleteSale) {
      newQuantity = prodFilter.quantity + product.quantity;
    } else {
      newQuantity = prodFilter.quantity - product.quantity;
    }
    const objProduct = {
      name: prodFilter.name,
      quantity: newQuantity,
    };
    await modelProduct.updateProduct(product.product_id, objProduct);
  });
  return true;
};

const updateSale = async (id, data) => {
  await model.updateSale(id, data);
  return {
    saleId: id,
    itemUpdated: data,
  };
};

const deleteSale = async (id) => {
  const sale = await model.getSale(id);
  if (sale.length < 1) return false;
  
  await model.deleteSale(id);
  updateQuantityProductStock(sale, true);
  return sale;
};

module.exports = {
  authProduct,
  authQuantity,
  getAllSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  virifyStockProdut,
  updateQuantityProductStock,
};
