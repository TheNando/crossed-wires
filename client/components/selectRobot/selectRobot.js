class selectRobotController {

  constructor() {
    this.selected = undefined
    this.isShowing = false

  }
  
  $onInit() {
    this.robots.then(robots => this.robots = robots)
  }
  
  select(index) {
    this.index = index
    this.selected = this.robots[index]
    this.isShowing = false
    this.ngModel = this.selected
  }

  show() {
    this.isShowing = true
  }

}

module.exports = {
  controller: selectRobotController,
  templateUrl: './components/selectRobot/selectRobot.html',
  bindings: {
    ngModel: '=',
    robots: '<'
  }
};
