import type { Polyline } from "leaflet";
import type { TripApi } from "./tripApi.item";

export interface Trip extends TripApi {
  polyline: Polyline;
  visible: boolean;
}
