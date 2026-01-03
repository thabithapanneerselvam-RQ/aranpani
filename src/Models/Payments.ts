import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Donor } from "./Donors";
import { Project } from "./Projects";
import { PaymentMode,PaymentRole,PaymentScheme } from "../Enums/paymentEnum";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date", name: "date_of_pay" })
  dateOfPay: Date;

  @Column({ type: "enum", enum: PaymentMode })
  mode: PaymentMode;

  @Column({ type: "enum", enum: PaymentRole })
  role: PaymentRole;

  @Column({ type: "enum", enum: PaymentScheme })
  scheme: PaymentScheme;

  @Column()
  amount: number;

  @Column({name: "transaction_id"})
  transactionId: string;

  @Column({name: "paid_by"})
  paidBy: string;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @ManyToOne(() => Donor, d => d.payments)
  @JoinColumn({ name: "donor_id" })
  donor: Donor;

  @ManyToOne(() => Project, p => p.payments)
  @JoinColumn({ name: "project_id" })
  project: Project;
}
