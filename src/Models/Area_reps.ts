import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Donor } from "./Donors";
import { OneTimePayment } from "./Onetimepayments";

@Entity("area_reps")
export class AreaRep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rep_name: string;

  @Column()
  phone_no: string;

  @Column()
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Donor, donor => donor.area_rep)
  donors: Donor[];

  @OneToMany(() => OneTimePayment, otp => otp.area_rep)
  one_time_payments: OneTimePayment[];
}
