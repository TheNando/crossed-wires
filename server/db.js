'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('./crossed-wires-firebase-adminsdk-hfnjv-048adeb239.json')

/** Class used to read and write to Firebase DB. */
class Db {
    constructor () {
        console.log('**** Running DB Constructor ****')
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://crossed-wires.firebaseio.com'
        })
    }

    getRef (path) {
        return admin.database().ref(path)
    }
}

const singleton = new Db()

module.exports = singleton
