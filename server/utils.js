'use strict'

const fs = require('fs')

/** Class containing utility methods to ease common tasks. */
class Utils {
    constructor () {
    }

    /**
     * Asynchronously read UTF-8 encoded file using Promise pattern.
     * 
     * @param {string} file - The path string of file to read
     * @return {Promise.<{}>}
     *   - @resolve returns string file data<br/>
     *   - @reject returns readFile error
     */
    static readFile (file) {
        return new Promise(function(resolve, reject) {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                }

                resolve(data)
            })
        });
    }

    /**
     * Asynchronously read UTF-8 encoded file as JSON using Promise pattern.
     * 
     * @param {string} file - The path string of file to read
     * @return {Promise.<{}>}
     *   - @resolve returns file data as JSON object<br/>
     *   - @reject returns readFile error
     */
    static readJson (file) {
        return Utils.readFile(file).then(data => JSON.parse(data))
    }

    /**
     * Synchronously read UTF-8 encoded file as JSON.
     * 
     * @param {string} file - The path string of file to read
     * @return {Object} file data as JSON object
     */
    static readJsonSync (file) {
        let fileExists = fs.existsSync(file)
        if (!fileExists) {
            return null
        }
            
        try {
            return JSON.parse(fs.readFileSync(file))
        } catch (error) {
            return null
        }
    }

}

/**
 * Utils module.
 * @module utils
 */

/** Utils class. */
module.exports = Utils
