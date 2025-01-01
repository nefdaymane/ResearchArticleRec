import { JwtPayload as BaseJwtPayload } from 'jwt-decode';

export interface JwtPayload extends BaseJwtPayload {
  sub: string;
  email: string;
  firstName: string;
    lastName: string;
    exp: number;
}