const { createClient } = require("redis");
async function redisDemo() {
  const client = createClient();

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  //   await client.set("cronStatus", "true");
  const value = await client.get("cronStatus");
  console.log(value);
}

redisDemo();
