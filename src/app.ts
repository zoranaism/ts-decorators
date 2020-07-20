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
  console.log("logger factory");

  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function withTemplate(template: string, hookId: string) {
  console.log("template factory");
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T
  ) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        // use underscore if it doesnt matter and TS should ignore it
        super();
        console.log("Rendering template");
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}
// @Logger("Logging - person")
@Logger("LOGGING")
@withTemplate("<h1>My person object </h1>", "app")
class Person {
  name = "Zox";

  constructor() {
    console.log("Creating person object.");
  }
}

const pers = new Person();

console.log(pers);

// ---

// decorator
function Log(target: any, propertyName: string) {
  console.log("Property decorator");
  console.log(target);
  console.log(propertyName);
}
function Log2(target: any, name: string, descriptior: PropertyDescriptor) {
  console.log("accessor decorator");
  console.log(target);
  console.log(name);
  console.log(descriptior);
}

function Log3(
  target: any,
  name: string | Symbol,
  descriptior: PropertyDescriptor
) {
  console.log("Method decorator");
  console.log(target);
  console.log(name);
  console.log(descriptior);
}

function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Parameter decorator");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  // when class definition registered by JS it is instantiated, but it will be executed when officially instanciated
  // decoretors dont render when you call them, but then they are defined
  // tye are additional setup work for the class
  // they are not event listeners
  // adding extra functionalities behind the scenes
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid price - should be positive!");
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const p1 = new Product("Book", 19);
const p2 = new Product("Book 2", 29);

function Autobind(_: any, _2: string, descriptior: PropertyDescriptor) {
  const originalMethod = descriptior.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor; // gonna replace descriptior with the new one
}

class Printer {
  message = "This works";

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector("button")!;
button.addEventListener("click", p.showMessage);

// ---

interface ValidatorConfig {
  [property: string]: {
    [validatableProperty: string]: string[]; // ["requiered", "positive", ]
  };
}

const registeredValidators: ValidatorConfig = {};

function Requiered(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: ["requiered"],
  };
}

function PositiveNumber(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: ["positive"],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig) {
    console.log(prop);
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Requiered
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

// Validate fethed data for example

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  // if (title.trim().length > 0) {} // standard validation

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert("Invalid input");
    return;
  }
  console.log(createdCourse);
});
