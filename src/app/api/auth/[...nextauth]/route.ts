import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from 'next-auth/providers/spotify';
import axios from "axios";

const scope =
  "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";

const SPOTIFY_REFRESH_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      'base64'
    )
    const { data } = await axios.post(
      SPOTIFY_REFRESH_TOKEN_URL,
      {
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      },
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: { scope },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at * 1000,
          user
        }
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }
      const newToken = await refreshAccessToken(token)
      return newToken
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error
      session.user = token.user
      return session
    }
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };