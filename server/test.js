class MyClass {
	constructor() {
		this.myArray = ["foo", "bar"];
		this.myString = "foobar";
		this.myFunction();
	}
	myFunction() {
		this.myArray.forEach(function(index) {
			console.log(index);
			console.log(this.myString);	// TypeError???
		}.bind(this));
	}
}

var x = new MyClass;