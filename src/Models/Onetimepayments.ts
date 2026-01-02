import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { AreaRep } from "./Area_reps";
import { Project } from "./Projects";
import { PaymentMode } from "../Enums/paymentEnum";

@Entity("one_time_payment")
export class OneTimePayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date_of_pay: Date;

  @Column({ type: "enum", enum: PaymentMode })
  mode: PaymentMode;

  @Column()
  amount: number;

  @Column()
  transaction_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => AreaRep, ar => ar.one_time_payments)
  @JoinColumn({ name: "area_rep_id" })
  area_rep: AreaRep;

  @ManyToOne(() => Project, p => p.one_time_payments)
  @JoinColumn({ name: "project_id" })
  project: Project;
}
