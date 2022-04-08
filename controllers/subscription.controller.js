const db = require("../database");
const helpers = require("../helpers/handleErrors");
const addError = require("../helpers/setDataError");

exports.getSubscriptionForOneCompany = (req, res, next) => {
  const { companyId } = req.params;

  const sqlSubscriptionTab = `SELECT * FROM Pod_Abonament WHERE podabon_pod_id = ${companyId}
  `;
  db.query(sqlSubscriptionTab, function (err, data, fields) {
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

exports.postSubscription = (req, res, next) => {
  const {
    podabon_pod_id,
    podabon_abonam_id,
    podabon_data_od,
    podabon_data_do,
  } = req.body;

  let podabon_id = null;
  const promiseAddSubscription = new Promise((resolve, reject) => {
    const sqlTopId =
      "SELECT podabon_id FROM Pod_Abonament ORDER BY podabon_id DESC LIMIT 1";
    db.query(sqlTopId, function (err, data, fields) {
      if (!err) {
        if (!data.length) {
          podabon_id = 1;
        } else {
          podabon_id = data[0].podabon_id + 1;
        }
        resolve(podabon_id);
      } else {
        const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
        console.log(error);
        addError.dataSetError(error);
        const errData = helpers.handleErrors();
        res.json(errData);
        return;
      }
    });
  });

  promiseAddSubscription.then((podabon_id) => {
    const subscription = [
      podabon_id,
      podabon_pod_id,
      podabon_abonam_id,
      podabon_data_od,
      podabon_data_do,
    ];

    const sqlAddSubscription =
      "INSERT INTO Pod_Abonament (podabon_id, podabon_pod_id, podabon_abonam_id, podabon_data_od, podabon_data_do) VALUES (?,?,?,?,?)";
    db.query(sqlAddSubscription, subscription, (err) => {
      if (!err) {
        data = {
          podabon_id: podabon_id,
          podabon_pod_id: podabon_pod_id,
          podabon_abonam_id: podabon_abonam_id,
          podabon_data_od: podabon_data_od,
          podabon_data_do: podabon_data_do,
        };
        res.json({
          status: 200,
          data: data,
        });
      } else {
        const error = `errCode:${err.code}, errNo:${err.errno}, ${err.sql}`;
        console.log(err);
        addError.dataSetError(error);
        const errData = helpers.handleErrors();
        res.json(errData);
        return;
      }
    });
  });
};

exports.delSubscription = (req, res, next) => {
  const { id } = req.params;

  const sqlWarehDetailsToDel = `DELETE FROM Pod_Abonament WHERE podabon_pod_id = ${id}`;
  db.query(sqlWarehDetailsToDel, function (err, data, fields) {
    if (!err) {
      res.json({
        status: 200,
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
