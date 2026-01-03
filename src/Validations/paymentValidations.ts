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
