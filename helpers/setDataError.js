const db = require("../database");

exports.dataSetError = ({ error }) => {
  const sqlErrTopId = "SELECT blad_id FROM Bledy ORDER BY blad_id DESC LIMIT 1";
  db.query(sqlErrTopId, function (err, data) {
    if (!err) {
      const blad_id = data.length;
      const blad = [blad_id, error];
      const sqlErrAdd = `INSERT INTO Bledy (blad_id, blad_tresc) VALUES (?, ?)`;
      db.query(sqlErrAdd, blad, (err, data) => {
        if (!err) {
          console.log(data);
          return;
        } else {
          return;
        }
      });
    } else {
      return;
    }
  });
};
