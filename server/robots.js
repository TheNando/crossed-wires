'use strict'

const fs = require('fs')
const Db = require('./db')
const Utils = require('./utils')

const baseRobot = {
  bits: 0,
  colorHex: null,
  name: null,
  users: new Set(),
  team: null,
}

const rxIsColor = /^#[0-9A-F]{6}$/i

/** Class used to store robots data. */
class Robots {
  /**
   * Create an instance of Robot class, pre-populating with saved flat-file
   * data, if exists.
   */
  constructor() {
    const thisInstance = this
    this.robots = {}

    // Load data from database
    Db.collection('robots')
      .get()
      .then((robots) => robots.forEach((item) => thisInstance.add(item.data())))
      .catch((err) => {
        console.log('Error getting robots', err)
      })
  }

  /**
   * Add a robot to memory.
   *
   * @return {Object} Newly generated robot data.
   */
  add(robot) {
    if (!robot.name) {
      throw {
        status: 400,
        message: 'Robot must have a name.',
      }
    }

    // Check for pre-existing robot by name
    if (this.robots[robot.name]) {
      throw {
        status: 400,
        message: 'A robot with that name already exists.',
      }
    }

    const newRobot = Object.assign({}, baseRobot, robot)

    // Check if color is valid
    newRobot.colorHex = rxIsColor.test(robot.colorHex)
      ? robot.colorHex.toLowerCase()
      : Utils.generateColor()

    // Convert users to set
    newRobot.users = new Set(robot.users)

    this.robots[robot.name] = newRobot

    return robot
  }

  /**
   * Add a logged in player to a robot
   */
  addUser(user) {
    const robot = this.get(user.robot)
    robot.users.add(user.handle)
    Db.collection('robots')
      .doc(robot.name)
      .update({ users: [...robot.users] })
      .catch((err) => {
        robot.users.delete(user)
        throw {
          status: 500,
          message: `Error adding user to robot: ${err}`,
        }
      })
  }

  /**
   * Retrieves specific robot by name.
   *
   * @return {Object} Robot data.
   */
  get(name) {
    return this.robots[name]
  }

  /**
   * Retrieves currently loaded robots names.
   *
   * @return {Array} Currently loaded robot names.
   */
  getNames() {
    return Object.keys(this.robots)
  }

  /**
   * Retrieves true if robot exists in collection.
   *
   * @return {Boolean} True if robot exists.
   */
  has(name) {
    return name in this.robots
  }

  /**
   * Get list of currently loaded robots.
   *
   * @return {Object} Array of currently loaded robots.
   */
  list() {
    return Object.values(this.robots)
  }
}

const singleton = new Robots()

module.exports = singleton
