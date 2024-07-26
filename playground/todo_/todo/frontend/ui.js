export const ui = `
    <div>
      <form type="action">
        <label for="input">
          <input type="text" id="todo-input" class="todo-input" name="todo" placeholder="Enter todo" />
        </label>
        <button type="button" name="search" id="search-todo" data-testid="search-todo-btn">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <button name="add" type="button" id="add-todo" data-testid="add-todo-btn">
          <i class="fa-solid fa-plus"></i>
        </button>
        <select name="filter" id="filter-input">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </form>
    </div>
    <div class="">
      <ul class="todo-list" id="todo-list"></ul>
    </div>
`
