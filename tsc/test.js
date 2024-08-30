const person = function (fname, lname) {
  return {
    firstName: fname,
    lastName: lname,
    fullName: function () {
      return this.firstName + " " + this.lastName;
    },
  };
};

const anotherPerson = {
  firstName: "Jane",
  lastName: "Smith",
};

console.log(person.fullName.call(anotherPerson, "Jane", "Smith"));
