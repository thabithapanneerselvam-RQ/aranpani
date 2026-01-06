import { AppDataSource } from "../Config/dataSource"
import { OneTimePayment } from "../Models/Onetimepayments"
import { Payment } from "../Models/Payments"
import { Donor } from "../Models/Donors"
import { DonorStatus, PaymentMode } from "../Enums/paymentEnum"
import { Otp } from "../Models/Otp"

const paymentRepo = AppDataSource.getRepository(Payment)
const oneTimePaymentRepo = AppDataSource.getRepository(OneTimePayment)
const donorRepo = AppDataSource.getRepository(Donor);
const otpRepo = AppDataSource.getRepository(Otp)

const {TWILIO_ACCOUNT_SID, TWILIO_SERVICE_SID, TWILIO_AUTH_TOKEN} = process.env;


export const getAllMetrics = async(fromDate?: string, toDate?: string)=>{
    const qb = paymentRepo.createQueryBuilder("p")

    if(fromDate && toDate){
        qb.where("p.date_of_pay BETWEEN :fromDate AND :toDate",{
            fromDate,
            toDate
        })
    }

    const result = await qb
    .select([
      `SUM(p.amount) AS monthly_amt`,
      `COUNT(p.donor_id) AS monthly_count`,

      `SUM(CASE WHEN p.mode = 'paid' AND p.role = 'donor' THEN p.amount ELSE 0 END) AS online_amt`,
      `COUNT(DISTINCT CASE WHEN p.mode = 'paid' AND p.role = 'donor' THEN p.donor_id END) AS online_count`,

      `SUM(CASE WHEN p.mode = 'paid by rep' AND p.role = 'area_rep' THEN p.amount ELSE 0 END) AS offline_amt`,
      `COUNT(DISTINCT CASE WHEN p.mode = 'paid by rep' AND p.role = 'area_rep' THEN p.donor_id END) AS offline_count`,

      `SUM(CASE WHEN p.mode = 'pending with rep' THEN p.amount ELSE 0 END) AS pending_amt`,
      `COUNT(DISTINCT CASE WHEN p.mode = 'pending with rep' THEN p.donor_id END) AS pending_count`,

      `SUM(CASE WHEN p.mode = 'not_paid' THEN p.amount ELSE 0 END) AS not_paid_amt`,
      `COUNT(DISTINCT CASE WHEN p.mode = 'not_paid' THEN p.donor_id END) AS not_paid_count`,
    ])
    .getRawOne();

    return{
    monthly_donations:{
      amt: Number(result?.monthly_amt) || 0,
      count: Number(result?.monthly_count) || 0,
    },
    online_donations:{
      amt: Number(result?.online_amt) || 0,
      count: Number(result?.online_count) || 0,
    },
    offline_donations:{
      amt: Number(result?.offline_amt) || 0,
      count: Number(result?.offline_count) || 0,
    },
    pending_amount_from_rep:{
      amt: Number(result?.pending_amt) || 0,
      count: Number(result?.pending_count) || 0,
    },
    not_paid_amt:{
      amt: Number(result?.not_paid_amt) || 0,
      count: Number(result?.not_paid_count) || 0,
    },
  };
}


