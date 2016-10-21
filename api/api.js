import { createPool } from 'mysql';

export class Api {
  constructor() {
    this.pool = createPool({
      connectionLimit : 10,
      host : '127.0.0.1',
      user : 'root',
      password : 'no_pass',
      database : 'carto'
    })
  }

  getProcesses(res) {
    this.pool.getConnection((err, con) => {
      con.query('select ID, Label from processus', (err2, result) => {
        con.release();
        res.json(result);
      });
    });
  }

  getCustoms(res) {
    this.pool.getConnection((err, con) => {
      con.query('select ID, Label from customs', (err2, result) => {
        con.release();
        res.json(result);
      });
    });
  }

  getProcess(id, res) {
    this.pool.getConnection((err, con) => {
      con.query('select r.ServiceId, s.SystemId, s.Label, s.URL1, s.URL2, r.Format, r.Protocol, r.Criticity, r.SecurityLevel, sys.Label as SystemLabel from relation as r inner join service as s on r.ServiceId = s.ID inner join system as sys on sys.ID = s.SystemId where r.ProcessId = ?', [id], (err2, services) => {
        con.query('select * from processus as p inner join system as s on p.SystemId = s.ID where p.ID = ?', [id], (err3, processInfo) => {
          con.release();
          res.json({ processInfo: processInfo[0], services });
        });
      });
    });
  }

  getCustom(id, res) {
    this.pool.getConnection((err, con) => {
      con.query('select Dataset from customs where ID = ?', [id], (err2, result) => {
        con.release();
        res.json(result);
      });
    });
  }

  getUsed(id, res) {
    this.pool.getConnection((err, con) => {
      con.query('select p.ID, r.ProcessId, r.Format, r.Protocol, r.Criticity, r.SecurityLevel from processus as p inner join relation as r on p.ServiceId = r.ServiceId where p.ID = ?', [id], (err2, result) => {
        con.release();
        res.json(result);
      });
    });
  }

  postCustom(body, res) {
    this.pool.getConnection((err, con) => {
      con.query('insert into customs (Label, Dataset) values (?, ?)', [body.label, JSON.stringify(body.dataset)], (err2, result) => {
        con.release();
        res.json(result.insertId);
      });
    });
  }
}
