import Razorpay from "razorpay";
import { Plan } from "../model/index.js";

export const CreateOrder = async (req, res, next) => {
  const { planId } = req.body;
  try {
    let instance = new Razorpay({
      key_id: "rzp_test_hMjp1Sqe2hmCbh",
      key_secret: "bpINaY5cdFDhXP2jz2AJNmLs",
    });
    let plans = await Plan.findByPk(planId);
    if (!plans) {
      res.status(404).json({ message: "Plan not found" });
    }
    let options = {
      amount:parseFloat(plans?.amount)*100, 
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      res.status(200).json({
        message: "Order created successfully",
        orderData: order,
      });
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
    