'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  
  await queryInterface.bulkInsert('products', [
    {
      "name": "Dry Food Whiskas",
      "description": "Makanan renyah untuk Kucing kesayangan anda",
      "price": 40000,
      "stock": 30,
      "type": "Food",
      "image": "/images/DryFood_Whiskas.jpg",
      "createdAt": new Date(),
      "updatedAt": new Date()
    },
    {
      "name": "Wet Food Whiskas",
      "description": "Makanan basah untuk Kucing kesayangan anda",
      "price": 30000,
      "stock": 15,
      "type": "Food",
      "image": "/images/WetFood_Whiskas.jpg",
      "createdAt": new Date(),
      "updatedAt": new Date()
    }
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
