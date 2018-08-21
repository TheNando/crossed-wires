'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('./crossed-wires-firebase-adminsdk-hfnjv-048adeb239.json')

console.log('**** Running DB Constructor ****')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

module.exports = db
