import api from "@/lib/api";
import type { ApiResponse, RegisterData } from "@/lib/api-types";
import type { AuthUser } from "@/store/authStore";
import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
} from "@/lib/validation/auth";

interface LoginData {
  user: AuthUser;
  accessToken: string;
}

export const loginUser = (values: LoginFormValues) =>
  api
    .post<ApiResponse<LoginData>>("/auth/login", values)
    .then((res) => res.data);

export const registerUser = (values: RegisterFormValues) => {
  const { confirmPassword, ...payload } = values;
  return api
    .post<ApiResponse<RegisterData>>("/auth/register", payload)
    .then((res) => res.data);
};

export const forgotPassword = (values: ForgotPasswordFormValues) =>
  api
    .post<ApiResponse<null>>("/auth/forgot-password", values)
    .then((res) => res.data);

export const resetPassword = (values: { token: string; password: string }) =>
  api
    .post<ApiResponse<null>>("/auth/reset-password", values)
    .then((res) => res.data);
