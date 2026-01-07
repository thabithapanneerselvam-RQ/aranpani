import { AppDataSource } from "../Config/dataSource"
import { OneTimePayment } from "../Models/Onetimepayments"
import { Payment } from "../Models/Payments"
import { Donor } from "../Models/Donors"
import { DonorStatus, PaymentMode } from "../Enums/paymentEnum"
import { Otp } from "../Models/Otp"
import { io } from "../server"
import { createDonor, createPayment, fetchAllDetails, fetchAllOnetimepayments, fetchAllSubdetails, fetchDonor, fetchMetrics, fetchOnetimepaymentSubdetails, findDonorByPhone, findOtp, linkOtpToPayment, saveOtp, saveOtpRecord } from "../Repositories/paymentRepository"
import { create } from "node:domain"


const paymentRepo = AppDataSource.getRepository(Payment)
const oneTimePaymentRepo = AppDataSource.getRepository(OneTimePayment)
const donorRepo = AppDataSource.getRepository(Donor);
const otpRepo = AppDataSource.getRepository(Otp)

const {TWILIO_ACCOUNT_SID, TWILIO_SERVICE_SID, TWILIO_AUTH_TOKEN} = process.env;


export const getAllMetrics = async(fromDate?: string, toDate?: string)=>{
    const result = await fetchMetrics(fromDate, toDate);

    return{
    monthlyDonations:{
      amt: Number(result?.monthly_amt) || 0,
      count: Number(result?.monthly_count) || 0,
    },
    onlineDonations:{
      amt: Number(result?.online_amt) || 0,
      count: Number(result?.online_count) || 0,
    },
    offlineDonations:{
      amt: Number(result?.offline_amt) || 0,
      count: Number(result?.offline_count) || 0,
    },
    pendingAmountFromRep:{
      amt: Number(result?.pending_amt) || 0,
      count: Number(result?.pending_count) || 0,
    },
    notPaidAmt:{
      amt: Number(result?.not_paid_amt) || 0,
      count: Number(result?.not_paid_count) || 0,
    },
  };
}


export const getAllDetails = async(search: any, sort: any, filter: any, page: number, pageSize: number)=>{
  const [rows, totalCount] = await fetchAllDetails(search, sort, filter, page, pageSize);

  
  return{
    data: rows.map((row, index)=>({
      s_no: (page - 1) * pageSize + index + 1,
      reg_no: row.project?.id,
      name: row.donor?.donorName,
      address: row.donor?.address,
      role: row.role,
      paid_by: row.paidBy,
      phone: row.donor?.phoneNo,
      district: row.donor?.district,
      pincode: row.donor?.pincode,
      amount: row.amount,
      status: row.mode
    })),
    meta:{
      page,
      pageSize,
      nextPage: page*pageSize<totalCount?page + 1:null,
      totalCount,
      totalPages: Math.ceil(totalCount/pageSize),
    }
  };
};


export const getAllSubdetails = async(paymentId: number)=>{
  const payment = await fetchAllSubdetails(paymentId);

  if(!payment){
    throw new Error("Payment not found");
  }

  const donor = payment.donor;
  const groupMembers = donor.groupMembers || [];

  const totalParticipants = groupMembers.length + 1; 
  const splitAmount = Math.floor(payment.amount/totalParticipants);

  return{
    payment_info:{
      date: payment.dateOfPay,
      mode: payment.mode,
      transaction_id: payment.transactionId,
      rep_name: donor.areaRep?.repName || null,
      rep_reg_no: donor.areaRep?.id || null,
    },
    donation_split:[
      {
          donor_name: donor.donorName,
          amount: splitAmount,
          is_donor: true
        },
        ...groupMembers.map(gm=>({
          group_member_name: gm.name,
          amount: splitAmount,
        }))
    ],
  };
};


export const getAllOnetimepayments = async(search: any, sort: any, filter: any, page: number, pageSize: number)=>{
  const [rows, totalCount] = await fetchAllOnetimepayments(search, sort, filter, page, pageSize);

  return{
    data: rows.map((row, index)=>({
      s_no: (page - 1) * pageSize + index + 1,
      name: row.areaRep?.repName || row.donor?.donorName,
      phone: row.areaRep?.phoneNo || row.donor?.phoneNo,
      address: row.areaRep?.address || row.donor?.address,
      amount: row.amount,
    })),
    meta:{
      page,
      pageSize,
      nextPage: page * pageSize < totalCount ? page + 1 : null,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
};


export const getOnetimepaymentSubdetails = async(paymentId: number)=>{
  const onetimePayment = await fetchOnetimepaymentSubdetails(paymentId);

  if(!onetimePayment){
    throw new Error("Onetimepayment is not found");
  }

  const areaRep = onetimePayment.areaRep;

  return{
    payment_info:{
      date: onetimePayment.dateOfPay,
      mode: onetimePayment.mode,
      transaction_id: onetimePayment.transactionId,
      rep_name: areaRep?.repName || null,
      rep_reg_no: areaRep?.id || null,
    }
  };
}


export const sendOnetimepayment = async(phoneNo: string)=>{
  if(!phoneNo){
    throw new Error("Required field phoneno is missing");
  }

  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,{
    lazyLoading: true
  })

  const otpResponse = await client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verifications.create({
      to: phoneNo,
      channel: "sms"
    });

    await saveOtp({
      phoneNo: phoneNo,
      code: otpResponse.sid,
      expiry: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
    })

  console.log(io.emit("otp_sent", {phoneNo}))
  
  return{
    success: true,
    message: "otp sent successfully",
    sid: otpResponse.sid
  };
};


export const createOnetimepayment = async(phoneNo: string, email: string, donorName: string, amount: number, paymentMode: string, transactionId: string,
  district: string, address: string, pincode: string, otp: string)=>{
  
  if(!phoneNo || !otp || !amount || !paymentMode || !email){
    throw new Error("Required fields missing");
  }

  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,{
    lazyLoading: true
  })

  const verification = await client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: phoneNo,
      code: otp,
    });

  if(verification.status !== "approved"){
    throw new Error("Invalid OTP");
  }

  const otpRecord = await findOtp(phoneNo);

  if (!otpRecord) throw new Error("OTP not found");

  if(otpRecord.expiry < new Date()){
    throw new Error("OTP expired");
  }

  otpRecord.verified = true;
  await saveOtpRecord(otpRecord);

  let donor = await findDonorByPhone(phoneNo)

  let donorCreated = false;

  if (!donor) {
    donor = await createDonor({
      donorName: donorName,
      email,
      district,
      address,
      pincode,
      phoneNo: phoneNo,
      status: DonorStatus.ACTIVE
    });
    donorCreated = true;
  }

  const payment = await createPayment({
    donor,
    amount,
    mode: paymentMode as PaymentMode,
    transactionId: transactionId,
    dateOfPay: new Date(),
  });

  await linkOtpToPayment(otpRecord, payment.id);

  console.log(io.emit("payment_success", {
    paymentId: payment.id,
    amount,
  })
)

  return {
    success: true,
    donorCreated: donorCreated,
    paymentId: (await payment).id,
    message: "Payment recorded successfully",
  };
};


export const fetchDonorByPhone = async(phoneNo: string)=>{
  const donor = await fetchDonor(phoneNo);

    if(!donor){
      return{
        exists: false,
        message: "Donor not found",
      };
    }

    return{
      exists: true,
      donor: {
        id: donor.id,
        donorName: donor.donorName,
        email: donor.email,
        address: donor.address,
        district: donor.district,
        pincode: donor.pincode,
        area_rep_id: donor.areaRep?.id || null,
      },
    };
}