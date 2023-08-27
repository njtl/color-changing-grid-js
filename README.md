# Interactive Color-Changing Grid Application

This project requires an app to be developed using the React.js framework. The app displays an interactive 10x10 grid, with each cell initially colored white.

The app needs to utilize the `chroma-js` library to generate a color gradient scale needed for the cell colors. The color scales are defined as `['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF']`.

## Requirements

- Each cell of the grid should respond to a click event. Upon clicking, the selected cell's color should change. If the same cell is clicked multiple times, the cell's color should iterate through the initial color palette with each click.
  
- The app should also respond to the mouse being moved while the mouse button is pressed down. Any cell the mouse moves over during this action should respond as if it had been clicked, invoking a change in color.

- When a cell's color changes, only the cells found in the same row (x-axis) and the same column (y-axis) as the selected cell should gradually change color as well.

- The color change should be animated, starting from the clicked cell and moving outward to the furthest cells in the same row and column.

- For color transitioning, a smooth animation effect should be applied.

- The app layout should be responsive, where the min-height and min-width span to the full viewport.

## Technical Details

- Use React.js for building the user interface. React hooks are needed to manage state and side-effects.

- The `chroma-js` library will be used to generate the color gradient scale needed for cell coloring. The color of a cell is determined by the `chroma.scale` method.

- For event handling you will need to work with React MouseEvents, specifically `onClick` and `onMouseMove`. Furthermore, listen for `mousedown` and `mouseup` events on the window object to track when the mouse button is pressed or released, respectively.

- CSS transitions should be used for creating smooth color change animations.

## Design

- Apply a minimal design approach.
- Grid cells should have a distinguishable border.
- The displayed grid should be centralized both vertically and horizontally.

## Testing

- Functional Testing: Verify that upon clicking a cell, the color of the cell changes. Verify that when the mouse is dragged over cells, the cells respond as if clicked, meaning their color changes.
  
- Color Change Testing: Verify that when a cell's color changes, only the cells in the same row and column change color too.

- Animation Testing: Verify that color change animation creates a smooth transition.

## Deliverables

- The React.js source code of the application.
- A working demo of the application if possible.
- A markdown document like this one explaining the solution and how to use it.