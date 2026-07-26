import type {
  BusinessTripStatus,
  TripPurpose,
  UrgencyLevel,
} from "../../entities/trip/model/types";
import { axiosInstance } from "./axiosInstance";

export const statusApi = {
  getPurposes: async () =>
    (await axiosInstance.get<TripPurpose[]>("/trip-purposes")).data,
  getUrgencies: async () =>
    (await axiosInstance.get<UrgencyLevel[]>("/urgency-levels")).data,
  getStatuses: async () =>
    (await axiosInstance.get<BusinessTripStatus[]>("/business-trip-statuses"))
      .data,
};
