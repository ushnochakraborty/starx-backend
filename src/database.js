/**
 * Wrapper for MariaDB database for ease of use
 */

/**
 * @typedef {import("./server").SurveyData} SurveyData
 */

const mariadb = require("mariadb");
const fs = require("fs");
const path = require("path");

class Database {

    /**
     * @type {mariadb.Pool}
     */
    static #pool = null;
    /**
     * @type {mariadb.PoolConnection}
     */
    static #connection = null;

    static #connectionConfig = {
        host: "",
        port: "",
        user: "",
        password: "",
    }

    static setConnectionConfig(host, port, user, password) {
        if (this.#pool) {
            this.#pool.end();
        }
        this.#connectionConfig = {
            host: "localhost",
            port: port,
            user: "root",
            password: password,
            connectionLimit: 1
        }
        this.#pool = mariadb.createPool(this.#connectionConfig);
    }

    static async #checkAndSetup() {
        let q = await this.#connection.query(`SELECT EXISTS (SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'starx') AS result`);
        if (q[0].result === 0) {
            await this.#connection.query(`CREATE DATABASE starx`);
            await this.#connection.query("USE starx");
            await this.#connection.query(fs.readFileSync(path.join(__dirname, "../sql/users.sql"), "utf8"));
            await this.#connection.query(fs.readFileSync(path.join(__dirname, "../sql/responses.sql"), "utf8"));
        }
    }

    /**
     * @returns {Promise<Boolean>} connected
     */
    static async #connect() {
        try {
            this.#connection = await this.#pool.getConnection();
            await this.#checkAndSetup();
            await this.#connection.query("USE starx");
            return true;
        } catch(e) {
            console.error("Database connection error: " + e);
            this.#connection = null;
            return false;
        }
    }

    /**
     * 
     * @param {Number} uid 
     * @returns {Promise<Boolean>} ID exists
     */
    static async #idExists(uid) {
        let res = await this.#connection.query(`SELECT EXISTS(SELECT * FROM users WHERE uid ='${uid}') AS result`);
        return (res[0].result == 1) ? true : false;
    }

    /**
     * 
     * @param {Number} uid 
     * @param {Number} pin 
     * @returns {Promise<Boolean>} Authentication correct
     */
    static async #isAuth(uid, pin) {
        let res = await this.#connection.query(`SELECT EXISTS(SELECT * FROM users WHERE uid = ${uid} AND pin = ${pin}) AS result`);
        return (res[0].result == 1) ? true : false;
    }

    /**
     * 
     * @param {SurveyData} results
     */
    static async uploadNew(results) {
        if (!(await this.#connect())) 'db';
        let uid = 0;
        do {
            uid = 1E6 + Math.floor(Math.random() * 9E6);
        } while (await this.#idExists(uid));
        let pin = 1000 + Math.floor(Math.random() * 9000);
        await this.#connection.query(`INSERT INTO users (uid, pin) VALUE (?, ?)`, [uid, pin]);
        await this.#connection.query(`INSERT INTO responses (uid, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18) VALUE (${uid}, ${results.q1}, ${results.q2}, ${results.q3}, ${results.q4}, ${results.q5}, ${results.q6}, ${results.q7}, ${results.q8}, ${results.q9}, ${results.q10}, ${results.q11}, ${results.q12}, ${results.q13}, ${results.q14}, ${results.q15}, ${results.q16}, ${results.q17}, ${results.q18})`);

        this.#connection.end();

        return {
            uid: uid,
            pin: pin
        }
    }

    static async upload(uid, pin, results) {
        if (!(await this.#connect())) return 'db';
        if (!(await this.#isAuth(uid, pin))) return 'auth';
        await this.#connection.query(`INSERT INTO responses (uid, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18) VALUE (${uid}, ${results.q1}, ${results.q2}, ${results.q3}, ${results.q4}, ${results.q5}, ${results.q6}, ${results.q7}, ${results.q8}, ${results.q9}, ${results.q10}, ${results.q11}, ${results.q12}, ${results.q13}, ${results.q14}, ${results.q15}, ${results.q16}, ${results.q17}, ${results.q18})`);

        this.#connection.end();

        return 'ok';
    }

    // /**
    //  * 
    //  * @param {String} uid 
    //  * @param {Number} pin
    //  * @returns {Promise<SurveyData?>}
    //  */
    // static async get(uid, pin) {
    //     if (!this.#connection) return;
    //     if (!(await this.#isAuth(uid, pin))) return;
    //     let res = await this.#connection.query(`SELECT * FROM Responses WHERE uid = ${uid}`);
    //     delete res.meta;
    //     return res;
    // }
}

module.exports.DB = Database;
