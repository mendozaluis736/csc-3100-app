// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(users);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result;
  if (name != undefined && job !== undefined) {
    result = findUserByNameAndJob(name, job);
  } else if (name !== undefined) {
    result = findUserByName(name);
  } else {
    return res.send(users);
  }
  res.send(result);
});
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});
const idGeneration = ()=>{
  return Math.random().toString(25).substring(2,); //tostring cause math.random is just a number and the id we have is a string substring since i didn't like that the id started with 0.
}
const addUser = (user) => {
  user["id"] = idGeneration();
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).send(newUser);
});
const deleteUser = (id) => {
  const len = users["users_list"].length;
  users["users_list"] = users["users_list"].filter((u) => u.id !== id);
  if (len !== users["users_list"].length){
    return true;
  }else{
    return false;
  }
};
app.delete("/users/:id", (req, res) => {
  const userToDelete = req.params.id;
  const del = deleteUser(userToDelete);
  if (del){
    res.status(204).send(users["users_list"]);
  }else{
    res.status(404).send("resource not found")
  }
});
