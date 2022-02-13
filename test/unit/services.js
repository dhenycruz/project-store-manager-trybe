const sinon = require('sinon');
const { expect } = require('chai');

const modelProduct = require('../../models/products');
const modelSales = require('../../models/sales');

const serviceProd = require('../../services/products');
const serviceSales = require('../../services/sales');

describe('Tetando a camada de Service do Products', () => {
  describe('Testando o nome do Produto', () => {
    it('Se o nome do produto estiver correto, retorna true', () => {
      const name = 'Produto';
      const response = serviceProd.authName(name);
      expect(response).to.be.true;
    });
    it('Se o nome estiver vazio, retorna um objeto com detalhes do erro', () => {
      const name = '';
      const response = serviceProd.authName(name);
      expect(response).to.be.a('object');
      expect(response).to.eql({ validate: false, message: '"name" is required', status: 400 });
    });
    it('Se o nome for undefined retorna um objecto com detalhes do erro', () => {
      const response = serviceProd.authName();
      expect(response).to.be.a('object');
      expect(response).to.eql({ validate: false, message: '"name" is required', status: 400 });
    });
    it('Se o nome conter menos de 5 caracteres deverá retornar um objecto com detalhes do erro', () => {
      const name = 'prod';
      const response = serviceProd.authName(name);
      expect(name).to.have.lengthOf.at.most(5); 
      expect(response).to.eql({
        validate: false,
        message: '"name" length must be at least 5 characters long',
        status: 422,
      });
    });
  });
  describe('Testando a quantidade do Produto', () => {
    it('Se a quantidade do produto estiver correto, retorna true', () => {
      const quantity = 5;
      const response = serviceProd.authQuantity(quantity);
      expect(response).to.be.true;
    });
    it('Se a quantidade estiver vazio, retorna um objeto com detalhes do erro', () => {
      const quantity = '';
      const response = serviceProd.authQuantity(quantity);
      expect(response).to.be.a('object');
      expect(response).to.eql({ validate: false, message: '"quantity" is required', status: 400 });
    });
    it('Se a quantidade for undefined retorna um objecto com detalhes do erro', () => {
      const response = serviceProd.authQuantity();
      expect(response).to.be.a('object');
      expect(response).to.eql({ validate: false, message: '"quantity" is required', status: 400 });
    });
    it('Se a quantidade for uma string, retorna um objeto com detalhes do erro', () => {
      const quantity = '5';
      const response = serviceProd.authQuantity(quantity);
      expect(response).to.eql({ validate: false, 
        message: '"quantity" must be a number larger than or equal to 1',
        status: 422,
      });
    });
    it('Se quantidade for igual a 0 ou menor que zero, retorna um objeto com detalhes do erro', () => {
      const quantity = 0;
      const response = serviceProd.authQuantity(quantity);
      expect(response).to.eql({ validate: false, 
        message: '"quantity" must be a number larger than or equal to 1',
        status: 422,
      });
    });
  });
  describe('Testando se o produto existe', () => {
    describe('Se o produto existir', () => {
      before(() => {
        const resolves = [{  validate: false, message: 'Product already exists', status: 409 }];
        sinon.stub(modelProduct, 'findName').resolves(resolves);
      });
      after(() => {
        modelProduct.findName.restore();
      });
      it('Retorna um objeto com detalhes do erro', async () => {
        const name = 'Produto';
        const response = await serviceProd.alreadyExistsProd(name);
        expect(response).to.eql({  validate: false, message: 'Product already exists', status: 409 });
      });
    });
    describe('Se o produto não existir', () => {
      before(() => {
        sinon.stub(modelProduct, 'findName').resolves([]);
      });
      after(() => {
        modelProduct.findName.restore();
      });
      it('Retorna true', async () => {
        const name = 'Produto';
        const response = await serviceProd.alreadyExistsProd(name);
        expect(response).to.be.true;
      });
    });
  });
  describe('Testando se retorna todos os produtos', () => {
    describe('Se existir uma ou mais produtos', () => {
      before(() => {
        const result = [
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
        ];
        sinon.stub(modelProduct, 'getAllProduct').resolves(result);
      });
      after(() => {
        modelProduct.getAllProduct.restore();
      });
      it('Retorna um array com objeto para cada produto', async () => {
        const response = await serviceProd.getAllProduct();
        expect(response).to.be.a('array');
        expect(response).to.be.a('array').that.is.not.be.empty;
        expect(response).to.eql([
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
        ]);
      });
    });
    describe('Se não existir nenhgum produto', () => {
      before(() => {
        const result = [];
        sinon.stub(modelProduct, 'getAllProduct').resolves(result);
      });
      after(() => {
        modelProduct.getAllProduct.restore();
      });
      it('Retorna um array com objeto para cada produto', async () => {
        const response = await serviceProd.getAllProduct();
        expect(response).to.be.a('array');
        expect(response).to.be.a('array').that.is.be.empty;
      });
    });
  });
  describe('Testando se retorna um produto específico', () => {
   describe('Se encontrar o produto', () => {
    const result = [{
      id: 1,
      name: 'produto',
      quantity: 5,
    }];
      before(() => {
        sinon.stub(modelProduct, 'getProduct').resolves(result);
      });
      after(() => {
        modelProduct.getProduct.restore();
      });
      it('Retorna um objeto com propriedade do produto', async () => {
        const id = 1;
        const response = await serviceProd.getProduct(id);
        expect(response).to.be.a('object');
        expect(response).to.eql({ id: 1, name: 'produto', quantity: 5 });
      });
    });
    describe('Se não encontrar o produto', () => {
      const result = [];
      before(() => {
        sinon.stub(modelProduct, 'getProduct').resolves(result);
      });
      after(() => { modelProduct.getProduct.restore(); });
      it('Retorna false', async () => {
        const id = 1;
        const response = await serviceProd.getProduct(id);
        expect(response).to.be.false;
      });
    });
  });
  describe('Testando atualizando um produto', () => {
    describe('Se o produto for atualizado com sucesso', () => {
      const id = 1;
      const products = [
        {
          "product_id": 1,
          "quantity": 6
        }
      ];
      before(() => {
        sinon.stub(modelProduct, 'updateProduct').resolves(true);
      });
      after(() => { modelProduct.updateProduct.restore(); });
      it('retorna true', async () => {
        const response = await serviceProd.updateProduct(id, products);
        expect(response).to.be.true;
      });
    });
  });
  describe('Testando salvando um produto', () => {
    describe('Se o produto for criado com sucesso', () => {
      const product = { name: 'produto', quantity: 10 };
      before(() => {
        const result = { id: 1};
        sinon.stub(modelProduct, 'saveProduct').resolves(result);
      });
      after(() => { modelProduct.saveProduct.restore(); });
      it('Retorna um objeto com o id do produto criado', async () => {
        const response = await serviceProd.saveProduct(product.name, product.quantity);
        expect(response).to.be.a('object');
        expect(response).to.eql({ validate: true, result: { id: 1, name: 'produto', quantity: 10 } });
      });
    });
  });
  describe('Testando deletando Produto', () => {
    describe('Se um produto é deletado com sucesso', () => {
      const id = 1;
      const product = [{ id: 1, name: "produto A", quantity: 10 }];
      before(() => {
        sinon.stub(modelProduct, 'getProduct').resolves(product);
        sinon.stub(modelProduct, 'deleteProduct').resolves([true]);
      });
      after(() => {
        modelProduct.deleteProduct.restore();
        modelProduct.getProduct.restore();
      });
      it('Retorna um objeto com detalhes do produto deletado', async () => {
        const response = await serviceProd.deleteProduct(id);
        expect(response).to.be.a('object');
        expect(response).to.eql({
          id: 1,
          name: "produto A",
          quantity: 10
        });
      });
    });
  });
});
describe('Testando a camada de Service de Sales', () => {
  describe('Testando autenticação de Produto - function autProduct', () => {
    const authFail = { validate: false,
      message: '"product_id" is required',
      status: 400,
    };
    describe('Se algum product_id do array for vazio, undefined ou null', () => {
      const products = [
        {
          "id": 1,
          "name": "produto A",
          "quantity": 10
        },
        {
          "id": 2,
          "name": "produto B",
          "quantity": 20
        }
      ];
      const data =  [
        {
          "quantity": 1
        }
      ];
      before(() => {
        sinon.stub(modelProduct, 'getAllProduct').resolves(products);
      });
      after(() => {
        modelProduct.getAllProduct.restore();
      });
      it('Retorna um objeto com detalhes do erro', async () => {
        const response = await serviceSales.authProduct(data);
        expect(response).to.be.a('object');
        expect(response).to.eql(authFail);
      });
    });
    describe('Se o produto não existir', () => {
      const products = [
        {
          "id": 1,
          "name": "produto A",
          "quantity": 10
        },
        {
          "id": 2,
          "name": "produto B",
          "quantity": 20
        }
      ];
      const data =  [
        {
          "product_id": 3,
          "quantity": 1
        }
      ];
      before(() => {
        sinon.stub(modelProduct, 'getAllProduct').resolves(products);
      });
      after(() => { modelProduct.getAllProduct.restore(); });
      it('Retorna um objeto com detalhes do erro', async () => {
        const  response = await serviceSales.authProduct(data);
        expect(response).to.be.a('object');
        expect(response).to.eql(authFail);
      });
    });
    describe('Se a autenticação de produto estiver tudo certo', () => {
      const products = [
        {
          "id": 1,
          "name": "produto A",
          "quantity": 10
        },
        {
          "id": 2,
          "name": "produto B",
          "quantity": 20
        }
      ];
      const data =  [
        {
          "product_id": 1,
          "quantity": 1
        }
      ];
      before(() => {
        sinon.stub(modelProduct, 'getAllProduct').resolves(products);
      });
      after(() => {
        modelProduct.getAllProduct.restore();
      });
      it('retorna true', async () => {
        const response = await serviceSales.authProduct(data);
        expect(response).to.be.true;
      });
    });
  });
  describe('Testando autenticação de Quantidade- function authQuantity', () => {
    describe('Se a quantidade for vazia ou undefined', () => {
      const data = [{ "product_id": 1, "quantity": '' }];
      it('Retorna um objeto com detalhes do erro', () => {
        const response = serviceSales.authQuantity(data);
        expect(response).to.be.a('object');
        expect(response).to.eql({ validate: false, message: '"quantity" is required', status: 400 });
      });
    });
    describe('Se a quantidade for do tipo string', () => {
      const data = [
        { "product_id": 1, "quantity": 5 },
        { "product_id": 2, "quantity": '4'}
      ];
      it('Retorna um objeto com detalhes do erro', () => {
        const response = serviceSales.authQuantity(data);
        expect(response).to.be.a('object');
        expect(response).to.eql({
          validate: false,
          message: '"quantity" must be a number larger than or equal to 1',
          status: 422,
        });
      });
      describe('Se a quantidade for menor ou igual a 0', () => {
        const data = [
          { "product_id": 1, "quantity": 5 },
          { "product_id": 2, "quantity": -1 }
        ];
        it('Retorna um objeto com detalhes do erro', () => {
          const response = serviceSales.authQuantity(data);
          expect(response).to.be.a('object');
          expect(response).to.eql({
            validate: false,
            message: '"quantity" must be a number larger than or equal to 1',
            status: 422,
          })
        });
      });
      describe('Se a quantidade estiver correta', () => {
        const data = [
          { "product_id": 1,"quantity": 5 },
        ];
        it('Retorna true', () => {
          const response = serviceSales.authQuantity(data);
          expect(response).to.be.true;
        })
      });
    });
  });
});
