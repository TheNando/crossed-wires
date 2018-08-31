'use strict'

const Db = require('./db')
const Robots = require('./robots')

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
  constructor() {
    this.sessions = {}
  }

  async loadSessions() {
    try {
      const sessionCollection = await Db.collection('sessions').get()
      this.sessions = sessionCollection.docs.reduce((agg, doc) => {
        const id = doc.id
        agg[id] = { ...doc.data(), id }
        return agg
      }, {})
    } catch (err) {
      console.log('Error getting sessions', err)
    }
  }

  /**
   * Generate a new user and session.
   *
   * @param {Object} login - Contains User name, team, and handle
   * @return {Object} Newly generated user session.
   */
  async login(login) {
    if (!login.name) {
      return null
    }

    const sessions = Object.values(this.sessions)

    // Check for pre-existing user session by name
    const existing = sessions.find(
      (session) => login.name === session.user.name
    )

    if (existing) {
      console.log(`${session.user.handle} has returned.`)
      return existing
    }

    // Do not allow user to use same handle as another logged in user
    if (sessions.find((session) => login.handle === session.user.handle)) {
      throw {
        status: 409,
        message: `Handle "${login.handle}" is already in use.`,
      }
    }

    // Team required
    if (!login.team) {
      throw {
        status: 400,
        message: `Team is a required field.`,
      }
    }

    // Robot required
    if (!login.robot) {
      throw {
        status: 400,
        message: `Robot is a required field.`,
      }
    }

    // Check that robot exists
    if (!Robots.has(login.robot)) {
      throw {
        status: 400,
        message: `Specified robot does not exist`,
      }
    }

    const session = Object.assign({}, baseSession, { user: login })

    try {
      const docRef = await Db.collection('sessions').add(session)
      session.id = docRef.id
    } catch (error) {
      throw {
        status: 500,
        message: `Error adding session: ${err}`,
      }
    }

    this.sessions[session.id] = session
    console.log(`${login.handle} has logged in.`)

    return session
  }
}

const singleton = new Sessions()

module.exports = singleton
