import React from 'react';
import { useTable, Column } from 'react-table';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const columns = React.useMemo<Column<any>[]>(() => {
    if (data.length > 0) {
      return Object.keys(data[0]).map((key) => ({
        Header: key,
        accessor: key,
      }));
    }
    return [];
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<any>({ columns, data });

  return (
    <table {...getTableProps()} style={{ border: '1px solid black', width: '100%' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} style={{ border: '1px solid black', padding: '8px' }}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '8px' }}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;