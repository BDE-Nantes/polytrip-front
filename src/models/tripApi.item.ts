export interface TripApi {
  uuid: string;
  team: string;
  school: string;
  trip: {
    type: "LineString";
    coordinates: Array<[number, number]>;
  };
  distance: number;
}
