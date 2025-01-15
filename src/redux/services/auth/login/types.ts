interface LoginResponse {
  message: string;
  status: number | string;
  data: {employeeId: string | number};
}

interface LoginApiArgs {
  customerCode: string;
  userName: string;
  password: string;
}
interface FCMArgs{
  fcmTokens:string ;
}

export type {LoginResponse, LoginApiArgs,FCMArgs};
