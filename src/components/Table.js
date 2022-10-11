import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel
} from '@tanstack/react-table';

const FilterInput = ({ column }) => (
  <input
    type="text"
    className="rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm w-full placeholder:font-normal font-normal"
    value={column.getFilterValue() ?? ""}
    onChange={(event) => column.setFilterValue(event.target.value)}
    placeholder="Buscar estudiante..."
  />
)

const Table = ({ data = [], columns = [] }) => {
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  });

  return (
    <table className="w-full">
      <thead className="border-b border-gray-300">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className="p-2 first-of-type:flex justify-center items-center gap-4">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                }
                {header.column.getCanFilter() ? (
                  <div className="basis-1/2">
                    <FilterInput column={header.column}/>
                  </div>
                ): null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="border-b border-gray-300">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="first-of-type:text-left text-center p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {/* <tfoot>
        {table.getFooterGroups().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot> */}
    </table>
  )
};

export default Table;