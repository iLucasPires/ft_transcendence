import Link from "next/link";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to Transcendence</h1>
          <p className="py-6">enjoy the game with your friends and family</p>
          <Link href="/lobby" className="btn btn-primary">
            Get Started Game
          </Link>
        </div>
      </div>
    </div>
  );
}
