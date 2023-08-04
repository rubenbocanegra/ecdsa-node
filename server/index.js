const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0493d4252af1d924fe74c2a0d6a825a2eb6d488099279a2360154db6508f4acf00a71b185d319be32c6503538d9b0f661d0f8ebfac9199adf9e464bca70e03bea6": 100,
  "04e35a613cd6b793535904de1a7ffbafc4b24a88bbb7d6e4d98f2e07aca28a37581d36fdece36c7b8ca65733a4b69507586899e5572a82da61c0b832c6ad2d2b54": 50,
  "04a25d7ad5bc259202c3d7010d5bc5dd9dc55f8003483646dd1530da1e8be412e49ffd3018496f0d2c756f9537a41960bcbc7a1016b4bb62e5aee008fd519b0ac4": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
