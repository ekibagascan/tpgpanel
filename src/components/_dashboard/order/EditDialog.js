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
import { updateOrder } from "../../../actions/orders";

export default function EditDialog({ open, handleClose, currentId }) {
  const dispatch = useDispatch();
  const order = useSelector((state) =>
    currentId
      ? state.orders.orders.find((message) => message._id === currentId)
      : null
  );
  const [orderData, setOrderData] = useState({
    productName: "",
    category: "",
    playerId: "",
    zoneId: "",
    server: "",
    emailorPhone: "",
    totalPrice: "",
    paymentMethod: "",
    isPaid: false,
    isDelivered: false,
  });

  const clear = () => {
    setOrderData({
      productName: "",
      category: "",
      playerId: "",
      zoneId: "",
      server: "",
      emailorPhone: "",
      totalPrice: "",
      paymentMethod: "",
      isPaid: false,
      isDelivered: false,
    });
  };

  useEffect(() => {
    if (order) setOrderData(order);
  }, [order]);

  const handleAll = (event) => {
    setOrderData({
      ...orderData,
      isPaid: event.target.checked,
      isDelivered: event.target.checked,
    });
  };

  const handleIsPaid = (event) => {
    setOrderData({ ...orderData, isPaid: event.target.checked });
  };

  const handleIsDelivered = (event) => {
    setOrderData({ ...orderData, isDelivered: event.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentId) {
      dispatch(updateOrder(currentId, { ...orderData }));
    }
    clear();
  };

  const children = (
    <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
      <FormControlLabel
        label="Is Paid"
        control={
          <Checkbox checked={orderData.isPaid} onChange={handleIsPaid} />
        }
      />
      <FormControlLabel
        label="Is Delivered"
        control={
          <Checkbox
            checked={orderData.isDelivered}
            onChange={handleIsDelivered}
          />
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
              <Checkbox
                checked={orderData.isPaid && orderData.isDelivered}
                indeterminate={orderData.isPaid !== orderData.isDelivered}
                onChange={handleAll}
              />
            }
          />
          {children}
          <Button
            variant="contained"
            type="submit"
            size="large"
            fullwidth
            onClick={handleClose}
          >
            Update Order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
