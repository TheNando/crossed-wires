class LoginController {

  constructor($http) {
    this.robots = $http.get('http://localhost:3000/robots')
      .then(response => response.data
          .sort((a,b) => a.name > b.name)
          .sort((a,b) => a.team > b.team)
      )

    $http.post('http://localhost:3000/names/generate')
      .then(response => this.handle = response.data)

    this._post = $http.post
  }

  $onInit() {
  }

  login() {
    const payload = {
      email: this.email,
      handle: this.handle,
      robot: this.robot.name
    }
    this._post('http://localhost:3000/login', payload)
  }
}

module.exports = {
  controller: LoginController,
  templateUrl: './pages/login/login.html',
  bindings: {}
};
