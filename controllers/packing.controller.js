const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");

exports.getPackingTable = (req, res, next) => {
  const sqlPackingTab = `SELECT * FROM Pakowanie  `;

  db.query(sqlPackingTab, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        data: data,
      });
    } else {
      const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
      addError.dataSetError(error);
      const errData = helpers.handleErrors();
      res.json(errData);
      return;
    }
  });
};
