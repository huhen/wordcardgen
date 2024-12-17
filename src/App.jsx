// App.jsx
import React, { useState } from "react";
import "./App.css";
import TableComponent from "./TableComponent";
import testLines from "./testLines"; // Импорт массива строк из отдельного файла

function App() {
  const [inputValue, setInputValue] = useState("");
  const [savedLines, setSavedLines] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [tableSize, setTableSize] = useState("6x6");
  const [tableCount, setTableCount] = useState(200);

  const fillTestLines = () => {
    setInputValue(testLines.join("\n"));
    validateInput(testLines.join("\n"));
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    validateInput(newValue);
  };

  const validateInput = (value) => {
    const lines = value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const uniqueLines = Array.from(new Set(lines));
    setSavedLines(uniqueLines); // Сохраняем только уникальные строки
    const duplicateLines = lines.filter(
      (line, index) => lines.indexOf(line) !== index
    );

    if (duplicateLines.length > 0) {
      setErrorMessages(duplicateLines);
    } else {
      setErrorMessages([]);
    }
  };

  const clearInput = () => {
    setInputValue("");
    setSavedLines([]);
    setErrorMessages([]);
  };

  const handleTableSizeChange = (event) => {
    setTableSize(event.target.value);
  };

  const handleTableCountChange = (event) => {
    setTableCount(Number(event.target.value));
  };

  const generateTables = () => {
    const [rows, cols] = tableSize.split("x").map(Number);
    if (savedLines.length < rows * cols) {
      alert(
        `Необходимо минимум ${
          rows * cols
        } строк для заполнения таблицы размером ${tableSize}`
      );
    } else {
      setErrorMessages([]);
    }
  };

  function areAllNumbersUnique(numbers) {
    return new Set(numbers).size === numbers.length;
  }

  const [rows, cols] = tableSize.split("x").map(Number);

  // Функция для создания случайного набора уникальных значений для всех таблиц
  const getDistributedLines = (lines, count) => {
    const distributedLines = [];
    for (let i = 0; i < count; i++) {
      distributedLines.push([]);
    }

    if (lines.length < rows * cols) return distributedLines;

    let tempLines = [...lines]; // Создаем копию массива строк

    let allDone = false;
    while (!allDone) {
      for (let i = 0; i < count; i++) {
        if (distributedLines[i].length >= rows * cols) continue;
        const randomIndex = Math.floor(Math.random() * tempLines.length);
        if (!distributedLines[i].includes(tempLines[randomIndex])) {
          distributedLines[i].push(tempLines[randomIndex]);
        }
        tempLines.splice(randomIndex, 1); // Удаляем использованную строку из копии массива
        if (tempLines.length == 0) tempLines = [...lines];
      }

      allDone = true;
      for (let i = 0; i < count; i++) {
        if (distributedLines[i].length >= rows * cols) continue;
        allDone = false;
        break;
      }

      if (allDone) {
        tempLines = [...lines];

        for (let i = 0; i < tempLines.length; i++) {
          const k = [];
          for (let j = 0; j < count; j++) {
            const index = distributedLines[j].indexOf(tempLines[i]);
            if (index >= 0) k.push(index);
          }

          //if (!areAllNumbersUnique(k)) {
          //  alert(
          //    `Позиция строки &quot;${tempLines[i]}&quot; неуникальна: ${k.join(", ")}`
          //  );
          //}
        }
      }
    }

    return distributedLines;
  };

  return (
    <div className="App">
      <h1>Генератор карточек</h1>
      {errorMessages.length > 0 && (
        <div style={{ color: "red" }}>
          Повторяющиеся строки: {errorMessages.join(", ")}
        </div>
      )}
      <div>Количество уникальных строк: {savedLines.length}</div>
      <textarea
        value={inputValue}
        onChange={handleChange}
        placeholder="Введите строки, каждая с новой строки"
        rows={10}
        cols={50}
      />
      <div>
        <button onClick={clearInput}>Очистить</button>
        <button onClick={fillTestLines} style={{ marginLeft: "10px" }}>
          Тест
        </button>
        <div>
          Размер таблицы:
          <input
            style={{ marginLeft: "10px" }}
            type="text"
            value={tableSize}
            onChange={handleTableSizeChange}
            placeholder="Введите размер таблицы (например, 6x6)"
          />
        </div>
        <div>
          Количество таблиц:
          <input
            style={{ marginLeft: "10px" }}
            type="number"
            min="1"
            step="1"
            value={tableCount}
            onChange={handleTableCountChange}
            placeholder="Введите количество таблиц"
          />
        </div>
      </div>

      <button onClick={generateTables}>Генерировать</button>

      {getDistributedLines(savedLines, tableCount).map(
        (linesForTable, index) => (
          <div key={index} style={{ marginTop: "20px" }}>
            <TableComponent lines={linesForTable} rows={rows} cols={cols} />
          </div>
        )
      )}
    </div>
  );
}

export default App;
