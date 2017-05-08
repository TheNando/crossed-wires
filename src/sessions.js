'use strict'

const Names = require('./names')
const Utils = require('./utils')

const baseUser = {
    email: null,
    id: null,
    name: null
}

/** Class used to create session data for users. */
class Sessions {
    /** Create an instance of Sessions class. */
    constructor () {
        this.sessions = []
    }

    /**
     * Generate a new user and session.
     * 
     * @return {Object} Newly generated user session data.
     */
    newUser (email) {
        let user

        if (!email) {
            return null
        }
        
        user = Object.assign({}, baseUser)

        user.email = email
        user.id = Utils.generateId()
        user.name = Names.generate()

        this.sessions.push(user)

        return user
    }
}

module.exports = Sessions
