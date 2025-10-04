import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      roles: Array<{
        id: string;
        name: string;
        permissions: any;
      }>;
      isBusinessAccount: boolean;
      businessApproved: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    roles?: Array<{
      id: string;
      name: string;
      permissions: any;
    }>;
    isBusinessAccount?: boolean;
    businessApproved?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    roles: Array<{
      id: string;
      name: string;
      permissions: any;
    }>;
    isBusinessAccount: boolean;
    businessApproved: boolean;
  }
}