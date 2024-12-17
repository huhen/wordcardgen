// TableComponent.jsx
import React from "react";

function TableComponent({ lines, rows, cols }) {
  return (
    <table border="1" cellPadding="5">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: cols }, (_, colIndex) => (
            <td key={`${rowIndex}-${colIndex}`}>
              {lines[rowIndex * cols + colIndex] || ""}
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}

export default TableComponent;
