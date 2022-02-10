const connection = require('./connection');

const getAllProduct = async () => {
  const [products] = await connection.execute(
    'SELECT * FROM StoreManager.products',
  );

  return products;
};

const getProduct = async (id) => {
  const [products] = await connection.execute(
    'SELECT * FROM StoreManager.products WHERE id = ?', [id],
  );

  return products;
};

const findName = async (productName) => {
    const [products] = await connection.execute(
      'SELECT * FROM StoreManager.products WHERE name = ?', [productName],
    );
    return products;
};

const updateProduct = (id, { name, quantity }) => connection.execute(
    'UPDATE StoreManager.products SET name = ?, quantity = ? WHERE id = ?',
    [name, quantity, id],
  ).then(() => true);

const saveProduct = async (name, quantity) => {
  const [result] = await connection.execute(
    'INSERT INTO StoreManager.products (name, quantity) VALUES (?,?)',
    [name, quantity], 
  );
  return {
    id: result.insertId,
  };
};

const deleteProduct = (id) => connection.execute(
    'DELETE FROM StoreManager.products WHERE id = ?', [id],
  ).then(() => true);

module.exports = {
  getAllProduct,
  getProduct,
  findName,
  updateProduct,
  saveProduct,
  deleteProduct,
};
