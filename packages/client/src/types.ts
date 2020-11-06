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

export interface NewBookingData {
  houseId: string;
  arrivalTime: string;
  departureTime: string;
  comments: string;
  companions: string;
}

export interface NewBookingBody {
  bookingId: string;
  arrivalTime: Date;
  departureTime: Date;
  comments: string;
  companions: number;
}
