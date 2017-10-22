'use strict'

const Db = require('./db')
const fs = require('fs')
const Utils = require('./utils')

const baseRobot = {
    bits: 0,
    colorHex: null,
    name: null,
    robot: null,
    members: []
}

const rxIsColor = /^#[0-9A-F]{6}$/i


/** Class used to store robots data. */
class Robots {
    /**
     * Create an instance of Robot class, pre-populating with saved flat-file
     * data, if exists.
     */
    constructor () {
        this.robots = {}

        // Load data from database
        Db.collection('robots').get()
            .then(robots => {
                robots.forEach(robot => this.robots[robot.id] = robot.data())
            })
            .catch(err => {
                console.log('Error getting robots', err)
            })
    }

    /**
     * Create a new robot.
     *
     * @return {Object} Newly generated robot data.
     */
    add (name, team, color) {
        let robot
        let test = ''

        if (!name) {
            return null
        }

        // Check for pre-existing robot by name
        robot = this.robots.find(robot => name === robot.name)

        if (robot) {
            return null
        }

        robot = Object.assign({}, baseRobot)

        robot.name = name
        robot.color = rxIsColor.test(color) ? color.toLowerCase() : Utils.generateColor()

        this.robots[name] = robot

        return robot
    }

    /**
     * Retrieves specific robot by name.
     *
     * @return {Object} Robot data.
     */
    get (name) {
        return this.robots[name]
    }

    /**
     * Retrieves currently loaded robots names.
     *
     * @return {Array} Currently loaded robot names.
     */
    getNames () {
        return Object.keys(this.robots)
    }

    /**
     * Get list of currently loaded robots.
     *
     * @return {Object} Array of currently loaded robots.
     */
    list () {
        return Object.values(this.robots)
    }
}

const singleton = new Robots()

module.exports = singleton
