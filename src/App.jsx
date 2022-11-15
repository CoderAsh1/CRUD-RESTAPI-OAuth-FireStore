import { useEffect, useState } from "react";
import "./App.css";
import AddPost from "./Components/AddPost";
import { Link, Routes, Route } from "react-router-dom";
import EditPost from "./Components/EditPost";

import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";

function App() {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState([]);

  //google authentication -START

  const clientId =
    "100837649985-kibvr1p8uqs27cnnn78cmg9sfsldpm8r.apps.googleusercontent.com";

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const onSuccess = (res) => {
    setProfile(res.profileObj);
    console.log("success:", res.profileObj);
  };
  const onFailure = (err) => {
    console.log("failed:", err);
  };
  function logOut() {
    setProfile(null);
  }

  console.log(profile);
  //google authentication --END

  useEffect(() => {
    async function getPosts() {
      let rawData = await fetch("http://localhost:3000/posts");
      rawData = await rawData.json();
      console.log(rawData);
      setPosts(rawData);
    }
    getPosts();
    setProfile(null);
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Are you Sure?")) {
      fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then(() => {
        window.location.reload();
      });
    }
  }

  return (
    <div className="App">
      <div className="auth">
        {profile ? (
          <>
            <div className="profile">
              <img
                src="https://lh3.googleusercontent.com/a/ALm5wu2ic5i26z70YgrRoBXzmzJ1m2V11NWKjojDGMRb=s96-c"
                alt="imageUrl"
              />
              <h6>{profile.email}</h6>
            </div>
            <div className="logout">
              <GoogleLogout
                clientId={clientId}
                buttonText="Log out"
                onLogoutSuccess={logOut}
              />
            </div>
          </>
        ) : (
          <div className="logout">
            <GoogleLogin
              clientId={clientId}
              buttonText="Sign in"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
            />
          </div>
        )}
      </div>
      <Link
        to="/add"
        className={
          !profile
            ? "add btn btn-primary text-white disabled"
            : "add btn btn-primary text-white"
        }
      >
        +
      </Link>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <>
              <h1 className="text-center my-4">Posts</h1>
              <div className="posts d-flex gap-3 flex-wrap">
                {!posts.length && (
                  <h2 className="w-100 text-center bg-gradient">
                    Click + to add a Posts
                  </h2>
                )}
                {posts.map((post) => (
                  <div
                    className="card bg-black border-1 border-primary"
                    key={post.id}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text ">{post.body}</p>
                      <div className="btns position-absolute bottom-0 py-2 ">
                        <Link
                          to={"/edit/" + post.id}
                          className={
                            profile
                              ? "btn btn-primary"
                              : "btn btn-primary disabled"
                          }
                        >
                          Edit
                        </Link>

                        <button
                          className={
                            profile
                              ? "btn btn-danger ms-2"
                              : "btn btn-danger disabled ms-2"
                          }
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          }
        />
        <Route exact path="/add" element={<AddPost />} />
        <Route exact path="/edit/:id" element={<EditPost />} />
      </Routes>
    </div>
  );
}

export default App;
