import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const addPost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3000/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        body: body,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => {
      alert("post added");
      navigate("/");
      window.location.reload();
    });
  }

  return (
    <div>
      <h1 className="text-center my-4">Add Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          maxLength={100}
          value={title}
          type="text"
          className="form-control"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          required={true}
        />
        <textarea
          value={body}
          cols="30"
          rows="10"
          maxLength={300}
          placeholder="write here"
          className="form-control my-3"
          onChange={(e) => setBody(e.target.value)}
          required={true}
        ></textarea>
        <button className="btn btn-primary">Add </button>
      </form>
    </div>
  );
};

export default addPost;
