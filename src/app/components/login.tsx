import { signIn, signOut, useSession } from 'next-auth/react';

const Login = () => {
  const { data: session, status } = useSession();

  if (status === 'authenticated'){
    return <button onClick={() => signOut()} >logout</button>
  } else {
    return <button onClick={(e) => {
      e.preventDefault();
      signIn('spotify', { callbackUrl: "http://localhost:3000" })}} 
      className="text-base text-white w-64 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 hover:text-white">
      Login using Spotify</button>
  }
};

export default Login;