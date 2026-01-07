import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Donor } from "./Donors";
import { OneTimePayment } from "./Onetimepayments";

@Entity("area_reps")
export class AreaRep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "rep_name" })
  repName: string;

  @Column({ name: "phone_no" })
  phoneNo: string;

  @Column({ name: "address" })
  address: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToMany(() => Donor, donor => donor.areaRep)
  donors: Donor[];

  @OneToMany(() => OneTimePayment, otp => otp.areaRep)
  oneTimePayments: OneTimePayment[];
}
