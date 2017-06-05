'use strict'

const Utils = require('./utils')
const fs = require('fs')

const baseTeam = {
    bits: 0,
    colorHex: null,
    name: null,
    players: []
}

const dataPath = './server/data/teams.json'

const rxIsColor = /^#[0-9A-F]{6}$/i


/** Class used to store teams data. */
class Teams {
    /**
     * Create an instance of Team class, pre-populating with saved flat-file
     * data, if exists.
     */
    constructor () {
        this.teams = null

        // Load data from json file if it exists
        Object.assign(this, Teams.fromJson(dataPath))
    }

    /**
     * Retrieve stored teams data from JSON file.
     *
     * @param {string} path - The path string of JSON file containing team
     *                        data.
     * @return {Object} An object containing team data keyed on team name.
     */
    static fromJson (path) {
        return Utils.readJsonSync(path)
    }

    /**
     * Retrieves currently loaded teams names.
     *
     * @return {Array} Currently loaded team names.
     */
    getNames () {
        return Object.keys(this.teams)
    }

    /**
     * Retrieves specific team by name.
     *
     * @return {Object} Team data.
     */
    getTeam (name) {
        return this.teams[name]
    }

    /**
     * Create a new team.
     *
     * @return {Object} Newly generated team data.
     */
    newTeam (name, color) {
        let team
        let test = ''

        if (!name) {
            return null
        }

        // Check for pre-existing user session with email
        team = this.teams.find(team => name === team.name)

        if (team) {
            return null
        }

        team = Object.assign({}, baseTeam)

        team.name = name
        team.color = rxIsColor.test(color) ? color : Utils.generateColor()

        this.teams[name] = team

        return team
    }

    /** Save currently loaded question data to JSON file */
    save () {
        fs.writeFile(dataPath, JSON.stringify(this.teams))
    }
}

module.exports = Teams
