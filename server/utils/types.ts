import { UserRole } from "@prisma/client";

export interface AuthContext {
  jwt: {
    sign: (payload: object) => string;
    verify: (token: string) => object;
  };
  log: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
  };
  set: {
    status: number;
  };
  cookie: {
    token: {
      set: (options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: string;
        path: string;
        maxAge?: number;
        value: object | string;
        expires?: Date;
      }) => void;
    };
  };
  id?: string;
}

export interface AuthContextWithBody<TBody> extends AuthContext {
  body: TBody;
}

export interface RegisterBody {
  email: string;
  name: string;
  username: string;
  password: string;
  userRole: UserRole;
}
export interface LoginBody {
  email: string;
  password: string;
}
