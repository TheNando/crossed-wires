class CommandController {

  constructor ($state) {
    this.$state = $state;
  }

  $onInit () {
    const ctrl = this;
    // let collection = 'games';
    // let query = {};

    // // Load all games
    // this.DS(collection)
    //   .query(query)
    //   .$promise
    //   .then(items => {
    //     ctrl.items = items;
    //     ctrl.ABS.context = collection
    //   });
  }

  // openGame (id) {
  //   this.$state.go('game', { gameId: id });
  // }

  // openTemplate (id) {
  //   this.$state.go('template', { templateId: id });
  // }
}

module.exports = {
  controller: CommandController,
  templateUrl: './components/command/command.html'
}