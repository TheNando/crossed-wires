class LoginController {

  constructor($http) {
    this.robots = $http.get('https://crossed-wires.firebaseio.com/robots.json')
      .then(robots => Object.values(robots.data)
        .sort((a,b) => a.name > b.name)
        .sort((a,b) => a.team > b.team)
      )
  }

  $onInit() {
  }

}

module.exports = {
  controller: LoginController,
  templateUrl: './components/login/login.html',
  bindings: {}
};
