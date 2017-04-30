'use strict'

const _ = require('lodash')
const Utils = require('./utils')
const fs = require('fs')

const dataPath = 'src/data/questions.json'
const questionsDir = 'src/questions/'

/** Class used to manipulate quiz question data. */
class Questions {
    /**
     * Create an instance of Questions class. First, attempt to locate and load
     * questions from a questions.json file located in the data directory. If
     * that fails to load valid data, attempt to reload all questions from all
     * files in the questions directory.
     * 
     * Once questions are loaded, execute an interval function, setting current
     * available question each time the configured duration has elapsed.
     */
    constructor () {
        this.current = null

        // Try and load data from json file before trying raw questions
        _.assign(this, Questions.fromJson(dataPath))

        // If that failed, load raw questions
        if (_.isEmpty(this.items)) {
            _.assign(this, Questions.fromDir(questionsDir))
        }

        // Bind 'this' so setNext can access instance within setInterval
        setInterval(this.setNext.bind(this), 60 * 1000, this)

        // Prepare next quesion (which will become first question)
        this.next = this.random()

        // Set the first question
        this.setNext()
    }

    /**
     * Iterate through each file in directory and compile questions in file,
     * returning compiled questions.
     * 
     * @param {string} dir - The path string of a directory containing question
     *                       text files.
     * @return {Object} An object containing arrays of question items and
     *                  category strings.
     */
    static fromDir (dir) {
        let items = []
        let categories = []

        fs.readdirSync(dir)
            .forEach(category => {
                let questions = Questions.fromText(category)
                items = items.concat(questions)
                categories.push(category)
            })
        return { items, categories }
    }

    /**
     * Retrieve question items and categories from JSON file.
     * 
     * @param {string} path - The path string of JSON file containing question
     *                        data.
     * @return {Object} An object containing arrays of question items and
     *                  category strings.
     */
    static fromJson (path) {
        let items = Utils.readJsonSync(path)
        let categories = _(items).map('category').uniq().value()
        return { items, categories }
    }

    /**
     * Retrieve question items array from text file.
     * 
     * @param {string} path - The path string of text file containing question
     *                        data.
     * @return {Array} An array containing of question items.
     */
    static fromText (path) {
        let questions = []
        let question = {}
        
        let content = fs.readFileSync(questionsDir + path, 'utf8')

        content.split('\n').forEach(line => {
            if (line.startsWith('#Q')) {
                question = { category: path, choices: [] }
                question.text = line.substring(3)
            } else if (line.startsWith('^')) {
                question.answer = line.substring(2)
            } else if (line !== '') {
                question.choices.push(line.substring(2))
            } else if (line === '' && question.text) {
                questions.push(question)
            }
        })

        return questions
    }

    /**
     * Retrieve currently active question.
     * 
     * @return {Object} Currently active question.
     */
    get () {
        return this.current
    }

    /**
     * Get info on currently loaded questions
     * 
     * @return {Object} Object containing info on currently loaded questions.
     */
    info () {
        // Create object with keys for each category and zero values to hold totals
        let info = _.zipObject(this.categories, _.range(0, this.categories.length, 0))

        // Count number of items for each category
        _.forEach(this.items, item => info[item.category] += 1)

        return info
    }

    /**
     * Retrieve a random question from all loaded questions.
     * 
     * @return {Object} A question.
     */
    random () {
        return _.sample(this.items)
    }

    /** Save currently loaded question data to JSON file */
    save () {
        fs.writeFile(dataPath, JSON.stringify(this.items))
    }

    /** Set currently loaded question to next available question */
    setNext () {
        console.log('Setting next question')
        this.current = this.next
        this.current.expires = _.now() + (10 * 1000)

        this.next = this.random()
        this.current.nextCategory = this.next.category
    }
}

module.exports = Questions
