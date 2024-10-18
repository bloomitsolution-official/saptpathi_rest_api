import bcrypt from 'bcrypt';
import { Admin, User, UserDetails } from './model/index.js';
import { faker } from '@faker-js/faker';

// Define function to seed default admin
const seedDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne();
    // if (existingAdmin) {
    //   console.log('Default admin already exists. Skipping seeding.');
    //   return;
    // }

    const defaultAdminData = {
      name: 'Sapt Admin',
      email: 'admin@example.com',
      phone: '9087654321',
      password: await bcrypt.hash('adminPassword', 10), // Hash the password
      isDefaultPswd: true,
      isActive: true,
      isVerified: true,
    };

    const defaultAdmin = await Admin.create(defaultAdminData);
    console.log('Default admin seeded successfully:', defaultAdmin);
  } catch (error) {
    console.error('Error seeding default admin:', error);
  }
};

const seedDefaultUsers = async (numUsers = 100) => {
  try {
    const userDetailsData = [];

    for (let i = 0; i < numUsers; i++) {
      const passwordHash = await bcrypt.hash('userPassword', 10);
      const userData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        gender: faker.person.sexType(),
        password: passwordHash,
        isDefaultPswd: true,
        isActive: true,
        isVerified: true,
      };

      const user = await User.create(userData);
      const userDetails = {
        userId: user.id,
        profilePhoto: faker.image.avatar(),
        name: `${user.firstName} ${user.lastName}`,
        gender: faker.person.sexType(),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
        age: faker.number.int({ min: 18, max: 60 }),
        height: `${faker.number.int({ min: 150, max: 200 })} cm`,
        weight: `${faker.number.int({ min: 50, max: 100 })} kg`,
        lookingFor: faker.helpers.arrayElement(['men', 'women', 'All']),
        maritalStatus: faker.helpers.arrayElement([
          'single',
          'divorced',
          'widowed',
          'married',
          'Separated',
        ]),
        noOfChildren: faker.number.int({ min: 0, max: 5 }),
        bodyType: faker.lorem.word(),
        bodyComplexion: faker.lorem.word(),
        physicalStatus: faker.lorem.word(),
        motherTongue: faker.lorem.word(),
        eatingHabits: faker.helpers.arrayElement([
          'vegetarian',
          'non-vegetarian',
          'vegan',
          'flexitarian',
          'halal',
          'junk food',
          'A Little of everything',
        ]),
        drinkingHabits: faker.lorem.word(),
        smokingHabits: faker.lorem.word(),
        religion: faker.helpers.arrayElement([
          'Hinduism',
          'Sikhism',
          'Christianity',
          'Jainism',
          'Islam',
          'Judaism',
          'Buddhism',
          'Shinto',
          'Confucianism',
          'Zoroastrianism',
          'Others',
        ]),
        caste: faker.lorem.word(),
        subCaste: faker.lorem.word(),
        gothra: faker.lorem.word(),
        star: faker.lorem.word(),
        zodiacSign: faker.helpers.arrayElement([
          'Aries',
          'Taurus',
          'Gemini',
          'Cancer',
          'Leo',
          'Virgo',
          'Libra',
          'Scorpio',
          'Sagittarius',
          'Capricorn',
          'Aquarius',
          'Pisces',
        ]),
        haveDosh: faker.datatype.boolean(),
        timeOfBirth: faker.date.recent(),
        placeOfBirth: faker.location.city(),
        country: faker.location.country(),
        citizenship: 'Indian',
        residingCity: faker.location.city(),
        highestEducation: faker.lorem.word(),
        occupation: faker.lorem.word(),
        annualIncome: `${faker.finance.amount()} INR`,
        familyValue: faker.lorem.word(),
        familyStatus: faker.lorem.word(),
        noofSiblings: faker.number.int({ min: 0, max: 5 }),
        familyLocation: faker.location.city(),
        hobbies: faker.lorem.words(5).split(' '),
        bio: faker.lorem.paragraph(),
      };
      userDetailsData.push(userDetails);
    }

    await UserDetails.bulkCreate(userDetailsData);

    console.log(
      `Default ${numUsers} users and user details seeded successfully.`,
    );
  } catch (error) {
    console.error('Error seeding default users and user details:', error);
  }
};

// Define main seeding function
const seedData = async () => {
  await seedDefaultAdmin();
  await seedDefaultUsers();
  // Add more seed functions if needed
};

// Execute the seeding function
seedData()
  .then(() => {
    console.log('Seed data complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seed data failed:', error);
    process.exit(1);
  });
