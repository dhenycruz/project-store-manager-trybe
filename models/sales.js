const connection = require('./connection');

const getAllSales = async () => {
  const [sales] = await connection.execute(
    'SELECT * FROM StoreManager.sales',
  );

  return sales;
};

const createSale = async (data) => {
  const [row] = await connection.execute(
    'INSERT INTO StoreManager.sales () values ()',
  );
  const saleId = row.insertId;
  data.forEach((products) => {
    connection.execute(
      'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?,?,?)',
      [saleId, products.product_id, products.quantity],
    );
  });
  return {
    id: saleId,
    itemsSold: data,
  };
};

module.exports = {
  getAllSales,
  createSale,
};
