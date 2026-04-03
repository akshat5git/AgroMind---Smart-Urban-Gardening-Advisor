"use client";
import Image from "next/image";
import {useSession} from "next-auth/react"

export default function Home() {
  const {data} = useSession();
  return <div>
    <h1 className="text-3xl font-bold underline">Hello world!</h1>
    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
    <p>{data ? `Logged in as ${data.user?.email}` : "Not logged in"}</p>
  </div>;
}
