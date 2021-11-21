import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
//materials
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//actions
import { updateTx } from "../../../actions/transactions";

export default function EditDialog({ open, handleClose, currentId }) {
  const dispatch = useDispatch();
  const tx = useSelector((state) =>
    currentId
      ? state.txs.txs.find((message) => message._id === currentId)
      : null
  );
  const [txData, setTxData] = useState({
    id: "",
    productName: "",
    category: "",
    playerId: "",
    zoneId: "",
    server: "",
    emailorPhone: "",
    totalPrice: "",
    paymentMethod: "",
    status: "",
    isDelivered: false,
    created: "",
  });

  const clear = () => {
    setTxData({
      id: "",
      productName: "",
      category: "",
      playerId: "",
      zoneId: "",
      server: "",
      emailorPhone: "",
      totalPrice: "",
      paymentMethod: "",
      status: "",
      isDelivered: false,
      created: "",
    });
  };

  useEffect(() => {
    if (tx) setTxData(tx.metadata);
  }, [tx]);

  const handleAll = (event) => {
    setTxData({
      ...txData,
      isDelivered: event.target.checked,
    });
  };

  const handleIsDelivered = (event) => {
    setTxData({ ...txData, isDelivered: event.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentId) {
      dispatch(updateTx(currentId, { ...txData }));
    }
    clear();
  };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      <FormControlLabel
        label="Is Delivered"
        control={
          <Checkbox checked={txData.isDelivered} onChange={handleIsDelivered} />
        }
      />
    </Box>
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogContentText>
            Confirmation of the Topupgamesku order, whether is paid, delivered,
            or unpaid.
          </DialogContentText>
          <FormControlLabel
            label="All"
            control={
              <Checkbox checked={txData.isDelivered} onChange={handleAll} />
            }
          />
          {children}
          <Button
            variant="contained"
            type="submit"
            size="large"
            onClick={handleClose}
          >
            Update Order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
