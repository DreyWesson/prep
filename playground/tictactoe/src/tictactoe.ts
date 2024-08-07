export function tictactoe(element: HTMLDivElement) {
  let curPlayer = "x";
  let winner = "";
  const arr = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));
  render(arr);
  function checkRows(array: number[][]) {
    let i,
      j = 0;
    for (i = 0; i < array.length; i++) {
      j = 0;
      const element: number = array[i][j];
      for (j; j < array[i].length; j++) {
        const element2 = array[i][j];
        if (element && element != element2) break;
        if (element && j === array.length - 1) {
          return [array[i][0], array[i][1], array[i][2]];
        }
      }
    }
    return [];
  }
  function checkCols(array: number[][]) {
    let i = 0;
    for (i = 0; i < array.length; i++) {
      const truth = array[0][i];
      if (truth && truth === array[1][i] && truth === array[2][i]) {
        return [array[0][i], array[1][i], array[2][i]];
      }
    }
    return [];
  }
  function checkDiags(arr: number[][]) {
    const center = arr[1][1];
    if (center && arr[0][0] === center && arr[2][2] === center) {
      return [arr[0][0], center, arr[2][2]];
    }
    if (center && arr[0][2] === center && arr[2][0] === center) {
      return [arr[0][2], center, arr[2][0]];
    }
    return [];
  }
  function checkWinner(arr: number[][]) {
    let res = checkCols(arr);
    if (res.length === 0) {
      res = checkRows(arr);
      if (res.length === 0) res = checkDiags(arr);
    }
    return res;
  }
  element.addEventListener("click", (e: Event) => {
    e.stopPropagation();
    if (winner) {
      alert(`We already have a winner ${winner}`);
      return;
    }

    const target = e.target as HTMLDivElement;
    if (!target.textContent) {
      target.textContent = curPlayer;
      const val = target.getAttribute("data-value")!.split(",");
      const idxOne = +val[0];
      const idxTwo = +val[1];
      arr[idxOne][idxTwo] = curPlayer;
      render(arr);
      const result = checkWinner(arr);
      if (result.length > 0) {
        winner = result[0].toString();
        declareWinner();
      }
      curPlayer = curPlayer === "x" ? "o" : "x";
    } else {
      alert("This spot is taken");
    }
  });
  function declareWinner() {
    const scoreBoard = document.querySelector(".winner")!;
    scoreBoard.textContent = `Player ${winner} wins`;
  }
  function render(arr: number[][]) {
    const board = element.querySelector(".board")!;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const div = document.createElement("div");
        div.setAttribute("data-value", `${i},${j}`);
        const content = (arr[i][j] && arr[i][j].toString()) || "";
        div.textContent = content;
        fragment.appendChild(div);
      }
    }
    board.replaceChildren(fragment);
  }
}
