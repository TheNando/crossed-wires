'use strict'

const _ = require('lodash')
const Countdown = require('./countdown')
const Db = require('./db')
const fs = require('fs')
const Utils = require('./utils')

const dataPath = './server/data/questions.json'
const questionsDir = './server/questions/'

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
  constructor() {
    this.answers = {}
    this.current = null

    // Try and load data from json file before trying raw questions
    Object.assign(this, Questions.fromJson(dataPath))

    // If that failed, load raw questions
    if (_.isEmpty(this.items)) {
      Object.assign(this, Questions.fromDir(questionsDir))
    }

    // Prepare next quesion (which will become first question)
    this.next = this.random()
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
  static fromDir(dir) {
    let items = []
    let categories = []

    fs.readdirSync(dir).forEach((category) => {
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
  static fromJson(path) {
    let items = Utils.readJsonSync(path).map((item) => ({
      ...item,
      answer: item.choices.findIndex((choice) => choice === item.answer),
    }))

    let categories = _(items)
      .map('category')
      .uniq()
      .value()
    return { items, categories }
  }

  /**
   * Retrieve question items array from text file.
   *
   * @param {string} path - The path string of text file containing question
   *                        data.
   * @return {Array} An array containing of question items.
   */
  static fromText(path) {
    let questions = []
    let question = {}

    let content = fs.readFileSync(questionsDir + path, 'utf8')

    content.split('\n').forEach((line) => {
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
   * Submit a quiz answer
   *
   * @param {string} id
   * @param {Object} data
   * @memberof Questions
   */
  answer(id, data) {
    this.answers[id] = { ...data, id, time: Date.now() }
  }

  /**
   * Retrieve currently active question.
   *
   * @return {Object} Currently active question.
   */
  get() {
    return this.current
  }

  /**
   * Get info on currently loaded questions
   *
   * @return {Object} Object containing info on currently loaded questions.
   */
  info() {
    // Create object with keys for each category and zero values to hold totals
    let info = _.zipObject(
      this.categories,
      _.range(0, this.categories.length, 0)
    )

    // Count number of items for each category
    _.forEach(this.items, (item) => (info[item.category] += 1))

    return info
  }

  async nextEvent() {
    this.processAnswers()
    this.setNext()
  }

  /**
   * Assign points for correct answers
   */
  processAnswers() {
    let totalDuration = 0
    const correctMap = Object.values(this.answers).reduce((agg, item) => {
      // Exit if answer is incorrect
      if (item.answer !== this.current.answer) {
        return agg
      }

      // Set default if undefined
      if (!agg[item.robot]) {
        agg[item.robot] = {
          name: item.robot,
          duration: 0,
        }
      }

      // Running total of remaining time on correct answer per robot
      const duration = this.current.expires - item.time
      agg[item.robot].duration += duration

      // Running total of all remaining time
      totalDuration += duration
      return agg
    }, {})

    // Calculate percentage earned
    const correct = Object.values(correctMap).map((item) => ({
      ...item,
      percentage: item.duration / totalDuration,
    }))

    // TODO: Increase team bits by percentage times BASE REWARD
    console.log('Correct:')
    console.log(correct)
    this.answers = {}
  }

  /**
   * Retrieve a random question from all loaded questions.
   *
   * @return {Object} A question.
   */
  random() {
    return _.sample(this.items)
  }

  /** Save currently loaded question data to JSON file */
  save() {
    fs.writeFile(dataPath, JSON.stringify(this.items))
  }

  /** Set currently loaded question to next available question */
  async setNext(nextTime) {
    console.log('Setting next question')
    this.current = this.next
    this.current.expires = Countdown.nextTime

    this.next = this.random()
    this.current.nextCategory = this.next.category

    console.log(this.current)

    Db.collection('question')
      .doc('current')
      .set(this.current)
  }
}

module.exports = Questions
