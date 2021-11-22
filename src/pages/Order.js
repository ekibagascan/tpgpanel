import { filter } from "lodash";
import { sentenceCase } from "change-case";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
// material
import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
  OrderListHead,
  OrderListToolbar,
  OrderMoreMenu,
} from "../components/_dashboard/order";
//
import { getAllTx } from "../actions/transactions";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "created", label: "Created", alignRight: false },
  { id: "productName", label: "Name", alignRight: false },
  { id: "category", label: "Category", alignRight: false },
  { id: "playerId", label: "Player Id", alignRight: false },
  { id: "zoneId", label: "Zone Id", alignRight: false },
  { id: "server", label: "Server", alignRight: false },
  { id: "emailorPhone", label: "Email/Hp", alignRight: false },
  { id: "reference_id", label: "RefID", alignRight: false },
  { id: "paymentMethod", label: "Payment", alignRight: false },
  { id: "totalPrice", label: "Price", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_order) => _order.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function useIsMounted() {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
}

export default function Order() {
  const dispatch = useDispatch();
  const { txs, isTxLoading } = useSelector((state) => state.txs);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [state, setState] = useState("loading (4 sec)...");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const isMounted = useIsMounted();
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    dispatch(getAllTx()).then((data) => {
      if (isMounted.current) {
        setState(data);
      }
      return { state };
    });
  }, [dispatch, isMounted, state]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = txs.map((n) => n.metadata.productName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - txs.length) : 0;

  const filteredOrders = applySortFilter(
    txs,
    getComparator(order, orderBy),
    filterName
  );

  const isOrderNotFound = filteredOrders.length === 0;

  return (
    <Page title="Orders | Topupgamesku">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Order
          </Typography>
        </Stack>

        <Card>
          <OrderListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <OrderListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={txs.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        productName,
                        category,
                        playerId,
                        zoneId,
                        server,
                        emailorPhone,
                        paymentMethod,
                        totalPrice,
                        status,
                        created,
                        isDelivered,
                      } = row.metadata;

                      const isItemSelected =
                        selected.indexOf(productName) !== -1;

                      return (
                        <TableRow
                          hover
                          key={row._id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) =>
                                handleClick(event, productName)
                              }
                            />
                          </TableCell>
                          <TableCell align="left">
                            {moment(created).startOf("minutes").fromNow()}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle2" noWrap>
                                {productName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{category}</TableCell>
                          <TableCell align="left">{playerId}</TableCell>
                          <TableCell align="left">{zoneId || "none"}</TableCell>
                          <TableCell align="left">{server || "none"}</TableCell>
                          <TableCell align="left">
                            {emailorPhone || "none"}
                          </TableCell>
                          <TableCell align="left">
                            {row.ewallet.data.reference_id ||
                              row.qris.qr_code.external_id}
                          </TableCell>
                          <TableCell align="left">{paymentMethod}</TableCell>
                          <TableCell align="left">{totalPrice}</TableCell>

                          {paymentMethod !== "Qris" ? (
                            <TableCell align="left">
                              <Label
                                variant="ghost"
                                color={
                                  isDelivered && status === "SUCCEEDED"
                                    ? "success"
                                    : status === "SUCCEEDED"
                                    ? "primary"
                                    : "default"
                                }
                              >
                                {isTxLoading ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  sentenceCase(
                                    isDelivered && status === "SUCCEEDED"
                                      ? "Delivered"
                                      : status === "SUCCEEDED"
                                      ? "Paid"
                                      : "Unpaid"
                                  )
                                )}
                              </Label>
                            </TableCell>
                          ) : (
                            <TableCell align="left">
                              <Label
                                variant="ghost"
                                color={
                                  isDelivered && status === "COMPLETED"
                                    ? "success"
                                    : status === "COMPLETED"
                                    ? "primary"
                                    : "default"
                                }
                              >
                                {isTxLoading ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  sentenceCase(
                                    isDelivered && status === "COMPLETED"
                                      ? "Delivered"
                                      : status === "COMPLETED"
                                      ? "Paid"
                                      : "Unpaid"
                                  )
                                )}
                              </Label>
                            </TableCell>
                          )}

                          <TableCell align="right">
                            <OrderMoreMenu
                              paymentMethod={paymentMethod}
                              id={row._id}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isOrderNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={txs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
