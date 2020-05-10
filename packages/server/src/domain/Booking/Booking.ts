type BookingConstructorArgs = {
  endDate: Date;
  firstName: string;
  startDate: Date;
  lastName: string;
};

export class Booking {
  readonly endDate: Date;
  readonly firstName: string;
  readonly startDate: Date;
  readonly lastName: string;

  constructor(args: BookingConstructorArgs) {
    this.endDate = args.endDate;
    this.firstName = args.firstName;
    this.startDate = args.startDate;
    this.lastName = args.lastName;
  }
}
