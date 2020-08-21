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
  companions: string;
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
}

export interface NewBookingProperties {
  accountId: string;
  arrivalTime: string;
  departureTime: string;
  comments: string;
  companions: string[];
}

export interface UpdatedBookingProperties {
  arrivalTime?: NewBookingProperties["arrivalTime"];
  departureTime?: NewBookingProperties["departureTime"];
  comments: NewBookingProperties["comments"];
  companions: NewBookingProperties["companions"];
}

export interface BookingForDBInsert {
  booker_id: BookingFromDB["booking_id"];
  arrival_time: BookingFromDB["arrival_time"];
  departure_time: BookingFromDB["departure_time"];
  comments: BookingFromDB["comments"];
  companions: string[];
  status: BookingFromDB["status"];
}

export interface BookingForDBUpdate {
  arrival_time?: BookingFromDB["arrival_time"];
  departure_time?: BookingFromDB["departure_time"];
  comments: BookingFromDB["comments"];
  companions: string[];
  status: BookingFromDB["status"];
}
