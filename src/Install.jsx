import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Octokit } from "@octokit/core";

const Install = () => {
  const [installId, setInstallId] = useState("");
  const profileData = localStorage.getItem("githubData");
  const profile = profileData ? JSON.parse(profileData) : null;
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState("");
  const [installToken, setInstallToken] = useState([]);
  const [username, setUserName] = useState("");
  const [repos, setRepos] = useState("");

  const generateInstallationUrl = () => {
    // Replace "<your-app-name>" with your actual GitHub App name
    return `https://github.com/apps/Install-App-Testing`;
  };

  const handleInstallClick = async () => {
    const installationUrl = generateInstallationUrl();
    window.location.href = installationUrl;
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:8080/generate-jwt");
        setJwtToken(response.data);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const fetchUserName = async () => {
    const octokit = new Octokit({
      auth: `Bearer ${jwtToken.token}`,
    });

    try {
      const response = await octokit.request("GET /app", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      setUserName(response.data.owner.login);
      // Do something with the response data
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, [jwtToken]);

  const fetchInstallation = useCallback(
    async (username) => {
      try {
        const octokit = new Octokit({
          auth: `${jwtToken.token}`,
        });

        const response = await octokit.request(
          `GET /users/${username}/installation`
        );
        const newInstallId = response.data.id;
        setInstallId(newInstallId); // Update the state immediately
        window.close();
      } catch (error) {
        console.error("Error fetching installation:", error);
      }
    },
    [jwtToken]
  );

  console.log(installId, "installId");

  useEffect(() => {
    if (jwtToken && username) {
      fetchInstallation(username);
    }
  }, [jwtToken, username]);

  useEffect(() => {
    const octokit = new Octokit({
      auth: `Bearer ${jwtToken.token}`,
    });

    const fetchAccessToken = async () => {
      try {
        const response = await octokit.request(
          "POST /app/installations/{installation_id}/access_tokens",
          {
            installation_id: installId,
          }
        );
        const accessToken = response.data.token;
        setInstallToken(accessToken);
      } catch (error) {
        console.error("Error obtaining access token:", error);
      }
    };

    fetchAccessToken();
  }, [jwtToken, installId]);

  console.log("install access token", installToken);
  console.log("User access token", profile?.access_token);

  async function fetchData() {
    const octokit = new Octokit({
      auth: `Bearer ${installToken}`,
    });

    try {
      console.log(installToken, "FROM REPOS");
      const response = await octokit.request(
        "GET /user/installations/{installation_id}/repositories",
        {
          installation_id: installId,
          per_page: 100,
          page: 1,
          visibility: "all",
          headers: {
            Accept: "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      console.log(response.data);
      // Do something with the response data
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      const octokit = new Octokit({
        auth: `Bearer ${installToken}`,
      });

      try {
        const response = await octokit.request(
          "GET /installation/repositories?per_page=100",
          {
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        setRepos(response.data.repositories); // Do something with the response data
      } catch (error) {
        console.error(error);
      }
    };

    fetchRepos();
  }, [installToken]);

  console.log(repos);

  const onLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, []);

  return (
    <div>
      <button
        onClick={onLogout}
        className="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3"
      >
        Sign Out
      </button>

      {!installId ? (
        <button
          onClick={handleInstallClick}
          className="flex items-center mt-3 mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-github"
            viewBox="0 0 16 16"
            style={{ marginRight: "5px" }}
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Install My App
        </button>
      ) : (
        <div>
          <h1>Installations</h1>
          <p>Current Install ID: {installId}</p>
          <div>
            {repos.length !== 0 ? (
              <ol>
                {repos.map((repo) => (
                  <li key={repo.id}>{repo.name}</li>
                ))}
              </ol>
            ) : (
              <p>No repos</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Install;
