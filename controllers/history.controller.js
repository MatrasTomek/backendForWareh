const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");

exports.getHistoryElementById = (req, res, next) => {
  const { abonamId, magId } = req.params;

  const sqlHistory = `SELECT hist_id FROM Historia WHERE hist_id_obiektu=${Number(
    abonamId
  )} AND hist_id_powiazany=${Number(magId)}`;
  db.query(sqlHistory, function (err, data, fields) {
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

exports.postHistoryElement = (req, res, next) => {
  const {
    hist_zdarzenie,
    hist_id_obiektu,
    hist_typ_obiektu,
    hist_data,
    hist_id_powiazany,
    hist_typ_obiektu_powiazany,
  } = req.body;

  const promiseTopId = new Promise((resolve, reject) => {
    let hist_id = null;
    const sqlTopId =
      "SELECT hist_id FROM Historia ORDER BY hist_id DESC LIMIT 1";
    db.query(sqlTopId, function (err, data, fields) {
      if (!err) {
        if (!data.length) {
          hist_id = 1;
        } else {
          hist_id = data[0].hist_id + 1;
        }

        resolve(hist_id);
      } else {
        const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
        addError.dataSetError(error);
        const errData = helpers.handleErrors();
        res.json(errData);
        return;
      }
    });
  });

  promiseTopId.then((hist_id) => {
    const newHistoryItem = [
      hist_id,
      hist_zdarzenie,
      hist_id_obiektu,
      hist_typ_obiektu,
      hist_data,
      hist_id_powiazany,
      hist_typ_obiektu_powiazany,
    ];
    const sqlAddWareh =
      "INSERT INTO Historia (hist_id, hist_zdarzenie, hist_id_obiektu, hist_typ_obiektu, hist_data, hist_id_powiazany, hist_typ_obiektu_powiazany)  VALUES (?,?,?,?,?,?,?)";

    db.query(sqlAddWareh, newHistoryItem, (err, data) => {
      if (!err) {
        res.json({
          status: 201,
        });
      } else {
        const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
        addError.dataSetError(error);
        const errData = helpers.handleErrors();

        res.json(errData);
        return;
      }
    });
  });
};
