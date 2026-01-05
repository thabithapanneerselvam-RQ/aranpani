import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { OneTimePayment } from "./Onetimepayments";

@Entity("otp")
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNo: string;

  @Column()
  code: string;

  @Column({ type: "timestamp" })
  expiry: Date;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => OneTimePayment, otp => otp.id, { nullable: true })
  @JoinColumn({ name: "onetimepayment_id" })
  oneTimePayment: OneTimePayment;
}
