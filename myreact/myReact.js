import { App } from ".";

class MyReact {
  constructor() {
    this.state = [];
    this.setters = [];
    this.stateIdx = 0;
    this.isRendering = false;
  }

  createElement = (type, props = {}, ...children) => {
    return { type, props: { ...props, children } };
  };

  render = (element, container) => {
    if (typeof element === "string" || typeof element === "number") {
      container.appendChild(document.createTextNode(String(element)));
      return;
    }

    const domElement = document.createElement(element.type);

    if (element.props) {
      Object.keys(element.props)
        .filter((key) => key !== "children")
        .forEach((key) => {
          if (key.startsWith("on")) {
            const eventType = key.toLowerCase().substring(2);
            domElement.addEventListener(eventType, element.props[key]);
          } else {
            domElement[key] = element.props[key];
          }
        });
    }

    if (element.props.children) {
      element.props.children.forEach((child) => this.render(child, domElement));
    }

    container.appendChild(domElement);
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
      this.renderApp();
    };

    this.stateIdx++;
    return [this.state[idx], setState];
  };

  renderApp = () => {
    this.isRendering = true;
    this.stateIdx = 0;
    const root = document.getElementById("root");
    root.innerHTML = "";

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
