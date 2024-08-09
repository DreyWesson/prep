// import { App } from ".";

// class MyReact {
//   constructor() {
//     this.state = [];              // Holds state values for components
//     this.stateIdx = 0;            // Index to track the current state in useState
//     this.isRendering = false;     // Flag to indicate if a render is happening
//     this.oldVDOM = null;          // Holds the previous virtual DOM for diffing
//     this.container = null;        // The root DOM element to render into
//     this.updateQueue = [];        // Queue to batch updates
//     this.isUpdateScheduled = false; // Flag to prevent multiple updates in the same frame
//   }

//   // Schedules an update to renderApp using requestAnimationFrame (batching mechanism)
//   scheduleUpdate = () => {
//     if (!this.isUpdateScheduled) {
//       this.isUpdateScheduled = true;
//       requestAnimationFrame(() => {
//         this.renderApp();        // Perform the rendering
//         this.isUpdateScheduled = false; // Reset the flag after rendering
//       });
//     }
//   };

//   // Creates a virtual DOM element
//   createElement = (type, props = {}, ...children) => {
//     return {
//       type,
//       props: { ...props, children: children.flat() }, // Flatten nested arrays of children
//       key: props.key || null, // Use the key if provided for keyed diffing
//     };
//   };

//   // Compares old and new virtual DOM nodes and updates the real DOM accordingly
//   diff = (parent, oldNode, newNode, index = 0) => {
//     const existingNode = parent.childNodes[index];

//     if (!newNode) { // New node doesn't exist, remove the old node
//       if (existingNode) parent.removeChild(existingNode);
//       return;
//     }

//     if (!oldNode) { // Old node doesn't exist, add the new node
//       parent.appendChild(this.createRealDOM(newNode));
//       return;
//     }

//     if (this.hasNodeChanged(oldNode, newNode)) { // Nodes have changed, replace the old with the new
//       parent.replaceChild(this.createRealDOM(newNode), existingNode);
//       return;
//     }

//     // If the node is the same type, update its properties and its children
//     if (newNode.type) {
//       this.updateProps(existingNode, oldNode.props, newNode.props);

//       const oldChildren = oldNode.props.children || [];
//       const newChildren = newNode.props.children || [];

//       const oldChildrenKeyed = this.createKeyedMap(oldChildren);
//       const newChildrenKeyed = this.createKeyedMap(newChildren);

//       const maxLength = Math.max(oldChildren.length, newChildren.length);
//       for (let i = 0; i < maxLength; i++) {
//         const oldChild = oldChildrenKeyed[newChildren[i]?.key] || oldChildren[i];
//         this.diff(existingNode, oldChild, newChildren[i], i);
//       }
//     }
//   };

//   // Creates a map of children keyed by their "key" prop, if available
//   createKeyedMap = (children) => {
//     return children.reduce((acc, child) => {
//       acc[child?.key || child] = child;
//       return acc;
//     }, {});
//   };

//   // Converts a virtual DOM element into a real DOM element
//   createRealDOM = (element) => {
//     if (typeof element === "string" || typeof element === "number") {
//       return document.createTextNode(String(element));
//     }

//     const domElement = document.createElement(element.type);
//     this.updateProps(domElement, {}, element.props);

//     element.props.children
//       .map(this.createRealDOM)
//       .forEach((child) => domElement.appendChild(child));

//     return domElement;
//   };

//   // Updates the properties of a DOM element based on the old and new props
//   updateProps = (domElement, oldProps, newProps) => {
//     for (let name in { ...oldProps, ...newProps }) {
//       if (name === "children") continue;

