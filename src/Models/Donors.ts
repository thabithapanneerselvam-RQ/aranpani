import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from "typeorm";
import { AreaRep } from "./Area_reps";
import { GroupMember } from "./Group_members";
import { Payment } from "./Payments";
import { DonorStatus } from "../Enums/paymentEnum";

@Entity("donors")
export class Donor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "donor_name" })
  donorName: string;

  @Column({ name: "phone_no" })
  phoneNo: string;

  @Column()
  address: string;
  
  @Column({nullable: true})
  email: string;

  @Column()
  district: string;

  @Column()
  pincode: string;

  @Column({ type: "enum", enum: DonorStatus })
  status: DonorStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => AreaRep, ar => ar.donors)
  @JoinColumn({ name: "area_rep_id" })
  areaRep: AreaRep;

  @OneToMany(() => GroupMember, gm => gm.donor)
  groupMembers: GroupMember[];

  @OneToMany(() => Payment, p => p.donor)
  payments: Payment[];
}
