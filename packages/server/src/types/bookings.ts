export type BookingStatus = "accepted" | "pending" | "rejected";

export interface BookingFromDB {
  booking_id: string;
  booker_id: string;
  first_name: string;
  last_name: string;
  departure_time: Date;
  arrival_time: Date;
  status: BookingStatus;
  comments: string;
  companions: number;
  house_id: string;
  name?: string;
}

export interface BookingForClient {
  bookingId: BookingFromDB["booking_id"];
  firstName: BookingFromDB["first_name"];
  lastName: BookingFromDB["last_name"];
  arrivalTime: BookingFromDB["arrival_time"];
  departureTime: BookingFromDB["departure_time"];
  status: BookingFromDB["status"];
  comments: BookingFromDB["comments"];
  companions: BookingFromDB["companions"];
  houseId: BookingFromDB["house_id"];
  houseName?: BookingFromDB["name"];
}

export interface NewBookingProperties {
  accountId: string;
  arrivalTime: string;
  departureTime: string;
  comments: string;
  companions: string;
  houseId: string;
}

export interface UpdatedBookingProperties {
  arrivalTime?: NewBookingProperties["arrivalTime"];
  departureTime?: NewBookingProperties["departureTime"];
  comments: NewBookingProperties["comments"];
  companions: NewBookingProperties["companions"];
}

export interface BookingForDBInsert {
  booker_id: BookingFromDB["booking_id"];
  arrival_time: string;
  departure_time: string;
  comments: BookingFromDB["comments"];
  companions: number;
  status: BookingFromDB["status"];
  house_id: BookingFromDB["house_id"];
}

export interface BookingForDBUpdate {
  arrival_time?: BookingForDBInsert["arrival_time"];
  departure_time?: BookingForDBInsert["departure_time"];
  comments: BookingFromDB["comments"];
  companions: number;
  status: BookingFromDB["status"];
}
