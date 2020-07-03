// ADDING DECORATOR TO THE CLASS
// decorator is at the end just an function

//decorator
// function Logger(constructor: Function) {
//   // target or constructor
//   console.log("Logging...");
//   console.log(constructor);
// }

//decorator factory
function Logger(logString: string) {
  // functions that returns new function
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function withTemplate(template: string, hookId: string) {
  return function (constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector("h1")!.textContent = p.name;
    }
  };
}
// @Logger("Logging - person")
@withTemplate("<h1>My person object </h1>", "app")
class Person {
  name = "Zox";

  constructor() {
    console.log("Creating person object.");
  }
}

const pers = new Person();

console.log(pers);
