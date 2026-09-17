// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";
function MyApp() {
  const [characters, setCharacters] = useState([]);
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    return promise;
  }
  function deleteUser(id){
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
    return promise;
  }
  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.error(`failed, status ${response.status}`);
        }
      })
      .then((user)=>{
        if (user){
          setCharacters([...characters, user]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacter(id) {
    deleteUser(id).then((response)=>{
      if (response.status === 204){
        const updated = characters.filter((character) => {
          return character.id !== id;
        });
        setCharacters(updated);
      } else if (response.status == 404){
          console.error("resource not found");
      }else{
        console.error('unkown error');
      }
    }).catch((error) => {
      console.log(error);
  });
}
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;
