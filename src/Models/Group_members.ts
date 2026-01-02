import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Donor } from "./Donors";

@Entity("group_members")
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone_no: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Donor, donor => donor.group_members)
  @JoinColumn({ name: "donor_id" })
  donor: Donor;
}
