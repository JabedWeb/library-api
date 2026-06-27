class Engine {
  constructor() {}
  start() {
    console.log('Engine started');
  }
}

class Car {
  constructor(engine) {
    this.engine = engine;
  }
  drive(){
    this.engine.start();
  }
}

class AppService {
    constructor(){}
    getHello(){
        return 'Hello World!';
    }
    getUpdate(good){
        return good;
    }
}

class AppController {
    constructor(appService){
        this.appService = appService;
    }
    getHello(){
        return this.appService.getHello();
    }
    updateHello(good){
        return this.appService.getUpdate(good);
    }
}

// const appService = new AppService();
// const appController = new AppController(appService);

// console.log(appController.getHello());
// console.log(appController.updateHello('Goodbye World!'));


