import { redirect } from "next/navigation";
import { ManagerCard } from "~/app/authed/manager/components/ManagerCard";
import { getUserInfo } from "~/lib/auth/getUser";
import { prisma } from "~/lib/prisma";

export default async function ManagerPage() {
  const user = await getUserInfo();
  if (!user) {
    redirect("/auth/login");
  }
  const managers = await prisma.ticketManager.findMany({
    where: { creatorId: user?.id },
  });

  return (
    <ul>
      {managers.map((manager) => (
        <div key={manager.id} className="mt-2">
          <ManagerCard manager={manager} />
        </div>
      ))}
    </ul>
  );
}