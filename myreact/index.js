import { renderApp, useState, createElement } from "./myReact";
// import { renderApp, useState, createElement } from "./myReact_func";

export const App = () => {
  const [count, setCount] = useState(0);

  return createElement(
    'div',
    {},
    createElement('h1', {}, `Count: ${count}`),
    createElement(
      'button',
      { onClick: () => setCount(count + 1) },
      'Increment'
    )
  );
};

renderApp();
