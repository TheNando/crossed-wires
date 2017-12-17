'use strict'

const Names = require('./names')
const Utils = require('./utils')

const baseSession = {
    id: null,
    user: null,
}

const baseUser = {
    handle: null,
    name: null,
    robot: null,
    team: null,
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
     * @param {Object} login - Contains User name, team, and handle
     * @return {Object} Newly generated user session.
     */
    login (login) {
        let session

        if (!login.name) {
            return null
        }

        // Check for pre-existing user session by name
        session = this.sessions.find(session => login.name === session.user.name)

        if (!session) {

            // Do not allow user to use same handle as another logged in user
            if (this.sessions.find(session => login.handle === session.user.handle)) {
                throw {
                    status: 409,
                    message: `Handle "${login.handle}" is already in use.`
                }
            }

            // Team required
            if (!login.team) {
                throw {
                    status: 400,
                    message: `Team is a required field.`
                }
            }

            // Robot required
            if (!login.robot) {
                throw {
                    status: 400,
                    message: `Robot is a required field.`
                }
            }

            // TODO: Check that robot exists
            // TODO: Get team from robot lookup

            session = Object.assign({}, baseSession)

            session.id = Utils.generateId()
            session.user = login

            this.sessions.push(session)
            console.log(`${login.handle} has logged in.`)
        }

        return session
    }
}

const singleton = new Sessions();

module.exports = singleton
