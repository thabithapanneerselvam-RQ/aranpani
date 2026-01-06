import * as yup from "yup";

export const metricSchema = yup
  .object({
    fromDate: yup
      .string()
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "fromDate must be in YYYY-MM-DD format"),

    toDate: yup
      .string()
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "toDate must be in YYYY-MM-DD format"),
  })
  .test("both-or-none", function (value) {
    if (!value) return true;

    const { fromDate, toDate } = value;

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      return this.createError({
        message: "Both fromDate and toDate must be provided together",
      });
    }

    return true;
  })
  .test("valid-range", function (value) {
    if (!value || !value.fromDate || !value.toDate) return true;

    if (new Date(value.toDate) < new Date(value.fromDate)) {
      return this.createError({
        message: "toDate must be greater than or equal to fromDate",
      });
    }

    return true;
  });


export const detailSchema = yup.object({
  sort: yup.object({
    status: yup.string().oneOf(["asc", "desc"])
  }).optional(),

  search: yup.object({
    donorName: yup.string().trim().min(1)
  }).optional(),

  filter: yup.object({
    fromDate: yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "fromDate must be YYYY-MM-DD")
      .optional(),

    toDate: yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "toDate must be YYYY-MM-DD")
      .optional()
      .when("fromDate", ([fromDate], schema) =>
        fromDate
          ? schema.test(
              "is-after",
              "toDate must be after fromDate",
              value => !value || new Date(value) >= new Date(fromDate as string)
            )
          : schema
      )
  }).optional(),

  page: yup.number()
    .required("page is required")
    .min(1, "page must be >= 1"),

  pageSize: yup.number()
    .required("pageSize is required")
    .min(1, "pageSize must be >= 1")
    .max(100, "pageSize cannot exceed 100")
});


export const subdetailSchema = yup.object().shape({
  paymentId: yup.number().required("payment id is required")
})


export const otpDetailSchema = yup.object({
  sort: yup.object({
    status: yup.string().oneOf(["asc", "desc"])
  }).optional(),

  search: yup.object({
    donorName: yup.string().trim().min(1)
  }).optional(),

  filter: yup.object({
    fromDate: yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "fromDate must be YYYY-MM-DD")
      .optional(),

    toDate: yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "toDate must be YYYY-MM-DD")
      .optional()
      .when("fromDate", ([fromDate], schema) =>
        fromDate
          ? schema.test(
              "is-after",
              "toDate must be after fromDate",
              value => !value || new Date(value) >= new Date(fromDate as string)
            )
          : schema
      )
  }).optional(),

  page: yup.number()
    .required("page is required")
    .min(1, "page must be >= 1"),

  pageSize: yup.number()
    .required("pageSize is required")
    .min(1, "pageSize must be >= 1")
    .max(100, "pageSize cannot exceed 100")
});


export const otpSubdetailSchema = yup.object().shape({
  paymentId: yup.number().required("payment id is required")
})


export const checkPhoneSchema = yup.object().shape({
  phone_no: yup.string().matches(/^\+\d{10,15}$/, "Invalid phone format")
})


export const sendOtpSchema = yup.object().shape({
  phone_no: yup.string().matches(/^\+\d{10,15}$/, "Invalid phone format")
})


export const createOtpSchema = yup.object({
  phone_no: yup.string().matches(/^\+\d{10,15}$/, "Invalid phone format"),
  otp: yup.string().length(6),
  email: yup.string().email(),
  donor_name: yup.string().min(2),
  amount: yup.number().positive(),
  payment_mode: yup.string().oneOf(["paid", "pending", "not_paid", "paid by rep", "pending with rep"]),
  transaction_id: yup.string().optional(),
  address: yup.string().optional(),
  district: yup.string().optional(),
  pincode: yup.string().matches(/^\d{6}$/, "Invalid pincode")
});
