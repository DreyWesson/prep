import axios from "axios";
import { ElectricityReading, MeteringPoint, LoginResponse } from "./types";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.API_BASE_URL as string;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const errorHandler = (error: any, type: string, msg: string): Promise<never> => {
  return Promise.reject(new Error(`${type}: ${axios.isAxiosError(error) ? msg : String(error)}`));
};


export const authenticate = async (): Promise<string> => {
  const email = process.env.API_EMAIL as string;
  const password = process.env.API_PASSWORD as string;

  try {
    const response = await axiosInstance.post<LoginResponse>(
      `${baseUrl}/auth/login`,
      {
        email,
        password,
      }
    );
    return response.data.tokens.accessToken;
  } catch (error: any) {
    return errorHandler(error, "Authentication failed", error.message);
  }
};

export const getMeteringPoints = async (
  token: string
): Promise<MeteringPoint[]> => {
  try {
    const { data } = await axiosInstance.get<MeteringPoint[]>(
      `${baseUrl}/meteringpoints`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error: any) {
    return errorHandler(error, "Failed to get metering points", error.message);
  }
};

export const getElectricityReadings = async (
  token: string,
  meterId: string,
  from: number,
  to: number
): Promise<ElectricityReading[]> => {
  try {
    const { data } = await axiosInstance.get<ElectricityReading[]>(
      `${baseUrl}/meteringpoints/${meterId}/readings`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { from, to },
      }
    );
    return data;
  } catch (error: any) {
    return errorHandler(error, "Failed to get electricity readings", error.message);
  }
};
