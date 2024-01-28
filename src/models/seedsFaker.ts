import { faker } from '@faker-js/faker';
import { categoryModel, brandModel, userModel, sessionModel, productModel, orderModel, addressModel } from '../models/modelsRelations';

const { v4: uuidv4 } = require('uuid');

const generateRandomData = () => {
  const randomCategory = () => ({ name: faker.commerce.productName() });
  const randomBrand = () => ({ name: faker.person.firstName() });
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const randomUser = () => {
    const password = generatePassword();
    
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: password,
      mobile: faker.phone.number()
    };
  };

  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
    let password = '';
  
    while (!passwordPattern.test(password)) {
      password = '';
  
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
      }
    }
  
    return password;
  };

  const randomSession = (userID) => ({
    sessionID: uuidv4(),
    userID,
  });

  const randomProduct = (brandID, categoryID) => ({
    title: faker.commerce.productName(),
    subTitle: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    price: faker.number.float(),
    quantity: faker.number.float(),
    categoryID,
    discount: faker.number.float(),
    arrivalDate: faker.date.future().toISOString().split('T')[0],
    brandID,
  });

  const orderStates = ['completed', 'processing', 'cancel'];
  const randomState = orderStates[Math.floor(Math.random() * orderStates.length)];

  const randomOrder = (userID, addressID, orderID) => ({
    orderID,
    userID,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    mobile: faker.phone.number(),
    addressID,
    state: randomState,
    isPaid: faker.number.binary(),
    date: faker.date.future().toISOString().split('T')[0],
    paymentMethod: faker.finance.transactionType(),
    grandTotal: faker.number.float(),
    displayID: faker.number.int({ min: 1, max: 100 })
  });

  const randomAddress = (addressID, userID) => ({
    addressID,
    userID,
    street: faker.person.firstName(),
    state: faker.person.firstName(),
    city: faker.person.firstName(),
    pinCode: '6757',
  });

  return {
    randomCategory,
    randomBrand,
    randomUser,
    randomSession,
    randomProduct,
    randomOrder,
    randomAddress,
  };
};

export const fillTables = async () => {
  try {
    const {
      randomCategory,
      randomBrand,
      randomUser,
      randomSession,
      randomProduct,
      randomOrder,
      randomAddress,
    } = generateRandomData();

    const insertAndLog = async (model, data, attribute) => {
      for (let i = 0; i < 10; i++) {
        const item = data();
        const addedItem = await model.create(item);
        if (addedItem) {
          const insertedItems = await model.findAll({
            attributes: [attribute],
          });
          console.log(`Inserted ${model.name}s:`, insertedItems.map((item) => item[attribute]).join(', '));
        }
      }
    };

    // Insert Category
    await insertAndLog(categoryModel, randomCategory, 'name');

    // Insert Brand
    await insertAndLog(brandModel, randomBrand, 'name');

    // Insert User
    //await insertAndLog(userModel, randomUser, 'firstName');

    // Insert Session
    await insertAndLog(sessionModel, () => randomSession(faker.number.int({ min: 1, max: 10 })), 'sessionID');

    // Insert Product
    await insertAndLog(
      productModel,
      () => randomProduct(faker.number.int({ min: 1, max: 10 }), faker.number.int({ min: 1, max: 10 })),
      'title'
    );
/*
    // Insert Address
    await insertAndLog(
      addressModel,
      () => randomAddress(faker.number.int({ min: 1, max: 20 }), faker.number.int({ min: 1, max: 10 })),
      'street'
    );
*/
    // Insert Order
    await insertAndLog(
      orderModel,
      () => randomOrder(faker.number.int({ min: 1, max: 10 }), faker.number.int({ min: 1, max: 20 }), faker.number.int({ min: 1, max: 20 })),
      'firstName'
    );

    console.log('Faker inserted data successfully!');
  } catch (error) {
    console.error('Insert faker done, but the validation for relationships may be wrong because', error.message);
  }
};
