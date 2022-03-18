const sequelize = require("sequelize");
const Sequelize = require("Sequelize");

const company = sequelize.define("Podmiot", {
  pod_id: {
    type: Sequelize.STRING,
  },
  pod_nazwa: {
    type: Sequelize.STRING,
  },
  pod_nip: {
    type: Sequelize.STRING,
  },
  pod_adres: {
    type: Sequelize.STRING,
  },
  pod_jednostki: {
    type: Sequelize.STRING,
  },
});

module.exports = company;
