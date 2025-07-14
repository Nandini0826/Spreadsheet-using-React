import React, { useMemo, useState, useRef } from "react";
import { useTable } from "react-table";
import {
  FaEyeSlash,
  FaSort,
  FaFilter,
  FaPlus,
  FaUndo,
  FaRedo,
  FaFileAlt,
  FaFolderOpen,
  FaSave,
} from "react-icons/fa";

// Utility for class names
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const defaultRows = 28;
const columnHeaders = [
  "Job Request",
  "Submitted",
  "Status",
  "Submitter",
  "URL",
  "Assigned",
  "Priority",
  "Due Date",
  "Est. Value",
];

const statusOptions = ["In-Process", "Need to Start", "Blocked", "Complete"];
const priorityOptions = ["High", "Medium", "Low"];

const statusColors = {
  "In-Process": "bg-yellow-200 text-yellow-800",
  "Need to Start": "bg-gray-200 text-gray-800",
  "Blocked": "bg-red-200 text-red-800",
  "Complete": "bg-green-200 text-green-800",
};

function Toolbar({
  onNew,
  onOpen,
  onSave,
  onUndo,
  onRedo,
  onAddRow,
  onHideFields,
  onShowFields,
  onSort,
  canUndo,
  canRedo,
  hiddenColumns,
  filterStatus,
  setFilterStatus,
}) {
  const fileInputRef = useRef();

  return (
    <div className="flex items-center px-4 py-2 bg-white border-b shadow-sm">
      <span className="flex items-center text-gray-700 text-sm font-medium select-none mr-4" style={{ userSelect: "none" }}>
        <FaFileAlt className="mr-2" /> Spreadsheet Toolbar
      </span>
      <button className="flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2" title="New" onClick={onNew}>
        <FaFileAlt className="mr-1" /> New
      </button>
      <button className="flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2" title="Open" onClick={() => fileInputRef.current.click()}>
        <FaFolderOpen className="mr-1" /> Open
        <input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={onOpen} />
      </button>
      <button className="flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2" title="Save" onClick={onSave}>
        <FaSave className="mr-1" /> Save
      </button>
      <button className={classNames("flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2", !canUndo && "opacity-50 cursor-not-allowed")} title="Undo" onClick={onUndo} disabled={!canUndo}>
        <FaUndo className="mr-1" /> Undo
      </button>
      <button className={classNames("flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2", !canRedo && "opacity-50 cursor-not-allowed")} title="Redo" onClick={onRedo} disabled={!canRedo}>
        <FaRedo className="mr-1" /> Redo
      </button>
      <button className="flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2" title="Add Row" onClick={onAddRow}>
        <FaPlus className="mr-1" /> Add Row
      </button>
      {hiddenColumns.length === 0 ? (
        <button className="flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2" title="Hide Fields" onClick={onHideFields}>
          <FaEyeSlash className="mr-1" /> Hide Fields
        </button>
      ) : (
        <button className="flex items-center text-green-600 text-sm font-normal cursor-pointer select-none mr-2" title="Show Fields" onClick={onShowFields}>
          <FaEyeSlash className="mr-1" /> Show Fields
        </button>
      )}
      <button className="flex items-center text-gray-700 text-sm font-normal cursor-pointer select-none mr-2" title="Sort by Job Request" onClick={onSort}>
        <FaSort className="mr-1" /> Sort
      </button>
      <span className="flex items-center text-gray-700 text-sm font-normal select-none mr-2">
        <FaFilter className="mr-1" />
        <select className="border border-gray-300 rounded px-1 py-0.5 ml-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Filter Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </span>
    </div>
  );
}

