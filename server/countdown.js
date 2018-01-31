'use strict'

const REFRESH_INTERVAL = 20 * 1000

/** Class used to execute a set of actions on an interval. */
class Countdown {
    /**
     * Create an instance of Countdown class.
     *
     * Set interval to execute registered actions on refresh interval
     */
    constructor (interval) {
        this.actions = {}
        this.keys = []
        this.nextTime = Date.now() + REFRESH_INTERVAL

        // Bind 'this' so execute can access instance within setInterval
        setInterval(this.execute.bind(this), interval, this)
    }


    /**
     * Add a function to actions dictionary which will be executed once every
     * set interval
     *
     * @param {string} key - A string to uniquly identify this action.
     * @param {function} action - The function to execute.
     */
    register (key, action) {
        this.actions[key] = action
        this.keys = Object.keys(this.actions)
    }

    /**
     * Execute each action in local dictionary. Passed to the setInterval
     * function. Not intended to be used manually.
     */
    execute () {
        let index = 0;
        const max = this.keys.length

        for(; index < max ;) {
            setImmediate(this.actions[this.keys[index++]])
        }

        this.nextTime = Date.now() + REFRESH_INTERVAL
    }
}

const singleton = new Countdown(REFRESH_INTERVAL)

module.exports = singleton
