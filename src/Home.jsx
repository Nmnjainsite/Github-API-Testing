import "./App.css";
import { useCallback, useEffect } from "react";
import { LoginSocialGithub } from "reactjs-social-login";
import { useNavigate } from "react-router-dom";

function Home() {
  const REDIRECT_URI = "https://github-api-testing-one.vercel.app/";

  const navigate = useNavigate();

  const profileData = localStorage.getItem("githubData");
  const profile = profileData ? JSON.parse(profileData) : null;
  const login = profile && profile?.login;

  useEffect(() => {
    const loadData = async () => {
      if (login) {
        await navigate("/install");
      } else {
        await navigate("/");
      }
    };

    loadData();
  }, [login, navigate]);

  const onLogoutSuccess = useCallback(() => {
    localStorage.clear();
    alert("logout success");
  }, []);

  //   const handleProviderChange = useCallback((event) => {
  //     setProvider(event.target.value);
  //   }, []);

  console.log(profile);

  return (
    <div className="App">
      <div className="mt-5">
        <LoginSocialGithub
          client_id={"Iv1.cdb7a74f855d4060"}
          client_secret={"10ddc87f9a7fe9f6d1ebfd4b5b8eaed4ec052b27"}
          redirect_uri={REDIRECT_URI}
          // onLoginStart={onLoginStart}
          onLogoutSuccess={onLogoutSuccess}
          onResolve={({ provider, data }) => {
            navigate("/install");
            localStorage.setItem("githubData", JSON.stringify(data));
            localStorage.setItem("authProvider", "github");
          }}
          onReject={(err) => {
            console.log(err);
          }}
        >
          <button className="btn-sm text-sm font py-2 px-4 rounded text-white bg-gray-500 hover:bg-gray-600 w-full relative flex after:flex-1 group">
            <div className="flex-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-github"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <span className="flex-auto text-rose-50 pl-3">
              Continue With Github
              <span className="inline-flex tracking-normal text-rose-200 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">
                -&gt;
              </span>
            </span>
          </button>
        </LoginSocialGithub>
      </div>
    </div>
  );
}

export default Home;
