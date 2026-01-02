import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Payment } from "./Payments";
import { OneTimePayment } from "./Onetimepayments";
import { ProjectStatus } from "../Enums/paymentEnum";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  temple_name: string;

  @Column()
  temple_incharge_name: string;

  @Column()
  contact_no: string;

  @Column()
  temple_location: string;

  @Column({ type: "enum", enum: ProjectStatus })
  status: ProjectStatus;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Payment, payment => payment.project)
  payments: Payment[];

  @OneToMany(() => OneTimePayment, otp => otp.project)
  one_time_payments: OneTimePayment[];
}