//       if (oldProps[name] !== newProps[name]) {
//         if (name.startsWith("on")) { // Event listener props
//           const eventType = name.toLowerCase().substring(2);
//           if (oldProps[name]) domElement.removeEventListener(eventType, oldProps[name]);
//           if (newProps[name]) domElement.addEventListener(eventType, newProps[name]);
//         } else if (name === "style") { // Style prop
//           Object.assign(domElement.style, newProps[name] || {});
//         } else if (name in domElement) { // Standard DOM property
//           domElement[name] = newProps[name] || "";
//         } else { // Attribute
//           if (newProps[name]) {
//             domElement.setAttribute(name, newProps[name]);
//           } else {
//             domElement.removeAttribute(name);
//           }
//         }
//       }
//     }
//   };

//   // Checks if two virtual DOM nodes are different
//   hasNodeChanged = (node1, node2) => {
//     return (
//       typeof node1 !== typeof node2 ||
//       ((typeof node1 === "string" || typeof node1 === "number") && node1 !== node2) ||
//       node1.type !== node2.type ||
//       node1.key !== node2.key
//     );
//   };

//   // Renders a virtual DOM element into the real DOM container
//   render = (element, container) => {
//     this.container = container;
//     const newVirtualDOM = element;

//     if (this.oldVDOM) {
//       this.diff(container, this.oldVDOM, newVirtualDOM); // Update the DOM based on the diff
//     } else {
//       container.appendChild(this.createRealDOM(newVirtualDOM)); // Initial render
//     }

//     this.oldVDOM = newVirtualDOM; // Save the new VDOM for the next render
//   };

//   // Manages state for components (like React's useState)
//   useState = (initialValue) => {
//     if (!this.isRendering) {
//       throw new Error("useState can only be called during rendering");
//     }

//     const idx = this.stateIdx;

//     if (this.state[idx] === undefined) {
//       this.state[idx] = initialValue;
//     }

//     const setState = (newValue) => {
//       this.state[idx] = newValue;
//       this.scheduleUpdate(); // Re-render when state changes
//     };

//     this.stateIdx++;
//     return [this.state[idx], setState];
//   };

//   // Triggers the rendering of the entire app
//   renderApp = () => {
//     this.isRendering = true;
//     this.stateIdx = 0;

//     const root = this.container || document.getElementById("root");

//     this.render(App(), root);

//     this.isRendering = false;
//     this.stateIdx = 0;
//   };
// }

// // Create a single instance of MyReact to be used throughout the app
// const myReactInstance = new MyReact();

// // Export functions to be used in the app
// export const createElement = myReactInstance.createElement;
// export const render = myReactInstance.render;
// export const useState = myReactInstance.useState;
// export const renderApp = myReactInstance.renderApp;


import { App } from ".";

class MyReact {
  constructor() {
    this.state = [];
    this.stateIdx = 0;
    this.isRendering = false;
    this.oldVDOM = null;
    this.container = null;
    this.isUpdateScheduled = false;
  }

  // Public Methods
  createElement = (type, props = {}, ...children) => {
    return {
      type,
      props: { ...props, children: children.flat() },
      key: props.key || null,
    };
  };

  render = (element, container) => {
    this.container = container;
    const newVirtualDOM = element;

    if (this.oldVDOM) {
      this.diff(container, this.oldVDOM, newVirtualDOM);
    } else {
      container.appendChild(this.createRealDOM(newVirtualDOM));
    }

    this.oldVDOM = newVirtualDOM;
  };

  useState = (initialValue) => {
    if (!this.isRendering) {
      throw new Error("useState can only be called during rendering");
    }

    const idx = this.stateIdx;

    if (this.state[idx] === undefined) {
      this.state[idx] = initialValue;
    }

    const setState = (newValue) => {
      this.state[idx] = newValue;
      this.scheduleUpdate();
    };

    this.stateIdx++;
    return [this.state[idx], setState];
  };

  renderApp = () => {
    this.startRender();
    const root = this.container || document.getElementById("root");
    this.render(App(), root);
    this.endRender();
  };

  // Private Methods
  startRender = () => {
    this.isRendering = true;
    this.stateIdx = 0;
  };

  endRender = () => {
    this.isRendering = false;
    this.stateIdx = 0;
  };

