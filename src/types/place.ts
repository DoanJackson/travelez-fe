import { BaseResponse, PaginatedData } from "./api";

export interface PlaceResponseData {
  id: number;
  name: string;
  cityCode: string;
  codeName: string;
  country: string;
}

export type PlaceResponse = BaseResponse<PaginatedData<PlaceResponseData>>;
