export interface SchoolApi {
  uuid: string;
  name: string;
  color: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
}
