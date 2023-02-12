import { Kafka, logLevel, CompressionTypes, CompressionCodecs } from "kafkajs";
import WikimediaStream from "wikimedia-streams";
const SnappyCodec = require("kafkajs-snappy");

const WIKIMEDIA_STREAM_NAME = "recentchange";
const KAFKA_TOPIC = "wikimedia.recentchange.nodejs";

CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

const getMessageKey = (index: number) => {
  if (index % 10 === 0) return "full";
  if (index % 2 === 0) return "even";
  return "odd";
};

async function main() {
  const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: ["localhost:9092"],
    clientId: "jasen-client"
  });

  const producer = kafka.producer({
    allowAutoTopicCreation: true,
    idempotent: true,
    maxInFlightRequests: 5,
    retry: {
      maxRetryTime: 120000,
      retries: Number.MAX_SAFE_INTEGER
    }
  });

  await producer.connect();

  const stream = new WikimediaStream([WIKIMEDIA_STREAM_NAME]);

  stream.on("mediawiki.recentchange", async (data, evemt) => {
    await producer.send({
      acks: -1,
      topic: KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(data) }],
      compression: CompressionTypes.Snappy
    });
  });
}

main();
