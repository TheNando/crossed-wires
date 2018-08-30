'use strict'

const REFRESH_INTERVAL = 1000 * 1000

/** Class used to execute a set of actions on an interval. */
class Countdown {
  /**
   * Create an instance of Countdown class.
   */
  constructor() {
    this.actions = []
    this.nextTime = 0
  }

  /**
   * Add a function to actions queue which will be executed once every set
   * interval
   *
   * @param {string} key - A string to uniquly identify this action.
   * @param {function} action - The function to execute.
   */
  register(key, action) {
    this.actions.push({ key, action })
  }

  setNextTime() {
    this.nextTime = Date.now() + REFRESH_INTERVAL
  }

  start() {
    setTimeout(this.execute.bind(this), 0, this.actions)
    setInterval(this.execute.bind(this), REFRESH_INTERVAL, this.actions)
  }

  /** Asynchronously execute each action in queue. Not for manual use. */
  execute(actions) {
    this.setNextTime()
    Promise.all(actions.map((item) => item.action(this.nextTime)))
  }
}

const singleton = new Countdown()

module.exports = singleton
