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
    robot: null
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
    login (user) {
        let session

        if (!user.email) {
            return null
        }

        // Check for pre-existing user session with email
        session = this.sessions.find(session => user.email === session.user.email)

        if (!session) {

            // Do not allow user to use same name as another logged in user
            if (this.sessions.find(session => user.handle === session.user.handle)) {
                throw {
                    status: 409,
                    message: `Handle "${user.handle}" is already in use.`
                }
            }

            session = Object.assign({}, baseSession)

            session.id = Utils.generateId()
            session.user = user

            this.sessions.push(session)
            console.log(`${user.handle} has logged in.`)
        }

        return session
    }
}

const singleton = new Sessions();

module.exports = singleton
