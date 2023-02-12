import WikimediaStream from "wikimedia-streams";
import { Kafka, logLevel } from "kafkajs";

const WIKIMEDIA_STREAM_NAME = "recentchange";
const KAFKA_TOPIC = "wikimedia.recentchange.nodejs";

async function main() {
  const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: ["localhost:9092"],
    clientId: "jasen-client"
  });

  const producer = kafka.producer({
    allowAutoTopicCreation: true
  });

  await producer.connect();

  const stream = new WikimediaStream([WIKIMEDIA_STREAM_NAME]);

  stream.on("mediawiki.recentchange", async (data, evemt) => {
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(data) }]
    });
  });
}

main();
