export interface ApiResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  path: string;
  timestamp: string;
}

export interface PageApiResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;
  path: string;
  timestamp: string;
  total: number;
}
