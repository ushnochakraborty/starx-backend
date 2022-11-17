/**
 * Wrapper for MariaDB database for ease of use
 */

/**
 * @typedef {import("./server").SurveyData} SurveyData
 */

const mariadb = require("mariadb");

/*

-- create
CREATE TABLE UIDLOOKUP (
  uid INTEGER PRIMARY KEY AUTO_INCREMENT,
  pin SMALLINT NOT NULL
);

CREATE TABLE RESPONSES (
  recordId INTEGER PRIMARY KEY AUTO_INCREMENT,
  uid INTEGER,
  foreign key (uid) references UIDLOOKUP(uid),
  q1 TINYINT NOT NULL,
  q2 TINYINT NOT NULL,
  q3 TINYINT NOT NULL,
  q4 TINYINT NOT NULL,
  q5 TINYINT NOT NULL,
  q6 TINYINT NOT NULL,
  q7 TINYINT NOT NULL,
  q8 TINYINT NOT NULL,
  q9 TINYINT NOT NULL,
  q10 TINYINT NOT NULL,
  q11 TINYINT NOT NULL,
  q12 TINYINT NOT NULL,
  q13 TINYINT NOT NULL,
  q14 TINYINT NOT NULL,
  q15 TINYINT NOT NULL,
  q16 TINYINT NOT NULL,
  q17 TINYINT NOT NULL,
  q18 TINYINT NOT NULL
);

-- insert
INSERT INTO UIDLOOKUP VALUES (1, 1234);
INSERT INTO UIDLOOKUP VALUES (2, 1234);
INSERT INTO UIDLOOKUP VALUES (3, 4321);
INSERT INTO UIDLOOKUP VALUES (4, 1111);
INSERT INTO RESPONSES VALUES (1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

-- fetch 
SELECT * FROM UIDLOOKUP;
SELECT * FROM RESPONSES;

*/

 class Database {
    static isConnected = false;
    /**
     * @type {mariadb.Pool}
     */
    static pool = null;
    /**
     * @type {mariadb.PoolConnection}
     */
    static connection = null;

    /**
     * 
     * @param {String} host 
     * @param {String} user 
     * @param {String} password 
     * @returns {Promise<Boolean>} connected
     */
    static async connect(host, user, password) {
        if (this.isConnected) return;
        this.pool = mariadb.createPool({
            host: host,
            user: user,
            password: password,
            connectionLimit: 2
        });
        connection = await this.pool.getConnection().catch(e => {
            console.error("DB connection error: " + e);
            return false;
        });
        this.isConnected = true;
        return true;
    }

    /**
     * 
     * @param {Number} id 
     * @returns {Promise<Boolean>} ID exists
     */
     static async #idExists(id) {
        // TODO!!!
        // await this.connection.query()
        return false;
    }

    /**
     * 
     * @param {SurveyData} results
     * @returns {Promise<Number | Boolean>} ID
     */
    static async upload(results) {
        if (!this.isConnected) return null;

        if (results.id) {
            if (!(await this.#idExists(id))) return false;
        } else {
            let id = 0;
            do {
                id = Math.floor(Math.random() * 0xffffff);
            } while (!(await this.#idExists(id)));
            results.id = id;
        }
        
        // TODO insert data

        return id;
    }

    /**
     * 
     * @param {String} id 
     * @param {Number} pin
     * @returns {Promise<SurveyData?>} success
     */
    static async get(id, pin) {
        if (!this.isConnected) return null;
        if (!(await this.#idExists(id))) return null;

        return null;
    }
}

module.exports.DB = Database;
