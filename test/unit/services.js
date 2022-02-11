const sinon = require('sinon');
const { expect } = require('chai');

const modelProduct = require('../../models/products');
const modelSales = require('../../models/sales');

const serviceProd = require('../../services/products');
const serviceSales = require('../../services/sales');
const { response } = require('express');

describe('Tetando autenticações do Produto', () => {
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
});