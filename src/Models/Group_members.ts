import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Donor } from "./Donors";

@Entity("group_members")
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: "phone_no"})
  phoneNo: string;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @ManyToOne(() => Donor, donor => donor.groupMembers)
  @JoinColumn({ name: "donor_id" })
  donor: Donor;
}
