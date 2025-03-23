import { useEffect } from "react";

import cookies from ".././components/libs/getCookie";

const LogoutPage = () => {
  useEffect(() => {
    const logoutOnServer = async () => {
      try {
        await fetch(`${process.env.REACT_APP_API || 'http://localhost:4090'}/users/logout`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        window.location.href = "/login";
      } catch (err) {
        console.log(err);
      }
    };
    logoutOnServer();
  }, []);
  return null;
};

export const getServerSideProps = async (context) => {
  const { token } = cookies(context);
  const res = context.res;

  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }

  return { props: {} };
};

export default LogoutPage;