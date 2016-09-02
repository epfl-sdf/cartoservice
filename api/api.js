import { createPool, getConnection } from 'mysql'
 
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
            con.query('select ID, Label from processus', (err, result) => {
                con.release();
                res.json(result);
            })
        })
    }

    getProcess(id, res) {
        this.pool.getConnection((err, con) => {
            con.query('select r.ServiceId, s.SystemId, s.Label, s.URL1, s.URL2, r.Format, r.Protocol, r.Criticity, r.SecurityLevel from relation as r inner join service as s on r.ServiceId = s.ID where r.ProcessId = ?', [id], (err, services) => {
                con.query('select * from processus where ID = ?', [id], (err, process_info) => {
                    con.release();
                    res.json({processInfo: process_info[0], services: services});
                })
            })
        })
    }

    getUsed(id, res) {
        this.pool.getConnection((err, con) => {
            con.query('select p.ID, r.ProcessId, r.Format, r.Protocol, r.Criticity, r.SecurityLevel from processus as p inner join relation as r on p.ServiceId = r.ServiceId where p.ID = ?', [id], (err, result) => {
                con.release()
                res.json(result)
            })
        })
    }
    /*getProcess2(id, res) {
        this.pool.getConnection((err, con) => {
            con.query('select sys.ID, sys.Label, s.ID, s.Label from (select s.ID, s.Label, s.SystemId from relation as r inner join service as s on r.ServiceId = s.ID where r.ProcessId = ?) as s inner join system as sys on sys.ID = s.SystemId;', [id], (err, result) => {
                    con.release();
                    res.json(result);
                }
            )
        })
    }*/
}
