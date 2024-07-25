const express = require('express');
const router = express.Router();
const PayMor = require("./PayMor");
const Wallet = require('../models/Wallet');

router.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    const wallet = await Wallet.findOne({ username: req.session.user.username });
    res.render('dashboard', { username: req.session.user.username, balance: wallet.balance });
  });

router.post("/request", async (req, res) => {
    const sp = new PayMor();
    const money = req?.body?.amount || ""
    const response = await sp.initiatePayment({
      mid: req?.body?.mid || "",
      secretKey: req?.body?.secretKey || "",
      saltKey: req?.body?.saltKey || "",
      orderNo: req?.body?.orderNo || "",
      amount: req?.body?.amount || "",
      currency: req?.body?.currency || "",
      txnReqType: req?.body?.txnReqType || "",
      undefinedField1: "",
      undefinedField2: "",
      undefinedField3: "",
      undefinedField4: "",
      undefinedField5: "",
      undefinedField6: "",
      undefinedField7: "",
      undefinedField8: "",
      undefinedField9: "",
      undefinedField10: "",
      emailId: req?.body?.emailId || "",
      mobileNo: req?.body?.mobileNo || "",
      transactionMethod: req?.body?.transactionMethod || "",
      bankCode: "",
      vpa: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      customerName: req?.body?.customerName || "",
      respUrl: req?.body?.respUrl || "",
      optional1: req?.body?.optional1 || "",
    });
  
    if (response?.error) {
      res.send(response);
    } else {
      respHandler(response, res,money);
    }
  });
  
  async function respHandler(jsonData, res, money) {
    const responseData = jsonData;
  
    if (responseData?.respCode == 1) {
      res.send(responseData?.data?.ResponseMsg);
    } else {
      const mid = "900000000000026";
      const secretKey = "scr2dHNWS5QYjb07vVmVOu9VGG3JhG1dPP5";
      const saltKey = "salNeSAWnEOmCd3UiEBQozhWoUny5GIZg";
  
      const sp = new PayMor();
      sp._mid = mid;
      sp._secretKey = secretKey;
      sp._saltKey = saltKey;
  
      const data = JSON.parse(responseData?.data);
      const respData = data?.respData;
      const checkSum = data?.checkSum;
  
      const response = sp.getResponse(respData, mid, checkSum);

      const wallet = await Wallet.findOne({ username: 'Vishal' });
      wallet.balance += parseFloat(money);
      await wallet.save();
      
      res.render("dashboard", { response: JSON.parse(response) });
    }
  }
  
  router.get("/txStatus", async (req, res) => {
    const mid = "900000000000008"; // Provided by PayMor
    const secretKey = "scrh0e0TZiA6J6bKXvJs5Pme8CMavx0cNmi"; // Provided by PayMor
    const saltKey = "sal9XIXl94aP3ZC6ZFIki32ugGXBVJBfr"; // Provided by PayMor
    const orderNo = "ORD65184495"; // Your Order No
    const txnRefNo = ""; // Optional
    const amount = ""; // Optional
  
  
    let error = "";
    const sp = new PayMor();
  
    if (mid && mid?.toString()?.trim() !== "") {
      sp._mid = mid;
    } else {
      error += "Mid Field is required.\n";
    }
  
    if (secretKey && secretKey?.toString()?.trim() !== "") {
      sp._secretKey = secretKey;
    } else {
      error += "SecretKey Field is required.\n";
    }
  
    if (saltKey && saltKey?.toString()?.trim() !== "") {
      sp._saltKey = saltKey;
    } else {
      error += "SaltKey Field is required.\n";
    }
  
    if (orderNo && orderNo?.toString()?.trim() !== "") {
      sp._orderNo = orderNo;
    } else {
      error += "orderNo Field is required.\n";
    }
  
    sp._amount = amount;
    sp._txnRefNo = txnRefNo;
  
    if (!error || error == "") {
      const resStatus = await sp.getTrnStatus();
      res.send(resStatus);
    } else {
      res.send(error);
    }
  });
  

module.exports = router;
