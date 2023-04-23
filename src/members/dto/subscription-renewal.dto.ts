import { IsNotEmpty, IsString } from "class-validator";

export class SubscriptionRenewalDto {
    @IsNotEmpty()
    @IsString()
    expiryDate: Date;
}