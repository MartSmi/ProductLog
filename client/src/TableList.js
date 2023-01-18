import React from "react";
import "./table-list.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import "./table-list.css";

const TableList = ({ items, onClickHandler }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer sx={{}}>
        <Table
          stickyHeader
          sx={{ minWidth: 650, width: "auto" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Art number</TableCell>
              <TableCell align="right">EAN</TableCell>
              <TableCell align="right">Store</TableCell>
              <TableCell align="right">Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.EAN || item.store + item.artNumber}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "gray", cursor: "pointer" },
                }}
                onClick={() => onClickHandler(item)}
              >
                <TableCell scope="row">{item.name}</TableCell>
                <TableCell align="right">{item.artNumber}</TableCell>
                <TableCell align="right">{item.EAN}</TableCell>
                <TableCell align="right">{item.store}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TableList;
