import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from "typeorm";
import { AreaRep } from "./Area_reps";
import { GroupMember } from "./Group_members";
import { Payment } from "./Payments";
import { DonorStatus } from "../Enums/paymentEnum";

@Entity("donors")
export class Donor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  donor_name: string;

  @Column()
  phone_no: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  district: string;

  @Column()
  pincode: string;

  @Column({ type: "enum", enum: DonorStatus })
  status: DonorStatus;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => AreaRep, ar => ar.donors)
  @JoinColumn({ name: "area_rep_id" })
  area_rep: AreaRep;

  @OneToMany(() => GroupMember, gm => gm.donor)
  group_members: GroupMember[];

  @OneToMany(() => Payment, p => p.donor)
  payments: Payment[];
}
