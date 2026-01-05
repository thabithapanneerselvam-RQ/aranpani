import { Request,Response } from "express"
import {getAllMetrics, getAllDetails, getAllSubdetails, getAllOnetimepayments, getOnetimepaymentSubdetails, sendOnetimepayment, createOnetimepayment} from "../Services/paymentServices"
import { checkPhoneSchema, detailSchema, metricSchema, otpDetailSchema, otpSubdetailSchema, subdetailSchema } from "../Validations/paymentValidations";
import { Donor } from "../Models/Donors";
import { AppDataSource } from "../Config/dataSource";

const donorRepo = AppDataSource.getRepository(Donor)

export const getMetrics = async(req:Request, res:Response)=>{
    try{
        await metricSchema.validate(req.query);
        const {fromDate, toDate} = req.query;
        const fetchedMetrics = await getAllMetrics(fromDate as string, toDate as string);
        return res.status(200).json(fetchedMetrics)

    }catch(err){
        console.error("error in payment getmetrics",err)
        return res.status(500).json({
            message: "error in fetching data",
            error: err instanceof Error?err.message:err
        })
    }
}

export const getDetails = async(req:Request, res:Response)=>{
    try{
        await detailSchema.validate(req.query);
        const {search,sort,filter,page,pageSize} = req.query;
        console.log(search,sort,filter,page,pageSize)
        const fetchedDetails = await getAllDetails(search,sort,filter,Number(page),Number(pageSize));
        return res.status(200).json(fetchedDetails)

    }catch(err){
        console.error("error in payment getdetails",err)
        return res.status(500).json({
            message: "error in fetching data",
            error: err instanceof Error?err.message:err
        })
    }
}

export const getSubdetails = async(req:Request, res:Response)=>{ 
    try{ 
        await subdetailSchema.validate(req.params)
        const {paymentId} = req.params; 
        const fetchedSubdetails = await getAllSubdetails(Number(paymentId)) 
        return res.status(200).json(fetchedSubdetails) 
    }catch(err){ 
        console.error("error in payment getSubdetails", err); 
        return res.status(500).json({ 
            message: "error in fetching each user payment sub-details", 
            error: err instanceof Error ? err.message : err 
        }) 
    } 
}


export const getOnetimepayments = async(req:Request, res:Response)=>{ 
    try{ 
        await otpDetailSchema.validate(req.query);
        const {search,sort,filter,page,pageSize } = req.query; 
        const fetchedDetails = await getAllOnetimepayments(search,sort,filter,Number(page),Number(pageSize)) 
        return res.status(200).json(fetchedDetails) 
    }catch(err){ 
        console.error("error in onetimepayments:", err); 
        return res.status(500).json({ 
            message: "error in fetching data", 
            error: err instanceof Error ? err.message : err 
        }); 
    } 
}


export const getOtpSubdetails = async(req:Request, res:Response)=>{
    try{ 
        await otpSubdetailSchema.validate(req.params);
        const {paymentId} = req.params; 
        const fetchedDetails = await getOnetimepaymentSubdetails(Number(paymentId)) 
        return res.status(200).json(fetchedDetails) 
    }catch(err){ 
        console.error("error in OTP sub-details:", err); 
        return res.status(500).json({ 
            message: "error in fetching data", 
            error: err instanceof Error ? err.message : err 
        }); 
    } 
}


export const sendOtp = async(req:Request, res:Response)=>{ 
    try{ 
        const {phone_no} = req.body; 
        const createdOnetimepayment = await sendOnetimepayment(phone_no); 
        return res.status(200).json(createdOnetimepayment) 
    }catch(err){ 
        console.error("error in getotpsubdetails",err); 
        return res.status(500).json({ message: "error in fetching onetimepayments sub-details data", 
            error: err instanceof Error ? err.message : err 
        }); 
    } 
}

export const createOtp = async(req:Request, res:Response)=>{ 
    try{ 
        const {phone_no, email, donor_name, amount, payment_mode, transaction_id, district, address, pincode, otp} = req.body; 
        const createdOnetimepayment = await createOnetimepayment(phone_no, email, donor_name, amount, payment_mode, transaction_id, district, address, pincode, otp); 
        return res.status(200).json(createdOnetimepayment) 
    }catch(err){ 
        console.error("error in getotpsubdetails",err); 
        return res.status(500).json({ 
            message: "error in fetching onetimepayments sub-details data", 
            error: err instanceof Error ? err.message : err 
        }); 
    } 
}

export const getDonorByPhone = async(req:Request, res:Response)=>{
  try{
    await checkPhoneSchema.validate(req.params);
    const {phone_no} = req.params;

    const donor = await donorRepo.findOne({
      where: {phoneNo: phone_no},
      relations: ["areaRep"],
    });

    if(!donor){
      return res.status(404).json({
        exists: false,
        message: "Donor not found",
      });
    }

    return res.json({
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
    });
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Server error"});
  }
};
