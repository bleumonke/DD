import './Datatable.css'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    onDelete?: (rowData: TData) => void
  }

  interface ColumnMeta<TData extends unknown, TValue> {
    className?: string
  }
}

import { useState } from 'react'
import { FaAngleLeft, FaAngleRight, FaAngleDown, FaAngleUp } from 'react-icons/fa6'
import TextField from './TextField'
import { IoSearchOutline } from 'react-icons/io5'
import { GoTrash } from 'react-icons/go'
import ConfirmDialog from './ConfirmDialog'

type DataTableProps<T> = {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (rowData: T) => void
  selectedRowId?: string | number | null
  onDelete?: (rowData: T) => void
}

export default function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  onRowClick,
  selectedRowId,
  onDelete,
}: DataTableProps<T>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [globalFilter, setGlobalFilter] = useState('')

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<T | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable<T>({
    data,
    columns,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: {
      pagination,
      globalFilter,
      sorting,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
    meta: { onDelete },
  })

  return (
    <div className="table-container">
      {/* Search input */}
      <div className="table-toolbar">
        <div className="search-wrapper">
          <TextField
            type="search"
            icon={<IoSearchOutline />}
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Table */}
      <table>
        
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => {
                const columnDef = header.column.columnDef
                const enableSorting = columnDef.enableSorting === true // ✅ strict check
                const isSorted = header.column.getIsSorted()

                return (
                  <th
                    key={header.id}
                    className={columnDef.meta?.className || ''}
                    style={{
                      width: header.getSize(),
                      cursor: enableSorting ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={enableSorting ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <div className="sort-header">
                      {flexRender(columnDef.header, header.getContext())}
                      {enableSorting && (
                        isSorted === 'asc' ? (
                          <FaAngleUp />
                        ) : isSorted === 'desc' ? (
                          <FaAngleDown />
                        ) : (
                          <FaAngleUp className="sort-icon inactive" />
                        )
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const rowId = (row.original as any).id ?? row.id
              const isSelected = rowId === selectedRowId

              return (
                <tr
                  key={row.id}
                  className={isSelected ? 'selected-row' : ''}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'delete') {
                      return (
                        <td
                          key={cell.id}
                          className={cell.column.columnDef.meta?.className || ''}
                        >
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRowToDelete(row.original)
                              setConfirmOpen(true)
                            }}
                            title="Delete record"
                            aria-label="Delete record"
                            style={{ width: '100%' }}
                          >
                            <GoTrash />
                          </button>
                        </td>
                      )
                    }

                    return (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <div className="no-data">No data found</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="pagination-icon"
          title="Previous page"
        >
          <FaAngleLeft size={16} />
        </button>

        <span className="page-number">{`Page ${
          table.getState().pagination.pageIndex + 1
        } of ${table.getPageCount()}`}</span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="pagination-icon"
          title="Next page"
        >
          <FaAngleRight size={16} />
        </button>

        <div className="page-size-wrapper">
          <select
            value={pagination.pageSize}
            onChange={(e) => {
              setPagination({
                ...pagination,
                pageSize: Number(e.target.value),
                pageIndex: 0,
              })
            }}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <FaAngleDown className="select-icon" />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this record?"
        onConfirm={() => {
          if (rowToDelete) {
            table.options.meta?.onDelete?.(rowToDelete)
            setConfirmOpen(false)
            setRowToDelete(null)
          }
        }}
        onCancel={() => {
          setConfirmOpen(false)
          setRowToDelete(null)
        }}
      />
    </div>
  )
}