import type { PartitionerArgs } from "kafkajs";
import { Kafka, logLevel, CompressionTypes, CompressionCodecs } from "kafkajs";
const SnappyCodec = require("kafkajs-snappy");
import { partition } from "../utils/create-sticky-partitioner";

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

  // const MyPartitioner: ICustomPartitioner = () => {
  //   return ({ topic, partitionMetadata, message }) => {
  //     // select a partition based on some logic
  //     // return the partition number
  //     return 0;
  //   };
  // };

  const createPartitioner =
    () =>
    ({ message, partitionMetadata, topic }: PartitionerArgs) => {
      if (!message.key) {
        return 0;
      }
      console.log(partition(message.key as string, partitionMetadata.length));
      console.log(partitionMetadata);
      return partition(message.key as string, partitionMetadata.length);
    };

  const producer = kafka.producer({
    allowAutoTopicCreation: true,
    idempotent: true,
    maxInFlightRequests: 5,
    retry: {
      maxRetryTime: 120000,
      retries: Number.MAX_SAFE_INTEGER
    },
    createPartitioner
  });

  await producer.connect();

  for (let i = 0; i < 10; i += 1) {
    producer.send({
      messages: [
        {
          key: getMessageKey(i),
          value: `Message ${i}`
        }
      ],
      topic: KAFKA_TOPIC,
      compression: CompressionTypes.Snappy
    });
  }

  // const stream = new WikimediaStream([WIKIMEDIA_STREAM_NAME]);

  // stream.on("mediawiki.recentchange", async (data, evemt) => {
  //   await producer.send({
  //     acks: -1,
  //     topic: KAFKA_TOPIC,
  //     messages: [{ value: JSON.stringify(data) }],
  //     compression: CompressionTypes.Snappy
  //   });
  // });
}

main();
