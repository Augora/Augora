const winston = require("winston")
const Sentry = require("winston-transport-sentry-node").default

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new Sentry({
      sentry: {
        dsn:
          "https://8bcb9683b95b4cbabcb6ae7740485a9b@o261804.ingest.sentry.io/5263561",
      },
      level: "error",
    }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )
}

function GetLogger() {
  return logger
}

module.exports = {
  GetLogger,
}
