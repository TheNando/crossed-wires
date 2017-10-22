module.exports = Auth;

Auth.$inject = [];

function Auth () {
  var vm = this;
  vm.authenticate = authenticate;

  activate();

  function activate () {
    vm.session = JSON.parse(localStorage.getItem('session'));
    vm.isAuthenticated = !!vm.session;
  }

  function authenticate (session) {
    vm.isAuthenticated = true;
    vm.session = {
      id: session.id,
      name: session.user.name,
      email: session.user.email,
      imageUrl: profile.getImageUrl()
    };
    localStorage.setItem('session', JSON.stringify(vm.session));
  }

  return vm;
}
