import { toast, ToastContainer, Bounce } from "react-toastify";

const teamInvitePage = () => {

  return (
    <>
      <h1 className="pageHeading">Accept invite</h1>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            progress={undefined}
            theme="light"
            transition={Bounce}
        />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const req = context.req;

  try {
    const token = context.query.token;
    const orgName = context.query.org;
    if (!token) {
      throw new Error("Missing activation code.");
    }

    const response = await fetch(
      `${process.env.REACT_APP_API || 'http://localhost:4090'}/team/teamAccept`,
      {
        method: "POST",
        credentials: "include",
        // Forward the authentication cookie to the backend
        headers: {
          "Content-Type": "application/json",
          Cookie: req ? req.headers.cookie : undefined,
        },
        body: JSON.stringify({
          teamId: token,
          orgName: orgName,
        }),
      }
    );
    const data = await response.json();

    if (data.errCode) {
      throw new Error(data.message);
    } else {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
        return {
            props: {
            activated: true,
            },
        };
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        activated: false,
        message: err.message || "The activation process failed.",
      },
    };
  }
};

export default teamInvitePage;