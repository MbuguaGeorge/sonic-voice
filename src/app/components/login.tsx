import { signIn, signOut, useSession } from 'next-auth/react';

const Login = () => {
  const { data: session, status } = useSession();

  if (status === 'authenticated'){
    return <button onClick={() => signOut()} >logout</button>
  } else {
    return <button onClick={(e) => {
      e.preventDefault();
      signIn('spotify', { callbackUrl: "http://localhost:3000" })}} 
      className="text-2xl text-slate-950 w-64 px-6 py-4 bg-slate-300 rounded-full hover:bg-green-800 hover:text-white">
      Login to Spotify</button>
  }
};

export default Login;