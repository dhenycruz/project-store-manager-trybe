const sinon = require('sinon');
const { expect } = require('chai');
const connection = require('../../models/connection');
const modelProduct = require('../../models/products');
const modelSales = require('../../models/sales');

// Testando a camada model de protudo. 
describe('Testando a camada model de Product:', () => {
  describe('Inserindo um novo produto - function saveProduct();', () => {
    const product = {
      name: 'produto',
      quantity: 5,
    };
  
    before(async () => {
      const execute =[{ insertId: 1 }];
      sinon.stub(connection, 'execute').resolves(execute);
    });
    after(async () => {
      connection.execute.restore();
    });
    describe('Quando é inserido com sucesso:', () => {
      it('retorna um id.', async () => {
        const response = await modelProduct.saveProduct(product.name, product.quantity);
        expect(response).to.be.a.property('id');
      });
    });
  });
  describe('Retornando todos os produtos - function getAllProducts', () => {
      describe('Quando existe um ou mais produtos:', () => {
      before(async () => {
        const execute = [[
          {
            id: 1,
            name: 'produto',
            quantity: 5,
          },
          {
            id: 2,
            name: 'produto2',
            quantity: 5,
          }
        ]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array de produtos.', async () => {
        const response = await modelProduct.getAllProduct();
        expect(response).to.be.a('array');
        expect(response).to.be.a('array').that.is.not.be.empty;
      });
    });
    describe('Quando não existe nenhum produto no banco de dados', () => {
      before(async () => {
        const execute = [[]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array vazio.', async () => {
        const response = await modelProduct.getAllProduct();
        expect(response).to.be.a('array');
        expect(response).to.be.a('array').that.is.be.empty;
      });
    });
  });
  describe('Retornando um produto específico - function getProduct', () => {
    describe('Quando um produto é encontrado:', () => {
      before(async () => {
        const execute = [[{
          id: 1,
          name: 'produto',
          quantity: 5,
        }]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      const id = 1;
      it('Retorna um array com length igual a 1.', async () => {
        const response = await modelProduct.getProduct(id);
        expect(response).to.be.a('array').that.to.have.lengthOf(1);
  
      });
    });
    describe('Quando o produto não é encontrado:', () => {
      before(async () => {
        const execute = [[]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      const id = 15;
      it('Retorna um array vazio', async () => {
        const response = await modelProduct.getProduct(id);
        expect(response).to.be.a('array').that.is.be.empty;
      });
    });
  });
  describe('Verifica se o produto já exista atráves do seu nome - function findProduct', () => {
    describe('Quando um produto é encontrado:', () => {
      before(async () => {
        const execute = [[{
          id: 1,
          name: 'produto',
          quantity: 5,
        }]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      const name = 'produto';
      it('Retorna um array com length igual a 1.', async () => {
        const response = await modelProduct.findName(name);
        expect(response).to.be.a('array').that.to.have.lengthOf(1);
  
      });
    });
    describe('Quando o produto não é encontrado:', () => {
      before(async () => {
        const execute = [[]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      const name = 'produto';
      it('Retorna um array vazio', async () => {
        const response = await modelProduct.findName(name);
        expect(response).to.be.a('array').that.is.be.empty;
      });
    });
  });
  describe('Atualizando um produto - function updateProduct', () => {
    const id = 1;
    const objProduct = {
      name: 'produto',
      quantity: 4,
    }
    describe('Quando um produto é atualizado com sucesso:', () => {
      before(async () => {
        const execute = [true];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      })
      it('Retorna true', async () => {
        const response = await modelProduct.updateProduct(id, objProduct);
        expect(response).to.be.true;
      });
    });
  });
  describe('Deletando um produto - function deleteProduct', () =>{
    describe('Quando o produto é deletado com sucesso', () => {
      before(async () => {
        const execute = [true];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      it('Retorna true', async () => {
        const response = await modelProduct.deleteProduct(id = 1);
        expect(response).to.be.true;
      });
    });
  });
});

describe('Testando a camada model para Sales', () => {
  describe('Retornando todas as vendas - function getAllSales', () => {
    describe('Quando existe uma ou mais sales', () => {
      before(async () => {
        const execute = [[
          {
            saleId: 1,
            date: "2021-09-09T04:54:29.000Z",
            product_id: 1,
            quantity: 2
          },
          {
            saleId: 1,
            date: "2021-09-09T04:54:54.000Z",
            product_id: 2,
            quantity: 2
          }
        ]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array de objetos', async () => {
        const response =  await modelSales.getAllSales();
        expect(response).to.be.a('array');
        expect(response).to.be.a('array').that.is.not.be.empty;
        expect(response).to.have.deep.members([
          {
            saleId: 1,
            date: "2021-09-09T04:54:29.000Z",
            product_id: 1,
            quantity: 2
          },
          {
          saleId: 1,
          date: "2021-09-09T04:54:54.000Z",
          product_id: 2,
          quantity: 2
        }]);
      });
    });
    describe('Quando não existe uma venda', () => {
      before(async () => {
        const execute = [[]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array vazio', async () => {
       const response = await modelSales.getAllSales();
       expect(response).to.be.a('array');
       expect(response).to.be.a('array').that.is.be.empty;
      });
    });
  });
  describe('Retornando uma venda especifica - function getSale', () => {
    describe('Quando um produto é encontrado', () => {
      before(async () => {
        const execute = [[
          { 
            "date": "2021-09-09T04:54:29.000Z",
            "product_id": 1,
            "quantity": 2
          },
          {
            "date": "2021-09-09T04:54:54.000Z",
            "product_id": 2,
            "quantity": 2
          }
        ]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array com objetos referentes ao produtos daquela venda', async () => {
        const response = await modelSales.getSale(id = 1);
        expect(response).to.be.a('array');
        expect(response).to.be.a('array').that.to.have.lengthOf(2);
      });
    });
    describe('Quando não existe produto', () => {
      before(async () => {
        const execute = [[]];
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array vazio', async () => {
        const response = await modelSales.getSale(id = 1);
        expect(response).to.be.a('array');
        expect(response).to.be.a('array').that.is.be.empty;
      });
    });
  });
  describe('Criando uma nova venda - function createSale', () => {
    describe('Quando é criada uma venda com sucesso', () => {
      const newVenda = [
        {
          "product_id": 1,
          "quantity": 2
        },
        {
          "product_id": 2,
          "quantity": 5
        }
      ];
      const execute = { insertId: 1};
      before(async () => {
        sinon.stub(connection, 'execute').resolves([execute]);
        sinon.stub(Promise, 'all').resolves([{ id, itemSold: newVenda}])
      });
      after(async () => {
        connection.execute.restore();
        Promise.all.restore();
      });    
      it('Retorna um objeto', async () => {
        const response = await modelSales.createSale(newVenda);
        expect(response).to.be.a('object');
        expect(response).to.have.property('id');
        expect(response).to.have.property('itemsSold', newVenda);
      });
    });
  });

  describe('Atualizando uma venda - function updateSale', () => {
    describe('Quando uma venda é atualizada:', () => {
      const execute = true;
      before(async () => {
        sinon.stub(Promise, 'all').resolves(execute);
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(async () => {
        Promise.all.restore();
        connection.execute.restore();
      });
      const id = 1;
      const data = [
        {
          product_id: 1,
          quantity: 6,
        }
    
      ];
      it('Retorna true', async () => {
        const response = await modelSales.updateSale(id, data);
        expect(response).to.be.true;
      });
    });
  });

  describe('Deletando uma venda - function deleteSale', () => {
    describe('Quando uma venda é deletada', () => {
      const execute = true;
      const id = 1;
      before(() => {
        sinon.stub(connection, 'execute').resolves(execute);
      });
      after(() => {
        connection.execute.restore();
      });
      it('Retorna true', async () => {
        const response = await modelSales.deleteSale(id);
        expect(response).to.be.true;
      });
    });
  });
});