import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { tictactoe } from './tictactoe.ts'

const app : HTMLDivElement = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="winner"></div>
  <div class="board"></div>
`
tictactoe(app);


