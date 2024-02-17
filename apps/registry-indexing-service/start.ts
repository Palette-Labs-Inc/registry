import {
  contractAddress,
  getAndUpdateAllRelevantLogs,
  provider,
} from "./utils";
import { startGraph } from "./graph";
import { ethers } from "ethers";
import { NodeRegistry__factory } from "@palette-labs/registry-contracts";

require("dotenv").config();

let running = false;
let timeout: NodeJS.Timeout | null = null;

const POLLING_INTERVAL = process.env.POLLING_INTERVAL
  ? Number(process.env.POLLING_INTERVAL)
  : 60000;

const DISABLE_LISTENER = process.env.DISABLE_LISTENER;

const nodeRegistry = NodeRegistry__factory.connect(contractAddress, provider);


export async function update() {
  if (running) {
    return;
  }

  try {
    running = true;
    await getAndUpdateAllRelevantLogs();
  } catch (e) {
    console.log("Error!", e);
  }
  running = false;
}

function setGoTimeout() {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    console.log("Timeout occurred, calling go function");
    go();
  }, POLLING_INTERVAL);
}
async function go() {
  await update();
  setGoTimeout();
}

const eventTopicHash = nodeRegistry.getEvent("Registered").fragment.topicHash;

const filter = {
  topics: [
    [
      eventTopicHash
    ],
  ],
};

if (!DISABLE_LISTENER) {
  provider.on(filter, async (log: ethers.Log) => {
    go();
  });
}

go();
setGoTimeout();
startGraph();
