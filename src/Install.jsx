import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Install = () => {
  const [installations, setInstallations] = useState([]);
  const [installId, setInstallId] = useState(null);
  const profileData = localStorage.getItem("githubData");
  const profile = profileData ? JSON.parse(profileData) : null;
  const navigate = useNavigate();

  const generateInstallationUrl = () => {
    // Replace "<your-app-name>" with your actual GitHub App name
    return `https://github.com/apps/Install-App-Testing`;
  };

  // Step 3: Direct the User to Install Your App
  const handleInstallClick = () => {
    const installationUrl = generateInstallationUrl();
    const popupWindow = window.open(
      installationUrl,
      "_blank",
      "width=600,height=600"
    );

    // Delay the closing of the popup window
    setTimeout(() => {
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    }, 10000); // Adjust the delay (in milliseconds) as needed
  };

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/user/installations",
          {
            headers: {
              Authorization: `Bearer ${profile?.access_token}`,
              Accept: "application/vnd.github.v3+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        const fetchedInstallations = response.data.installations;
        setInstallations(fetchedInstallations);

        const matchedInstallation = fetchedInstallations.find(
          (installation) => installation.account.login === profile?.login
        );

        if (matchedInstallation) {
          setInstallId(matchedInstallation.id);
        } else {
          setInstallId(null);
          console.log("Installation not found for the current user.");
        }
      } catch (error) {
        console.error("Error fetching installations:", error);
      }
    };

    fetchInstallations();
  }, [profile?.access_token, profile?.login]);

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
      <div>
        <h1>Installations</h1>
        <ul>
          {installations.map((installation) => (
            <li key={installation.id}>{installation.name}</li>
          ))}
        </ul>
        <p>Current Install ID: {installId}</p>
      </div>
      {!installId && (
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
      )}
    </div>
  );
};

export default Install;
