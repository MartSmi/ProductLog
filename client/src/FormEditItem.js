import React from "react";
import { useState } from "react";
// import "./table-list.css";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const TableList = ({ item, handleItemUpdate, isItemSubmiting }) => {
  const [canUpdate, setCanUpdate] = useState(false);
  const [newQuantity, setNewQuantity] = useState(item.quantity);

  if (!item) {
    return null;
  }

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="right">Art number</TableCell>
          <TableCell align="right">EAN</TableCell>
          <TableCell align="right">Store</TableCell>
          <TableCell align="right">Quantity</TableCell>
          <TableCell align="right">New quantity</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          <TableRow
            key={item.EAN || item.store + item.artNumber}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell scope="row">{item.name}</TableCell>
            <TableCell align="right">{item.artNumber}</TableCell>
            <TableCell align="right">{item.EAN}</TableCell>
            <TableCell align="right">{item.store}</TableCell>
            <TableCell align="right">{item.quantity}</TableCell>
            <TableCell>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "25ch" },
                  display: "flex",
                }}
                noValidate
                autoComplete="off"
                onSubmit={(e) => {
                  setCanUpdate(false);
                  handleItemUpdate(newQuantity);
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <TextField
                  id="outlined-number"
                  label="New quantity"
                  type="number"
                  value={newQuantity ? newQuantity.toString() : 0}
                  onChange={(event) => {
                    let value = parseInt(event.target.value);
                    value = value < 0 ? 0 : value;
                    setNewQuantity(value);
                    console.log(value + "-" + newQuantity);
                    if (value !== item.quantity) setCanUpdate(true);
                    else setCanUpdate(false);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onSubmit={(e) => console.log(e)}
                />
                <Button
                  disabled={!canUpdate || isItemSubmiting}
                  variant="contained"
                  type="submit"
                >
                  Update
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        }
      </TableBody>
    </Table>
  );
};

export default TableList;