export const getAllDetails = async(search: any, sort: any, filter: any, page: number, pageSize: number)=>{
  const qb = paymentRepo
    .createQueryBuilder("p")
    .leftJoinAndSelect("p.donor", "d")


  if(filter?.fromDate && filter?.toDate){
    qb.andWhere("p.date_of_pay BETWEEN :from AND :to", {
      from: filter.fromDate,
      to: filter.toDate,
    });
  }

  if(search?.donorName){
    qb.andWhere("LOWER(d.donor_name) LIKE LOWER(:donor_name)", {
      donor_name: `%${search.donorName}%`,
    });
  }

  if(sort?.status){
    qb.orderBy("p.mode", sort.status.toUpperCase() === "DESC" ? "DESC" : "ASC");
  } else {
    qb.orderBy("p.createdAt", "DESC");
  }

  qb.skip((page - 1) * pageSize).take(pageSize);

  const [rows, totalCount] = await qb.getManyAndCount();

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
  const payment = await paymentRepo.findOne({
    where: {id: paymentId},
    relations:{
      donor: {groupMembers: true, areaRep: true},
    },
  });

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
  const qb = oneTimePaymentRepo
    .createQueryBuilder("p")
    .leftJoinAndSelect("p.areaRep", "rep")
    .leftJoinAndSelect("p.project", "proj")
    .leftJoinAndSelect("p.donor", "donor");

  if(filter?.fromDate && filter?.toDate){
    qb.andWhere("p.dateOfPay BETWEEN :from AND :to",{
      from: filter.fromDate,
      to: filter.toDate,
    });
  }

  if(search?.arearepName){
    qb.andWhere("LOWER(rep.repName) LIKE LOWER(:repName)",{
      repName: `%${search.arearepName}%`,
    });
  }

  if(sort?.status){
    qb.orderBy("p.mode", sort.status.toLowerCase() === "desc" ? "DESC" : "ASC"
    );
  }else{
    qb.orderBy("p.createdAt", "DESC");
  }

  qb.skip((page - 1) * pageSize).take(pageSize);

  const [rows, totalCount] = await qb.getManyAndCount();

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
  const onetimePayment = await oneTimePaymentRepo.findOne({
    where: {id: paymentId},
    relations: {areaRep: true}
  });

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


export const sendOnetimepayment = async(phone_no: string)=>{
  if(!phone_no){
    throw new Error("Required field phoneno is missing");
  }

  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,{
    lazyLoading: true
  })

  const otpResponse = await client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verifications.create({
      to: phone_no,
      channel: "sms"
    });

    await otpRepo.save(
    otpRepo.create({
      phoneNo: phone_no,
      code: otpResponse.sid,
      expiry: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
    })
  );
  
  return{
    success: true,
    message: "otp sent successfully",
    sid: otpResponse.sid
  };
};


export const createOnetimepayment = async(phone_no: string, email: string, donor_name: string, amount: number, payment_mode: string, transaction_id: string,
  district: string, address: string, pincode: string, otp: string)=>{
  
  if(!phone_no || !otp || !amount || !payment_mode || !email){
    throw new Error("Required fields missing");
  }

  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,{
    lazyLoading: true
  })

  const verification = await client.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: phone_no,
      code: otp,
    });

  if(verification.status !== "approved"){
    throw new Error("Invalid OTP");
  }

  const otpRecord = await otpRepo.findOne({
    where: {phoneNo: phone_no, verified: false},
    order: {createdAt: "DESC"},
  });

  if (!otpRecord) throw new Error("OTP not found");

  if(otpRecord.expiry < new Date()){
    throw new Error("OTP expired");
  }

  otpRecord.verified = true;
  await otpRepo.save(otpRecord);

  let donor = await donorRepo.findOne({ 
    where: {phoneNo: phone_no} 
  });

  let donorCreated = false;

  if (!donor) {
    donor = donorRepo.create({
      donorName: donor_name,
      email,
      district,
      address,
      pincode,
      phoneNo: phone_no,
      status: DonorStatus.ACTIVE
    });
    await donorRepo.save(donor);
    donorCreated = true;
  }

  const payment = oneTimePaymentRepo.create({
    donor,
    amount,
    mode: payment_mode as PaymentMode,
    transactionId: transaction_id,
    dateOfPay: new Date(),
  });

  await oneTimePaymentRepo.save(payment);

  otpRecord.oneTimePayment = payment;
  await otpRepo.save(otpRecord);

  return {
    success: true,
    donor_created: donorCreated,
    payment_id: payment.id,
    message: "Payment recorded successfully",
  };
};


export const fetchDonorByPhone = async(phone_no: string)=>{
  const donor = await donorRepo.findOne({
      where: {phoneNo: phone_no},
      relations: ["areaRep"],
    });

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
        donor_name: donor.donorName,
        email: donor.email,
        address: donor.address,
        district: donor.district,
        pincode: donor.pincode,
        area_rep_id: donor.areaRep?.id || null,
      },
    };
}