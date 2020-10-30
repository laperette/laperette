export interface Booking {
  arrivalTime: Date;
  departureTime: Date;
  firstName: string;
  lastName: string;
  bookingId: string;
  status: string;
  comments: string;
  companions: number;
  houseName?: string;
}

export interface House {
  houseId: string;
  name: string;
}
