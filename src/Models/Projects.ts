import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Payment } from "./Payments";
import { OneTimePayment } from "./Onetimepayments";
import { ProjectStatus } from "../Enums/paymentEnum";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: "temple_name"})
  templeName: string;

  @Column({name: "temple_incharge_name"})
  templeInchargeName: string;

  @Column({name:"contact_no"})
  contactNo: string;

  @Column({name: "temple_location"})
  templeLocation: string;

  @Column({ type: "enum", enum: ProjectStatus })
  status: ProjectStatus;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @OneToMany(() => Payment, payment => payment.project)
  payments: Payment[];

  @OneToMany(() => OneTimePayment, otp => otp.project)
  oneTimePayments: OneTimePayment[];
}
