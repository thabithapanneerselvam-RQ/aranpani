import { Request,Response } from "express"
import {getAllMetrics, getAllDetails, getAllSubdetails, getAllOnetimepayments, getOnetimepaymentSubdetails} from "../Services/paymentServices"
import { detailSchema, metricSchema, otpDetailSchema, otpSubdetailSchema, subdetailSchema } from "../Validations/paymentValidations";

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

