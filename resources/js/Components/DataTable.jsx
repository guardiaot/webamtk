import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from "react";

import Icon from "@mdi/react";
import {
    mdiChevronLeft,
    mdiChevronRight,
    mdiDotsVertical,
    mdiRefresh,
    mdiMagnify,
    mdiLoading,
    mdiFilterOutline
} from "@mdi/js";

const DataTable = forwardRef(
    function DataTable({
        height = "auto",
        title = "",
        subtitle = "",
        ajax = null,
        columns = [],
        pageSize = 10,
        pageSizeOptions = [10, 25, 50, 100],
        searchable = true,
        sortable = true,
        selectable = false,
        actions = [],       // ações gerais
        rowActions = [],    // ações de cada registro
        emptyMessage = "Nenhum registro encontrado.",
        className = "",
        filters = {},       // filtros externos { status: "active", ... }
        onFilterChange = null, // callback quando filtros mudam
        filterOptions = {}, // opções para filtros: { status: [{value, label}], ... }
    }, ref) {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [page, setPage] = useState(1);
        const [limit, setLimit] = useState(pageSize);
        const [search, setSearch] = useState("");
        const [searchInput, setSearchInput] = useState("");
        const [sort, setSort] = useState({
            field: null,
            direction: "asc"
        });
        const [selected, setSelected] = useState([]);
        const [pagination, setPagination] = useState({
            total: 0,
            current_page: 1,
            last_page: 1,
            from: 0,
            to: 0
        });
        /*
        |--------------------------------------------------------------------------
        | AJAX
        |--------------------------------------------------------------------------
        */
        const loadData = async () => {
            if (!ajax) {
                return;
            }
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.append("page", page);
                params.append("limit", limit);
                if (search) {
                    params.append("search", search);
                }
                if (sort.field) {
                    params.append("sort", sort.field);
                    params.append("direction", sort.direction);
                }
                // Adicionar filtros externos
                if (filters && typeof filters === "object") {
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== null && value !== undefined && value !== "" && value !== "all") {
                            params.append(key, value);
                        }
                    });
                }
                const url = `${ajax}?${params.toString()}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });
                if (!response.ok) {
                    throw new Error("Erro ao carregar dados.");
                }
                const result = await response.json();

                // console.log(result.data)
                const paginationData = result.data || {};
                setData(paginationData.data || []);
                setPagination({
                    total: paginationData.total || 0,
                    current_page: paginationData.current_page || page,
                    last_page: paginationData.last_page || 1,
                    from: paginationData.from || 0,
                    to: paginationData.to || 0
                });
                setSelected([]);
            } catch (error) {
                console.error("DataTable:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | LOAD
        |--------------------------------------------------------------------------
        */
        useEffect(() => {
            loadData();
        }, [
            ajax,
            page,
            limit,
            search,
            sort.field,
            sort.direction,
            filters
        ]);
        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */
        const handleSearch = (e) => {
            const value = e.target.value;
            setSearchInput(value);
            setPage(1);
            setSearch(value);
        };
        /*
        |--------------------------------------------------------------------------
        | SORT
        |--------------------------------------------------------------------------
        */
        const handleSort = (column) => {
            if (!sortable || column.sortable === false) {
                return;
            }
            if (!column.field) {
                return;
            }
            let direction = "asc";
            if (
                sort.field === column.field &&
                sort.direction === "asc"
            ) {
                direction = "desc";
            }
            setSort({
                field: column.field,
                direction
            });
            setPage(1);
        };
        /*
        |--------------------------------------------------------------------------
        | SELECT
        |--------------------------------------------------------------------------
        */
        const toggleRow = (id) => {
            setSelected(prev => {
                if (prev.includes(id)) {
                    return prev.filter(item => item !== id);
                }
                return [...prev, id];
            });
        };
        const allSelected =
            data.length > 0 &&
            data.every(row => selected.includes(row.id));
        const toggleAll = () => {
            if (allSelected) {
                setSelected([]);
            } else {
                setSelected(data.map(row => row.id));
            }
        };
        /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */
        const pages = useMemo(() => {
            const total = pagination.last_page;
            let start = Math.max(1, page - 2);
            let end = Math.min(total, page + 2);
            if (end - start < 4) {
                if (start === 1) {
                    end = Math.min(total, 5);
                }
                if (end === total) {
                    start = Math.max(1, total - 4);
                }
            }
            const result = [];
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
            return result;
        }, [
            pagination.last_page,
            page
        ]);
        /*
        |--------------------------------------------------------------------------
        | RENDER CELL
        |--------------------------------------------------------------------------
        */
        const renderCell = (column, row) => {
            const value = column.field
                ? row[column.field]
                : null;
            if (column.render) {
                return column.render(value, row);
            }
            return value ?? "-";
        };
        /*
        |--------------------------------------------------------------------------
        | REFRESH
        |--------------------------------------------------------------------------
        */
        const refresh = () => {
            loadData();
        };

        useImperativeHandle(ref, () => ({
            refresh
        }));

        /*
        |--------------------------------------------------------------------------
        | RENDER
        |--------------------------------------------------------------------------
        */
        return (
            <div className={`card ${className}`} style={{
                height: height || "auto",
                display: "flex",
                flexDirection: "column"
            }}>
                {/* HEADER */}
                {(title || searchable || actions.length > 0) && (
                    <div className="card-header">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                {title && (
                                    <h5 className="card-title mb-1">
                                        {title}
                                    </h5>
                                )}
                                {subtitle && (
                                    <small className="text-body-secondary">
                                        {subtitle}
                                    </small>
                                )}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                {searchable && (
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">
                                            <Icon
                                                path={mdiMagnify}
                                                size={0.75}
                                            />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Pesquisar..."
                                            value={searchInput}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                )}
                                <div className="dropdown">
                                    <button
                                        type="button"
                                        className="btn text-body-secondary p-1"
                                        data-bs-toggle="dropdown"
                                    >
                                        <Icon
                                            path={mdiDotsVertical}
                                            size={0.9}
                                        />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={refresh}
                                            >
                                                <Icon
                                                    path={mdiRefresh}
                                                    size={0.75}
                                                    className="me-2"
                                                />
                                                Atualizar
                                            </button>
                                        </li>
                                        {actions.map((action, index) => (
                                            <li key={index}>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() =>
                                                        action.onClick(selected)
                                                    }
                                                >
                                                    {action.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* FILTERS */}
                {filterOptions && Object.keys(filterOptions).length > 0 && (
                    <div className="card-header bg-light border-top border-bottom py-2">
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            <Icon path={mdiFilterOutline} size={0.8} className="text-muted" />
                            {Object.entries(filterOptions).map(([key, options]) => (
                                <div key={key} className="d-flex align-items-center gap-2">
                                    <label className="form-label mb-0 small text-muted text-capitalize">
                                        {key}:
                                    </label>
                                    <select
                                        className="form-select form-select-sm"
                                        style={{ width: "auto", minWidth: "120px" }}
                                        value={filters[key] || ""}
                                        onChange={(e) => {
                                            if (onFilterChange) {
                                                onFilterChange(key, e.target.value);
                                            }
                                        }}
                                    >
                                        <option value="">Todos</option>
                                        {options.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* TABLE */}
                <div className="card-datatable" style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto"
                }}>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    {selectable && (
                                        <th style={{ width: 40 }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={allSelected}
                                                onChange={toggleAll}
                                            />
                                        </th>
                                    )}
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            style={{
                                                width: column.width,
                                                cursor:
                                                    sortable &&
                                                        column.sortable !== false
                                                        ? "pointer"
                                                        : "default"
                                            }}
                                            onClick={() =>
                                                handleSort(column)
                                            }
                                        >
                                            <div className="d-flex align-items-center gap-1">
                                                {column.label}
                                                {sortable &&
                                                    column.sortable !== false &&
                                                    column.field && (
                                                        <span className="text-body-secondary">
                                                            {sort.field === column.field
                                                                ? sort.direction === "asc"
                                                                    ? "↑"
                                                                    : "↓"
                                                                : "↕"}
                                                        </span>
                                                    )}
                                            </div>
                                        </th>
                                    ))}
                                    {rowActions.length > 0 && (
                                        <td>
                                            <div className="d-flex align-items-center gap-1">
                                                {rowActions.map((action, actionIndex) => (
                                                    <button
                                                        key={actionIndex}
                                                        type="button"
                                                        className={`btn btn-sm ${action.color
                                                            ? `btn-${action.color}`
                                                            : "btn-primary"
                                                            }`}
                                                        title={action.label}
                                                        onClick={() => action.onClick(row)}
                                                    >
                                                        {action.icon && (
                                                            <Icon
                                                                path={action.icon}
                                                                size={0.7}
                                                            />
                                                        )}

                                                        {action.showLabel && (
                                                            <span className="ms-1">
                                                                {action.label}
                                                            </span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                columns.length +
                                                (selectable ? 1 : 0)
                                            }
                                            className="text-center py-5"
                                        >
                                            <Icon
                                                path={mdiLoading}
                                                size={1}
                                                spin
                                            />
                                            <div className="mt-2 text-body-secondary">
                                                Carregando...
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                columns.length +
                                                (selectable ? 1 : 0)
                                            }
                                            className="text-center py-5 text-body-secondary"
                                        >
                                            {emptyMessage}
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, rowIndex) => (
                                        <tr key={row.id ?? rowIndex}>
                                            {selectable && (
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={selected.includes(row.id)}
                                                        onChange={() =>
                                                            toggleRow(row.id)
                                                        }
                                                    />
                                                </td>
                                            )}
                                            {columns.map((column, columnIndex) => (
                                                <td
                                                    key={columnIndex}
                                                    className={column.className || ""}
                                                >
                                                    {renderCell(
                                                        column,
                                                        row
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="card-footer" >
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-body-secondary">
                                Exibindo
                            </span>
                            <select
                                className="form-select form-select-sm"
                                style={{ width: 75 }}
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                {pageSizeOptions.map(size => (
                                    <option
                                        key={size}
                                        value={size}
                                    >
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <span className="text-body-secondary">
                                {pagination.from} até {pagination.to} de{" "}
                                {pagination.total}
                            </span>
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li
                                    className={`page-item ${page <= 1
                                        ? "disabled"
                                        : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        disabled={page <= 1}
                                        onClick={() =>
                                            setPage(page - 1)
                                        }
                                    >
                                        <Icon
                                            path={mdiChevronLeft}
                                            size={0.8}
                                        />
                                    </button>
                                </li>
                                {pages.map(number => (
                                    <li
                                        key={number}
                                        className={`page-item ${number === page
                                            ? "active"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                setPage(number)
                                            }
                                        >
                                            {number}
                                        </button>
                                    </li>
                                ))}
                                <li
                                    className={`page-item ${page >= pagination.last_page
                                        ? "disabled"
                                        : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        disabled={
                                            page >= pagination.last_page
                                        }
                                        onClick={() =>
                                            setPage(page + 1)
                                        }
                                    >
                                        <Icon
                                            path={mdiChevronRight}
                                            size={0.8}
                                        />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    });

export default DataTable;