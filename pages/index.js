import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex content-center justify-between">
        <div className=" flex justify-center items-center  ">
          <h2 className="">
            Hello, <b>{session?.user?.name}</b>
          </h2>
        </div>
        <div className="flex items-center  bg-gray-300 gap-1 text-black p-2 rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt=""
            className=" rounded-full w-10 h-10"
          />
          <div className=" text-center">{session?.user?.name}</div>
        </div>
      </div>
    </Layout>
  );
}
