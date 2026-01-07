import { Request,Response } from "express"
import {getAllMetrics, getAllDetails, getAllSubdetails, getAllOnetimepayments, getOnetimepaymentSubdetails, sendOnetimepayment, createOnetimepayment, fetchDonorByPhone} from "../Services/paymentServices"
import { checkPhoneSchema, createOtpSchema, detailSchema, metricSchema, otpDetailSchema, otpSubdetailSchema, sendOtpSchema, subdetailSchema } from "../Validations/paymentValidations";
import { HttpStatus } from "../Enums/httpStatus";

export const getMetrics = async(req:Request, res:Response)=>{
    try{
        await metricSchema.validate(req.query);
        const {fromDate, toDate} = req.query;
        const fetchedMetrics = await getAllMetrics(fromDate as string, toDate as string);
        return res.status(HttpStatus.OK).json(fetchedMetrics)

    }catch(err){
        console.error("error in payment getmetrics",err)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "error in fetching data",
            error: err instanceof Error?err.message:err
        })
    }
}

export const getDetails = async(req:Request, res:Response)=>{
    try{
        await detailSchema.validate(req.query);
        const {search,sort,filter,page,pageSize} = req.query;
        const fetchedDetails = await getAllDetails(search,sort,filter,Number(page),Number(pageSize));
        return res.status(HttpStatus.OK).json(fetchedDetails)

    }catch(err){
        console.error("error in payment getdetails",err)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
        return res.status(HttpStatus.OK).json(fetchedSubdetails) 
    }catch(err){ 
        console.error("error in payment getSubdetails", err); 
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
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
        return res.status(HttpStatus.OK).json(fetchedDetails) 
    }catch(err){ 
        console.error("error in onetimepayments:", err); 
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
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
        return res.status(HttpStatus.OK).json(fetchedDetails) 
    }catch(err){ 
        console.error("error in OTP sub-details:", err); 
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
            message: "error in fetching data", 
            error: err instanceof Error ? err.message : err 
        }); 
    } 
}


export const sendOtp = async(req:Request, res:Response)=>{ 
    try{
        await sendOtpSchema.validate(req.body); 
        const {phoneNo} = req.body; 
        const createdOnetimepayment = await sendOnetimepayment(phoneNo); 
        return res.status(HttpStatus.OK).json(createdOnetimepayment) 
    }catch(err){ 
        console.error("error in getotpsubdetails",err); 
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "error in fetching onetimepayments sub-details data", 
            error: err instanceof Error ? err.message : err 
        }); 
    } 
}

export const createOtp = async(req:Request, res:Response)=>{ 
    try{ 
        await createOtpSchema.validate(req.body);
        const {phoneNo, email, donorName, amount, paymentMode, transactionId, district, address, pincode, otp} = req.body; 
        const createdOnetimepayment = await createOnetimepayment(phoneNo, email, donorName, amount, paymentMode, transactionId, district, address, pincode, otp); 
        return res.status(HttpStatus.OK).json(createdOnetimepayment) 
    }catch(err){ 
        console.error("error in getotpsubdetails",err); 
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
            message: "error in fetching onetimepayments sub-details data", 
            error: err instanceof Error ? err.message : err 
        }); 
    } 
}

export const getDonorByPhone = async(req:Request, res:Response)=>{
  try{
    await checkPhoneSchema.validate(req.params);
    const {phoneNo} = req.params;

    const fetchedDonor = await fetchDonorByPhone(phoneNo)
    return res.status(HttpStatus.OK).json(fetchedDonor);

  }catch(err){
    console.error(err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server error"});
  }
};
