'use strict'

const Names = require('./names')
const Utils = require('./utils')

const baseSession = {
    id: null,
    user: null
}

const baseUser = {
    email: null,
    name: null
}

/** Class used to create users and user sessions. */
class Sessions {
    /** Create an instance of Sessions class. */
    constructor () {
        this.sessions = []
    }

    /**
     * Generate a new user and session.
     *
     * @return {Object} Newly generated user session.
     */
    newUser (email) {
        let session

        if (!email) {
            return null
        }

        // Check for pre-existing user session with email
        session = this.sessions.find(session => email === session.user.email)

        if (!session) {
            let user = Object.assign({}, baseUser)
            session = Object.assign({}, baseSession)

            user.email = email
            user.name = Names.generate()

            session.id = Utils.generateId()
            session.user = user

            this.sessions.push(session)
        }

        return session
    }
}

const singleton = new Sessions();

module.exports = singleton