function Spreadsheet({
  data,
  setData,
  pushHistory,
  editingCell,
  setEditingCell,
  hiddenColumns,
  filterStatus,
}) {
  const columns = useMemo(() => (
    columnHeaders
      .filter(header => !hiddenColumns.includes(header))
      .map(header => {
        if (header === "Status") {
          return {
            Header: header,
            accessor: header,
            Cell: ({ value, row, column }) => {
              const isEditing = editingCell.row === row.index && editingCell.col === column.id;
              return isEditing ? (
                <select
                  autoFocus
                  value={value}
                  onBlur={() => setEditingCell({ row: null, col: null })}
                  onChange={e => {
                    const newData = [...data];
                    newData[row.index][column.id] = e.target.value;
                    setData(newData);
                    pushHistory(newData);
                    setEditingCell({ row: null, col: null });
                  }}
                  className="w-full px-1 focus:outline-none focus:ring focus:ring-green-600"
                  style={{ minWidth: 0 }}
                >
                  <option value="">Select</option>
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <span
                  className={classNames("block px-2 py-1 rounded cursor-pointer", statusColors[value])}
                  onClick={() => setEditingCell({ row: row.index, col: column.id })}
                >
                  {value}
                </span>
              );
            },
          };
        }
        if (header === "Priority") {
          return {
            Header: header,
            accessor: header,
            Cell: ({ value, row, column }) => {
              const isEditing = editingCell.row === row.index && editingCell.col === column.id;
              return isEditing ? (
                <select
                  autoFocus
                  value={value}
                  onBlur={() => setEditingCell({ row: null, col: null })}
                  onChange={e => {
                    const newData = [...data];
                    newData[row.index][column.id] = e.target.value;
                    setData(newData);
                    pushHistory(newData);
                    setEditingCell({ row: null, col: null });
                  }}
                  className="w-full px-1 focus:outline-none focus:ring focus:ring-green-600"
                  style={{ minWidth: 0 }}
                >
                  <option value="">Select</option>
                  {priorityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <span
                  className="block px-2 py-1 rounded cursor-pointer"
                  onClick={() => setEditingCell({ row: row.index, col: column.id })}
                >
                  {value}
                </span>
              );
            },
          };
        }
        // Default: text input on click, otherwise plain text
        return {
          Header: header,
          accessor: header,
          Cell: ({ value, row, column }) => {
            const isEditing = editingCell.row === row.index && editingCell.col === column.id;
            return isEditing ? (
              <input
                autoFocus
                type="text"
                value={value}
                onChange={e => {
                  const newData = [...data];
                  newData[row.index][column.id] = e.target.value;
                  setData(newData);
                }}
                onBlur={() => {
                  pushHistory([...data]);
                  setEditingCell({ row: null, col: null });
                }}
                className="w-full h-full px-1 py-1 focus:outline-none focus:ring focus:ring-green-600"
              />
            ) : (
              <span
                className="block px-2 py-1 cursor-pointer"
                onClick={() => setEditingCell({ row: row.index, col: column.id })}
              >
                {value}
              </span>
            );
          },
        };
      })
  ), [data, editingCell, hiddenColumns]);

  const filteredData = useMemo(() => {
    if (!filterStatus) return data;
    return data.filter(row => row["Status"] === filterStatus);
  }, [data, filterStatus]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: filteredData });

  return (
    <div className="h-[calc(100vh-56px)] w-screen overflow-auto bg-white">
      <table {...getTableProps()} className="border-collapse table-fixed w-full h-full">
        <thead className="bg-gray-200">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-xs">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="border border-gray-400 px-1 py-1 text-gray-700">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="text-xs">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="border border-gray-300 p-0">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  // State for spreadsheet data and history for undo/redo
  const [data, setData] = useState(
    Array.from({ length: defaultRows }, () =>
      Object.fromEntries(columnHeaders.map(header => [header, ""]))
    )
  );
  const [editingCell, setEditingCell] = useState({ row: null, col: null });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  // --- Toolbar action handlers ---
  const pushHistory = newData => {
    setHistory(prev => [...prev, data]);
    setRedoStack([]);
    setData(newData);
  };

  const handleNew = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the spreadsheet? This cannot be undone."
      )
    ) {
      setHistory(prev => [...prev, data]);
      setRedoStack([]);
      setData(
        Array.from({ length: defaultRows }, () =>
          Object.fromEntries(columnHeaders.map(header => [header, ""]))
        )
      );
    }
  };

  const handleOpen = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const json = JSON.parse(evt.target.result);
        if (Array.isArray(json)) {
          setHistory(prev => [...prev, data]);
          setRedoStack([]);
          setData(json);
        } else {
          alert("Invalid file format!");
        }
      } catch {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset file input
  };

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spreadsheet.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    setRedoStack(prev => [data, ...prev]);
    setData(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setHistory(prev => [...prev, data]);
    setData(redoStack[0]);
    setRedoStack(prev => prev.slice(1));
  };

  const handleAddRow = () => {
    pushHistory([
      ...data,
      Object.fromEntries(columnHeaders.map(header => [header, ""])),
    ]);
  };

  const handleHideFields = () => {
    setHiddenColumns(["URL", "Est. Value"]);
  };

  const handleShowFields = () => {
    setHiddenColumns([]);
  };

  const handleSort = () => {
    const sorted = [...data].sort((a, b) =>
      (a["Job Request"] || "").localeCompare(b["Job Request"] || "")
    );
    pushHistory(sorted);
  };

  // --- Render ---
  return (
    <div>
      <Toolbar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddRow={handleAddRow}
        onHideFields={handleHideFields}
        onShowFields={handleShowFields}
        onSort={handleSort}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        hiddenColumns={hiddenColumns}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <Spreadsheet
        data={data}
        setData={setData}
        pushHistory={pushHistory}
        editingCell={editingCell}
        setEditingCell={setEditingCell}
        hiddenColumns={hiddenColumns}
        filterStatus={filterStatus}
      />
    </div>
  );
}
