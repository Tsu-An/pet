const express = require("express");
const mysql = require("mysql");
const app = express();
const router = express.Router();
const util = require("util");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//express使用ejs作為模板引擎
app.set("view engine", "ejs");

const conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "pet",
});

conn.connect(function (err) {
  if (err) {
    console.log(JSON.stringify(err));
    return;
  }
});

const query = util.promisify(conn.query).bind(conn);

router.get("/health/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Query eyesearsmouth table
    const data = await query("SELECT * FROM eyesearsmouth WHERE id = ?", [id]);

    // Query heal table
    const dataHeal = await query(
      "SELECT howTocheck, howToheal, healDetail FROM heal WHERE hid = ?",
      [id]
    );

    // Send combined response
    res.json({ data: data[0], dataHeal: dataHeal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

module.exports = router;
