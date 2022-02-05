const connection = require('./connection');

const getAllSales = async () => {
  const [sales] = await connection.execute(
    `SELECT sp.sale_id as saleId, s.date, sp.product_id, sp.quantity 
    FROM StoreManager.sales s INNER JOIN StoreManager.sales_products sp ON s.id = sp.sale_id`,
  );

  return sales;
};

const getSale = async (id) => {
  const [sales] = await connection.execute(
    `SELECT s.date, sp.product_id, sp.quantity 
    FROM StoreManager.sales as s INNER JOIN StoreManager.sales_products as sp
    ON s.id = sp.sale_id WHERE sp.sale_id = ?`,
    [id],
  );
  return sales;
};

const createSale = async (data) => {
  const [row] = await connection.execute(
    'INSERT INTO StoreManager.sales () values ()',
  );
  const saleId = row.insertId;
  await Promise.all(data.map(async (products) => {
    const saveProduct = await connection.execute(
      'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?,?,?)',
      [saleId, products.product_id, products.quantity],
    );
    return saveProduct;
  }));
  
  return {
    id: saleId,
    itemsSold: data,
  };
};

module.exports = {
  getAllSales,
  getSale,
  createSale,
};
