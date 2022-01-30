const conection = require('./conection');

const getAllProduct = async () => {
  const [products] = await conection.execute(
    'SELECT * FROM StoreManager.products',
  );

  return products;
};

const getProduct = async (id) => {
  const [products] = await conection.execute(
    'SELECT * FROM StoreManager.products WHERE id = ?', [id],
  );

  return products;
};

const findName = async (productName) => {
    const [products] = await conection.execute(
      'SELECT * FROM StoreManager.products WHERE name = ?', [productName],
    );
    return products;
};

const updateProduct = (id, { name, quantity }) => {
  conection.execute(
    'UPDATE StoreManager.products SET name = ?, quantity = ? WHERE id = ?',
    [name, quantity, id],
  );
};

const saveProduct = async (name, quantity) => {
  const result = await conection.execute(
    'INSERT INTO StoreManager.products (name, quantity) VALUES (?,?)',
    [name, quantity], 
  );
  return result;
};

module.exports = {
  getAllProduct,
  getProduct,
  findName,
  updateProduct,
  saveProduct,
};
