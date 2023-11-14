import { RiPingPongFill } from "react-icons/ri";

export default function Profile() {
  return (
    <div className="flex gap-5">
      <img src="https://via.placeholder.com/250" alt="profile" />
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">Marcelo lidão</h1>
          <p className="text-slate-200 italic">level 1</p>
        </div>
        <div className="flex gap-5">
          <div className="tooltip flex gap-2" data-tip="Vitórias">
            <RiPingPongFill className="text-3xl text-green-400" />
            <p className="text-slate-200">232</p>
          </div>
          <div className="tooltip flex gap-2" data-tip="Derrotas">
            <RiPingPongFill className="text-3xl text-red-400" />
            <p className="text-slate-200">232</p>
          </div>
        </div>
      </div>
    </div>
  );
}
