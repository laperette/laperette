import { transports, createLogger, format } from "winston";

const getLogLevel = () => {
  switch (process.env.NODE_ENV || "development") {
    case "development":
      return "debug";
    case "test":
      return "warn";
    default:
      return "info";
  }
};
export const logger = createLogger({
  level: getLogLevel(),
  format: format.combine(format.colorize(), format.timestamp(), format.json()),
  transports: [new transports.Console()],
  // silent: process.env.NODE_ENV === "test",
});

export const sanitizeError = (error: Error) => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
};
