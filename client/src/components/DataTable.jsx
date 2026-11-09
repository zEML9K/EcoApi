import React from 'react';

function DataTable({ columns, data, onEdit, onDelete, emptyText = 'Даних поки немає' }) {
  const hasActions = Boolean(onEdit || onDelete);
  const colSpan = columns.length + (hasActions ? 1 : 0);

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
            {hasActions && <th>Дії</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={colSpan} className="empty-row">{emptyText}</td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                <td key={col.header}>{col.render(row)}</td>
              ))}
              {hasActions && (
                <td>
                  <div className="actions">
                    {onEdit && (
                      <button className="btn btn-secondary" onClick={() => onEdit(row)}>
                        Редагувати
                      </button>
                    )}
                    {onDelete && (
                      <button className="btn btn-danger" onClick={() => onDelete(row._id)}>
                        Видалити
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;