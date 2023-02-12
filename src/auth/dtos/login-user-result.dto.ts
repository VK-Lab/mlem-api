export class LoginUserResultDto {
  public accessToken!: string;
  public isVerifyPhone?: boolean;
  public userId!: string;
  public isPhoneExist?: boolean;
}
