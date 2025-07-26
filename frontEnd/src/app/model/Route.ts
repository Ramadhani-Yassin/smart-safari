export interface Route {
  id?: number;
  origin: string;
  destination: string;
  price: number;
  createdAt?: string;
}

export interface RouteResponse {
  success: boolean;
  message: string;
  data: Route[];
} 