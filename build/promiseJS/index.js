class MyPromise {
  constructor(executor) {
    this.state = 'pending';    // Initial state of the promise
    this.value = undefined;    // Holds the resolved value or rejection reason
    this.handlers = [];        // Stores the .then() and .catch() handlers

    // Bind resolve and reject functions to ensure 'this' is correct
    const resolve = this.resolve.bind(this);
    const reject = this.reject.bind(this);

    try {
      // Execute the executor function with resolve and reject
      executor(resolve, reject);
    } catch (error) {
      // If an error occurs in the executor, reject the promise
      reject(error);
    }
  }

  // Method to resolve the promise
  resolve(value) {
    // Ensure the promise can only be resolved once
    if (this.state !== 'pending') return;

    // Handle if the value is a promise
    if (value && typeof value.then === 'function') {
      return value.then(this.resolve.bind(this), this.reject.bind(this));
    }

    this.state = 'fulfilled';  // Update the state
    this.value = value;        // Store the resolved value
    this.executeHandlers();    // Execute any stored handlers
  }

  // Method to reject the promise
  reject(reason) {
    // Ensure the promise can only be rejected once
    if (this.state !== 'pending') return;

    this.state = 'rejected';   // Update the state
    this.value = reason;       // Store the rejection reason
    this.executeHandlers();    // Execute any stored handlers
  }

  // Method to register handlers for resolved or rejected state
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.addHandler({
        onFulfilled: function(value) {
          if (!onFulfilled) return resolve(value);
          try {
            resolve(onFulfilled(value));
          } catch (err) {
            reject(err);
          }
        },
        onRejected: function(reason) {
          if (!onRejected) return reject(reason);
          try {
            resolve(onRejected(reason));
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  // Method to handle rejection cases
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // Add a handler to the list of handlers
  addHandler(handler) {
    if (this.state === 'pending') {
      this.handlers.push(handler); // If pending, store the handler
    } else {
      this.executeHandler(handler); // If already resolved/rejected, execute immediately
    }
  }

  // Execute all stored handlers
  executeHandlers() {
    this.handlers.forEach(handler => this.executeHandler(handler));
    this.handlers = []; // Clear handlers after execution
  }

  // Execute a single handler based on the current state
  executeHandler(handler) {
    if (this.state === 'fulfilled') {
      if (typeof handler.onFulfilled === 'function') {
        handler.onFulfilled(this.value);
      }
    } else if (this.state === 'rejected') {
      if (typeof handler.onRejected === 'function') {
        handler.onRejected(this.value);
      }
    }
  }

  // Static method to create an already resolved promise
  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  // Static method to create an already rejected promise
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  // Static method to wait for multiple promises to resolve
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let results = [];
      let completed = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then(value => {
            results[index] = value;
            completed += 1;
            if (completed === promises.length) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  }
}

// Example usage:

const promise1 = new MyPromise((resolve) => {
  setTimeout(() => resolve('Result 1'), 1000);
});

const promise2 = new MyPromise((resolve) => {
  setTimeout(() => resolve('Result 2'), 500);
});

promise1
  .then(result => {
    console.log(result); // Logs "Result 1" after 1 second
    return promise2;
  })
  .then(result => {
    console.log(result); // Logs "Result 2" after an additional 500ms
  })
  .catch(error => {
    console.error('Error:', error);
  });
