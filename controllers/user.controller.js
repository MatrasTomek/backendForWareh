const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");
const crypto = require("crypto");

// ADD USER
exports.postUser = (req, res, next) => {
  const { login, password } = req.body;
  const secret = "";
  const md5Hasher = crypto.createHmac("md5", secret);
  const hash = md5Hasher.update(password).digest("hex");

  const sqlDoubleUserMail = `SELECT * FROM Uzytkownik WHERE uzyt_email='${login}'`;

  db.query(sqlDoubleUserMail, function (err, data) {
    if (!err) {
      if (data.length) {
        res.json({
          status: 404,
          message: `Użytkownik: ${login}, istnieje w bazei danych.`,
        });
      } else if (data.length === 0) {
        const promiseTopId = new Promise((resolve, reject) => {
          let id = null;
          const sqlTopId =
            "SELECT uzyt_id FROM Uzytkownik ORDER BY uzyt_id DESC LIMIT 1";
          db.query(sqlTopId, function (err, data, fields) {
            if (!err) {
              id = data[0].uzyt_id + 1;
              resolve(id);
            } else {
              const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
              addError.dataSetError(error);
              const errData = helpers.handleErrors();
              res.json(errData);
              return;
            }
          });
        });

        promiseTopId.then((id) => {
          const uzyt_aktywny = true;
          const user = [id, login, hash, uzyt_aktywny];
          const sql =
            "INSERT INTO Uzytkownik (uzyt_id, uzyt_email, uzyt_haslo, uzyt_aktywny) VALUES (?,?,?, ?)";
          db.query(sql, user, (err, data) => {
            if (!err) {
              res.json({
                status: 200,
                message: `Użytkownik: ${login}, dodany`,
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
      }
    } else {
      const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
      addError.dataSetError(error);
      const errData = helpers.handleErrors();
      res.json(errData);
      return;
    }
  });
};

// LOGIN USER
exports.loginUser = (req, res, next) => {
  const { login, password } = req.body;

  const secret = "";
  const md5Hasher = crypto.createHmac("md5", secret);
  const hash = md5Hasher.update(password).digest("hex");

  const promiseUserActive = new Promise((resolve, reject) => {
    const sqlUserActive = `SELECT * FROM Uzytkownik`;
    db.query(sqlUserActive, function (err, data) {
      const searchedData = [];
      if (!err) {
        data.forEach((item) => {
          if (item.uzyt_email === login && item.uzyt_aktywny === 1) {
            searchedData.push(item);
            resolve(searchedData);
          } else {
            resolve(searchedData);
          }
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

  promiseUserActive.then((searchedData) => {
    if (!searchedData.length) {
      dataErr = { status: 404, message: `użytkownik ${login} nie istnieje` };
      res.json(dataErr);
      return;
    } else if (searchedData[0].uzyt_haslo !== hash.toString()) {
      dataErr = { status: 301, message: `hasło lub login się nie zgadza` };
      res.json(dataErr);
      return;
    } else if (searchedData[0].uzyt_haslo === hash.toString()) {
      res.json({
        status: 200,
        data: searchedData,
      });
    }
  });
};

// GET USER
exports.getUser = (req, res, next) => {
  const { login } = req.params;

  const sql = "SELECT * FROM Uzytkownik";
  const searchedData = [];

  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    if (!login) {
      return searchedData;
    }

    data.forEach((item) => {
      if (item.uzyt_email === login) {
        searchedData.push(item);
        res.json(searchedData);
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

// EDIT USER
exports.putUser = (req, res, next) => {
  const { id, login, newPassword } = req.body;

  const secret = "";
  const md5Hasher = crypto.createHmac("md5", secret);
  const hash = md5Hasher.update(newPassword).digest("hex");

  const sql = `UPDATE Uzytkownik SET uzyt_haslo = '${hash}' WHERE uzyt_id = ${id}`;
  db.query(sql, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        message: "Hasło zostało zmienione",
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

// DEL USER
exports.deleteUser = (req, res, next) => {
  const { id } = req.params;

  // const sqlUzytPodmiotToDEL = `DELETE FROM Uzytkownik WHERE uzyt_id = ${id}`;
  const sqlUzytPodmiotToDEL = `UPDATE Uzytkownik SET uzyt_aktywny = false WHERE uzyt_id = ${id} `;
  db.query(sqlUzytPodmiotToDEL, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
        message: `użytkownik o id: ${id} - usunięty!`,
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