  processUpdate = () => {
    this.renderApp();
    this.isUpdateScheduled = false;
  };

  scheduleUpdate = () => {
    if (!this.isUpdateScheduled) {
      this.isUpdateScheduled = true;
      requestAnimationFrame(() => this.processUpdate())
    }
  };

  diff = (parent, oldNode, newNode, index = 0) => {
    const existingNode = parent.childNodes[index];

    if (!newNode) {
      if (existingNode) parent.removeChild(existingNode);
      return;
    }

    if (!oldNode) {
      parent.appendChild(this.createRealDOM(newNode));
      return;
    }

    if (this.hasNodeChanged(oldNode, newNode)) {
      parent.replaceChild(this.createRealDOM(newNode), existingNode);
      return;
    }

    if (newNode.type) {
      this.updateProps(existingNode, oldNode.props, newNode.props);
      this.diffChildren(existingNode, oldNode.props.children, newNode.props.children);
    }
  };

  diffChildren = (parent, oldChildren = [], newChildren = []) => {
    const oldChildrenKeyed = this.createKeyedMap(oldChildren);
    const newChildrenKeyed = this.createKeyedMap(newChildren);

    const maxLength = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < maxLength; i++) {
      const oldChild = oldChildrenKeyed[newChildren[i]?.key] || oldChildren[i];
      this.diff(parent, oldChild, newChildren[i], i);
    }
  };

  createKeyedMap = (children) => {
    return children.reduce((acc, child) => {
      acc[child?.key || child] = child;
      return acc;
    }, {});
  };

  createRealDOM = (element) => {
    if (typeof element === "string" || typeof element === "number") {
      return document.createTextNode(String(element));
    }

    const domElement = document.createElement(element.type);
    this.updateProps(domElement, {}, element.props);
    this.appendChildren(domElement, element.props.children);
    return domElement;
  };

  appendChildren = (domElement, children) => {
    children.map(this.createRealDOM).forEach((child) => domElement.appendChild(child));
  };

  updateProps = (domElement, oldProps, newProps) => {
    this.removeOldProps(domElement, oldProps, newProps);
    this.addNewProps(domElement, oldProps, newProps);
  };

  removeOldProps = (domElement, oldProps, newProps) => {
    for (let name in oldProps) {
      if (name === "children") continue;
      if (!(name in newProps)) {
        this.removeProp(domElement, name, oldProps[name]);
      }
    }
  };

  addNewProps = (domElement, oldProps, newProps) => {
    for (let name in newProps) {
      if (name === "children") continue;
      if (newProps[name] !== oldProps[name]) {
        this.setProp(domElement, name, newProps[name]);
      }
    }
  };

  removeProp = (domElement, name, value) => {
    if (name.startsWith("on")) {
      domElement.removeEventListener(name.toLowerCase().substring(2), value);
    } else if (name === "style") {
      domElement.style = "";
    } else if (name in domElement) {
      domElement[name] = "";
    } else {
      domElement.removeAttribute(name);
    }
  };

  setProp = (domElement, name, value) => {
    if (name.startsWith("on")) {
      const eventType = name.toLowerCase().substring(2);
      domElement.addEventListener(eventType, value);
    } else if (name === "style") {
      Object.assign(domElement.style, value || {});
    } else if (name in domElement) {
      domElement[name] = value;
    } else {
      domElement.setAttribute(name, value);
    }
  };

  hasNodeChanged = (node1, node2) => {
    return (
      typeof node1 !== typeof node2 ||
      ((typeof node1 === "string" || typeof node1 === "number") && node1 !== node2) ||
      node1.type !== node2.type ||
      node1.key !== node2.key
    );
  };
}

// Create a single instance of MyReact to be used throughout the app
const myReactInstance = new MyReact();

// Export functions to be used in the app
export const createElement = myReactInstance.createElement;
export const render = myReactInstance.render;
export const useState = myReactInstance.useState;
export const renderApp = myReactInstance.renderApp;

