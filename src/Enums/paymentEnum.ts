export enum PaymentMode {
  PAID = "paid",
  PENDING = "pending",
  NOT_PAID = "not_paid",
  PAID_BY_REP = "paid by rep",
  PENDING_WITH_REP = "pending with rep",
}

export enum DonorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum ProjectStatus {
  PROPOSED = "proposed",
  PLANNED = "planned",
  ACTIVE = "active",
  COMPLETED = "completed",
  SCRAPPED = "scrapped",
}

export enum PaymentRole {
  DONOR = "donor",
  AREA_REP = "area_rep",
}

export enum PaymentScheme {
  MONTHLY = "monthly",
  HALF_YEARLY = "half_yearly",
  YEARLY = "yearly",
}
