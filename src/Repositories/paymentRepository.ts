import { AppDataSource } from "../Config/dataSource";
import { Payment } from "../Models/Payments";
import { OneTimePayment } from "../Models/Onetimepayments";
import { Otp } from "../Models/Otp";
import { Donor } from "../Models/Donors";

export const paymentRepo = AppDataSource.getRepository(Payment);
export const oneTimePaymentRepo = AppDataSource.getRepository(OneTimePayment);
export const otpRepo = AppDataSource.getRepository(Otp);
export const donorRepo = AppDataSource.getRepository(Donor);

export const fetchMetrics = async (fromDate?: string, toDate?: string) => {
  const qb = paymentRepo.createQueryBuilder("p");

  if (fromDate && toDate) {
    qb.where("p.date_of_pay BETWEEN :from AND :to", { from: fromDate, to: toDate });
  }

  return qb.select([
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
  ]).getRawOne();
};



export const fetchAllDetails = async(search: any, sort: any, filter: any, page: number, pageSize: number)=>{
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

  return qb.getManyAndCount();
};


export const fetchAllSubdetails = async(paymentId: number)=>{
  return paymentRepo.findOne({
    where: {id: paymentId},
    relations:{
      donor: {groupMembers: true, areaRep: true},
    },
  });
};


export const fetchAllOnetimepayments = async(search: any, sort: any, filter: any, page: number, pageSize: number)=>{
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

  return qb.getManyAndCount();
};


export const fetchOnetimepaymentSubdetails = async(paymentId: number)=>{
  return oneTimePaymentRepo.findOne({
    where: {id: paymentId},
    relations: {areaRep: true}
  });
}



export const saveOtp = async (data: Partial<Otp>) => {
  const otp = otpRepo.create(data);
  return otpRepo.save(otp);
};


export const findOtp = async(phoneNo: string)=>{
    return otpRepo.findOne({
        where: {phoneNo: phoneNo, verified: false},
        order: {createdAt: "DESC"},
    });
}


export const saveOtpRecord = async(otp: Otp)=>{
  otp.verified = true;
  return otpRepo.save(otp);
};


export const findDonorByPhone = (phoneNo: string)=>{
    return donorRepo.findOne({ 
        where: {phoneNo} 
    });
}
  
export const createDonor = (data: Partial<Donor>)=>{
    return donorRepo.save(donorRepo.create(data));
}

export const createPayment = (data: Partial<OneTimePayment>)=>{
    return oneTimePaymentRepo.save(oneTimePaymentRepo.create(data));
}
  
export const linkOtpToPayment = async(otp: Otp, paymentId: number)=>{
  otp.oneTimePayment = {id: paymentId} as OneTimePayment;
  return otpRepo.save(otp);
};


export const fetchDonor = async(phoneNo: string)=>{
    return donorRepo.findOne({
        where: {phoneNo: phoneNo},
        relations: {areaRep: true},
    });
}