import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Double,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    ID: string;

    @Column({type: "varchar", length: 50})
    PRODUCTNAME: string;

    @Column({type: "varchar", nullable: false, length: 20})
    CATEGORY: string;

    @Column({type: "varchar", nullable: false, length: 100})
    DESCRIPTION: string;

    @Column({type: "decimal", nullable: false, precision: 2})
    PRICE: Double;

    @ManyToOne(type => User, user => user.PRODUCTS)
    USER: User;

    @CreateDateColumn()
    CREATED_AT: "string";

    @UpdateDateColumn()
    UPDATED_AT: "string";
}