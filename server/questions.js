'use strict'

const _ = require('lodash')
const Utils = require('./utils')
const fs = require('fs')

const dataPath = './data/questions.json'
const questionsDir = './questions/'

class Questions {
    constructor () {
        // Needed so _setNext can access instance within setInterval
        let boundSetNext = this._setNext.bind(this)

        this._current = null
        this._categories = []

        // Try and load data from json file before trying raw questions
        this._items = _.defaultTo(Utils.readJsonSync(dataPath), [])
        this._categories = _(this._items).map('category').uniq().value()

        // If that failed, load raw questions
        if (_.isEmpty(this._items)) {
            fs.readdirSync(questionsDir)
                .forEach(category => {
                    let questions = Questions._getQuestionsFromText(category)
                    this._items = this._items.concat(questions)
                    this._categories.push(category)
                })
        }

        setInterval(boundSetNext, 60 * 60 * 1000, this)

        // Prepare next quesion (which will become first question)
        this._next = this._getOne()

        // Set the first question
        this._setNext()
    }

    _getOne () {
        return _.sample(this._items)
    }

    static _getQuestionsFromText (category) {
        let questions = []
        let question = {}
        
        let content = fs.readFileSync(questionsDir + category, 'utf8')

        content.split('\n').forEach(line => {
            if (line.startsWith('#Q')) {
                question = { category: category, choices: [] }
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

    _setNext () {
        console.log('Setting next question')
        this._current = this._next
        this._current.expires = _.now() + (10 * 1000)

        this._next = this._getOne()
        this._current.nextCategory = this._next.category
    }

    current () {
        return this._current
    }

    info () {
        // Create object with keys for each category and zero values to hold totals
        let info = _.zipObject(this._categories, _.range(0, this._categories.length, 0))

        // Count number of items for each category
        _.forEach(this._items, item => info[item.category] += 1)

        return info
    }

    save () {
        fs.writeFile(dataPath, JSON.stringify(this._items))
    }
}

module.exports = Questions
