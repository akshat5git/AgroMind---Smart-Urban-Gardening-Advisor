import { getServerSession } from "next-auth"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) {
    return <div>Unauthorized</div>
  }

  return <h1>Dashboard</h1>
}