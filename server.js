const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// SIGNUP
app.post("/Register", (req, res) => {

  const {
    Fullname,Role,Age,Gender,State,District,Sub_District,Address,Pincode,Contact, create_password
  } = req.body;

  if(!Fullname ){
    return res.send("Required fields missing");
  }

  const sql = `
    INSERT INTO users 
    (Fullname, Role, Age, Gender, State, District, Sub_District, Address, Pincode, Contact, create_password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
  `;

  db.query(sql,
    [Fullname, Role, Age, Gender, State, District, Sub_District, Address, Pincode, Contact, create_password ],
    (err, result) => {

      if(err){
        console.log("SQL ERROR:", err);
        return res.send("Error saving data");
      }

      res.send("signup successful");
    }
  );
});

// LOGIN
app.post("/login", (req, res)=>{
  const { Fullname, create_password } = req.body;

  const sql="SELECT * FROM users WHERE Fullname=? AND create_password=?";

  db.query(sql, [Fullname, create_password], (err, result)=> {
    if(err) throw err;

    if(result.length > 0) {
      res.send({status: "success"});
    } else {
      res.send({status: "fail"});
    }
  });
});

// TEST
app.get("/", (req, res) => {
  res.send("Server Running ✅");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000 🚀");
});

// GET
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});


app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM users WHERE id=?",
    [id],
    (err, result) => {
      if(err){
        console.log(err);
        return res.send("Delete Failed");
      }

      res.send("User Deleted Successfully");
    }
  );
});

app.post("/updateUser", (req, res) => {

  const {
    Fullname,
    Contact,
    Role,
    Age,
    Gender,
    State,
    District,
    sub_District,
    Address,
    Pincode,
    oldContact
       // 🔥 old contact use करेंगे
  } = req.body;

  const sql = `
    UPDATE users 
    SET Fullname=?, Contact=?, Role=?, Age=?, Gender=?, State=?, District=?, Sub_District=?, Address=?, Pincode=? 
    WHERE Contact=?
  `;

  db.query(
    sql,
    [Fullname, Contact, Role, Age, Gender, State, District, Sub_District, Address, Pincode, oldContact],
    (err, result) => {
      if(err){
        console.log(err);
        res.send("❌ Error updating user");
      } else {
        res.send("✅ Profile updated in database");
      }
    }
  );
});

app.post("/deleteAccount", (req, res) => {
  const { contact } = req.body;

  db.query("DELETE FROM users WHERE contact = ?", [contact], (err, result) => {
    if(err){
      console.log(err);
      return res.send("Error deleting user");
    }

    res.send("User deleted successfully");
  });
});

/*app.post("/submit", (req, res) => {

  const { create_password } = req.body;

  const sql = `
    INSERT INTO users (create_password)
    VALUES (?)
  `;

  db.query(sql, [create_password ], (err, result) => {

    if(err){
      console.log(err);
      return res.send("Database Error");
    }

    res.send("Data Stored Successfully ✅");

  });

});
*/

// GET last selected work
app.get("/get-work", (req, res) => {
  const sql = "SELECT * FROM selected_work ORDER BY id DESC LIMIT 1";

  db.query(sql, (err, result) => {
    if (err) return res.json({ success: false, err });

    res.json(result[0]); // latest work
  });
});

app.put("/update/:id",(req,res)=>{

  const id = req.params.id;

  const {
    skills,
    price,
    hired
  } = req.body;

  const sql =
  "UPDATE users SET skills=?, price=?, hired=? WHERE id=?";

  db.query(
    sql,
    [skills, price, hired, id],
    (err,result)=>{

      if(err){
        return res.send("Update Failed");
      }

      res.send("Updated Successfully");
    }
  );

});