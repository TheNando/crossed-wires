'use strict'

const REFRESH_INTERVAL = 200 * 1000

/** Class used to execute a set of actions on an interval. */
class Countdown {
  /**
   * Create an instance of Countdown class.
   *
   * Set interval to execute registered actions on refresh interval
   */
  constructor(interval) {
    this.actions = []
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

  start() {
    setTimeout(this.execute, 0, this.actions)
    setInterval(this.execute, REFRESH_INTERVAL, this.actions)
  }

  /** Asynchronously execute each action in queue. Not for manual use. */
  execute(actions) {
    const nextTime = Date.now() + REFRESH_INTERVAL
    Promise.all(actions.map((item) => item.action(nextTime)))
  }
}

const singleton = new Countdown()

module.exports = singleton
