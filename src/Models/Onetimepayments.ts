import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { AreaRep } from "./Area_reps";
import { Project } from "./Projects";
import { PaymentMode } from "../Enums/paymentEnum";
import { Donor } from "./Donors";

@Entity("one_time_payment")
export class OneTimePayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date", name: "date_of_pay" })
  dateOfPay: Date;

  @Column({ type: "enum", enum: PaymentMode })
  mode: PaymentMode;

  @Column()
  amount: number;

  @Column({name: "transaction_id"})
  transactionId: string;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @ManyToOne(() => AreaRep, ar => ar.oneTimePayments)
  @JoinColumn({ name: "area_rep_id" })
  areaRep: AreaRep;

  @ManyToOne(() => Donor, d => d.payments)
  @JoinColumn({ name: "donor_id" })
  donor: Donor; 

  @ManyToOne(() => Project, p => p.oneTimePayments)
  @JoinColumn({ name: "project_id" })
  project: Project;
}
