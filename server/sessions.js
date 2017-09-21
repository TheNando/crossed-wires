'use strict'

const Names = require('./names')
const Utils = require('./utils')

const baseSession = {
    id: null,
    user: null
}

const baseUser = {
    email: null,
    handle: null,
    team: null
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
    newUser (login) {
        let session

        if (!login.email) {
            return null
        }

        // Check for pre-existing user session with email
        session = this.sessions.find(session => login.email === session.user.email)
        
        if (!session) {

            // Do not allow user to use the same name as a logged in user
            if (this.sessions.find(session => login.handle === session.user.handle)) {
                throw {
                    status: 409,
                    message: `Handle "${login.handle}" is already in use.`
                }
            }

            let user = Object.assign({}, baseUser)
            session = Object.assign({}, baseSession)

            session.id = Utils.generateId()
            session.user = login

            this.sessions.push(session)
        }

        return session
    }
}

const singleton = new Sessions();

module.exports = singleton
