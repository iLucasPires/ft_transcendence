import Link from "next/link";
import { FaAngellist, FaGamepad } from "react-icons/fa";
import { BsFillChatDotsFill } from "react-icons/bs";

export default function AsideBar() {
  return (
    <aside className="flex flex-col w-24 h-full justify-between bg-primary items-center p-10">
      <Link href="/" className="btn ">
        <FaAngellist className="text-3xl text-slate-200" />
      </Link>

      <nav>
        <ul>
          <li>
            <Link href="/games" className="btn mt-5">
              <FaGamepad className="text-3xl text-slate-200" />
            </Link>
          </li>
          <li>
            <Link href="/chat" className="btn mt-5">
              <BsFillChatDotsFill className="text-3xl text-slate-200" />
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
