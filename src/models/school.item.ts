import type { FeatureGroup } from "leaflet";
import type { SchoolApi } from "./schoolApi.item";
import type { Trip } from "./trip.item";

export interface School extends SchoolApi {
  featureGroup: FeatureGroup;
  totalDistance: number;
  visible: boolean;
  trips: Trip[];
}
