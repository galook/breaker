const express = require("express");
const app = express();

const sql = require("mysql");

const scon = sql.createPool({
  host: "localhost",
  database: "qqpublic",
  user: "root",
  password: "toorquvia",
});

app.use(express.json());

app.get("/", function (req, res) {
  res.send("hello world");
});
app.get("/worker", (req, res) => {
  if (!req.body.name) return res.send(em("No name specified"));

  scon.query(
    `SELECT * FROM \`qq-detonator\` WHERE name='${req.body.name}'`,
    (err, result) => {
      if (err) return res.send(em("SQL Error", err));
      res.send(qm(result));
    }
  );
});
app.post("/worker", async (req, res) => {
  let b = req.body;
  if (!(b.name && b.data)) return res.send(em("No name specified"));
  scon.query(`SHOW TABLES`, (err, result) => {
    if (err) return res.send(em("SQL Error", err));
    console.log(result);
    
    if(!result.includes(res.name)) scon.query(
      `CREATE TABLE \`name\` ( \`name\` TEXT NOT NULL , \`type\` TEXT NOT NULL , \`text\` TEXT NOT NULL ) ENGINE = InnoDB;`,
      (err, result) => {
        if (err) return res.send(em("SQL Error", err));
        await putIntoDB(b, res)
      }
    ); await putIntoDB(b, res)
  });
});

app.all("/test", (req, res) => {
  res.send("hey");
});
app.all("/bodyshow", (req, res) => {
  res.send(req.body);
});

try {
  app.listen(7551);
} catch (e) {
  throw e;
}

/**
 *
 * @param {String} msg Human-readable description of what fucked up
 * @param {any} detail Error or any supporting evidence
 */

let em = (msg, detail) => {
  return {
    ok: false,
    msg: msg,
    detail: detail ? detail : "No detail specified",
  };
};

let qm = (result, msg) => {
  return {
    ok: true,
    result: result,
    msg: msg ? msg : "",
  };
};

let putIntoDB = (req, res) => {
req.data.forEach((item, i) => {
  scon.query(`INSERT INTO \`${req.name}\`(name, type, text) VALUES ([\`${item.name}\`], [\`${item.type}\`], [\`${item.text}\`])`, (err, result) => {
    if (err) res.send(em("SQL Error", error));
    if (i == req.data.length - 1) res.send(qm(result, "finished successfully"))
  })

})
}
