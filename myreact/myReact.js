import { App } from ".";

class MyReact {
  constructor() {
    this.state = [];
    this.stateIdx = 0;
    this.isRendering = false;
    this.oldVirtualDOM = null;
    this.container = null;
    this.updateQueue = [];
    this.isUpdateScheduled = false;
  }

  // Batching mechanism: Queue updates and process them in a single render cycle
  scheduleUpdate = () => {
    if (!this.isUpdateScheduled) {
      this.isUpdateScheduled = true;
      requestAnimationFrame(() => {
        this.renderApp();
        this.isUpdateScheduled = false;
      });
    }
  };

  createElement = (type, props = {}, ...children) => {
    return { type, props: { ...props, children: children.flat() }, key: props.key || null };
  };

  diff = (parent, oldNode, newNode, index = 0) => {
    const existingNode = parent.childNodes[index];

    // Case 1: New node is null - remove the old node
    if (!newNode) {
      if (existingNode) parent.removeChild(existingNode);
      return;
    }

    // Case 2: Old node is null - append the new node
    if (!oldNode) {
      parent.appendChild(this.createRealDOM(newNode));
      return;
    }

    // Case 3: Nodes are different - replace the old node with the new node
    if (this.hasNodeChanged(oldNode, newNode)) {
      parent.replaceChild(this.createRealDOM(newNode), existingNode);
      return;
    }

    // Case 4: Nodes are the same - update props and diff children
    if (newNode.type) {
      this.updateProps(existingNode, oldNode.props, newNode.props);

      const oldChildren = oldNode.props.children || [];
      const newChildren = newNode.props.children || [];
      const oldChildrenKeyed = this.createKeyedMap(oldChildren);
      const newChildrenKeyed = this.createKeyedMap(newChildren);

      const maxLength = Math.max(oldChildren.length, newChildren.length);
      for (let i = 0; i < maxLength; i++) {
        const oldChild = oldChildrenKeyed[newChildren[i]?.key] || oldChildren[i];
        this.diff(existingNode, oldChild, newChildren[i], i);
      }
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

    element.props.children
      .map(this.createRealDOM)
      .forEach((child) => domElement.appendChild(child));

    return domElement;
  };

  updateProps = (domElement, oldProps, newProps) => {
    for (let name in { ...oldProps, ...newProps }) {
      if (name === "children") continue;

      if (oldProps[name] !== newProps[name]) {
        if (name.startsWith("on")) {
          const eventType = name.toLowerCase().substring(2);
          if (oldProps[name]) domElement.removeEventListener(eventType, oldProps[name]);
          if (newProps[name]) domElement.addEventListener(eventType, newProps[name]);
        } else if (name === "style") {
          Object.assign(domElement.style, newProps[name] || {});
        } else if (name in domElement) {
          domElement[name] = newProps[name] || "";
        } else {
          if (newProps[name]) {
            domElement.setAttribute(name, newProps[name]);
          } else {
            domElement.removeAttribute(name);
          }
        }
      }
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

  render = (element, container) => {
    this.container = container;
    const newVirtualDOM = element;

    if (this.oldVirtualDOM) {
      this.diff(container, this.oldVirtualDOM, newVirtualDOM);
    } else {
      container.appendChild(this.createRealDOM(newVirtualDOM));
    }

    this.oldVirtualDOM = newVirtualDOM;
  };

  useState = (initVal) => {
    if (!this.isRendering) {
      throw new Error("useState can only be called during rendering");
    }

    const idx = this.stateIdx;

    if (this.state[idx] === undefined) {
      this.state[idx] = initVal;
    }

    const setState = (newVal) => {
      this.state[idx] = newVal;
      this.scheduleUpdate();
    };

    this.stateIdx++;
    return [this.state[idx], setState];
  };

  renderApp = () => {
    this.isRendering = true;
    this.stateIdx = 0;

    const root = this.container || document.getElementById("root");

    this.render(App(), root);

    this.isRendering = false;
    this.stateIdx = 0;
  };
}

const myReactInstance = new MyReact();

export const createElement = myReactInstance.createElement;
export const render = myReactInstance.render;
export const useState = myReactInstance.useState;
export const renderApp = myReactInstance.renderApp;


