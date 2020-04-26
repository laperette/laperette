type BookingConstructorArgs = {
  end_date: Date;
  name: string;
  start_date: Date;
  surname: string;
};

export class Booking {
  readonly end_date: Date;
  readonly name: string;
  readonly start_date: Date;
  readonly surname: string;

  constructor(args: BookingConstructorArgs) {
    this.end_date = args.end_date;
    this.name = args.name;
    this.start_date = args.start_date;
    this.surname = args.surname;
  }
}
