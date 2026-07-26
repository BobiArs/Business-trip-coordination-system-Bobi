import type {
  BusinessTrip,
  StatusHistoryEntry,
  Comment,
} from "../../entities/trip/model/types";
import { axiosInstance } from "./axiosInstance";

export const tripApi = {
  // GET запити
  getMyTrips: async () =>
    (await axiosInstance.get<BusinessTrip[]>("/business-trips/my")).data,
  getAllTrips: async () =>
    (await axiosInstance.get<BusinessTrip[]>("/business-trips")).data,
  getTripById: async (id: string) =>
    (await axiosInstance.get<BusinessTrip>(`/business-trips/${id}`)).data,
  getTripComments: async (id: string) =>
    (await axiosInstance.get<Comment[]>(`/business-trips/${id}/comments`)).data,
  getTripHistory: async (id: string) =>
    (
      await axiosInstance.get<StatusHistoryEntry[]>(
        `/business-trips/${id}/history`,
      )
    ).data,

  // POST запит
  createTrip: async (data: Partial<BusinessTrip>) => {
    const response = await axiosInstance.post<BusinessTrip>(
      "/business-trips",
      data,
    );
    return response.data;
  },

  // PATCH запит
  updateStatus: async (id: string, statusId: string) => {
    const response = await axiosInstance.patch<BusinessTrip>(
      `/business-trips/${id}/status`,
      { statusId },
    );
    return response.data;
  },

  // POST (коментар) запит
  addComment: async (id: string, text: string) => {
    const response = await axiosInstance.post<Comment>(
      `/business-trips/${id}/comments`,
      { text },
    );
    return response.data;
  },
};
