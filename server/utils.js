'use strict'

// const _ = require('lodash')
const fs = require('fs')

class Utils {
    constructor () {
    }

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

    static readJson (file) {
        return Utils.readFile(file).then(data => JSON.parse(data))
    }

    static readJsonSync (filePath) {
        let fileExists = fs.existsSync(filePath)
        if (!fileExists) {
            return null
        }
            
        try {
            return JSON.parse(fs.readFileSync(dataPath))
        } catch (error) {
            return null
        }
    }

}

module.exports = Utils
