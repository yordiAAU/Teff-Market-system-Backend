export interface JwtPayload {
  userId: string;
  email: string;
  role: "admin" | "farmer" | "customer";
}