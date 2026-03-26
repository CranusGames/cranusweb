import { notFound } from "next/navigation";
import { getGameBySlug, games } from "@/lib/games";
import GameClient from "./GameClient";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = getGameBySlug(params.slug);
  if (!game) return notFound();
  return <GameClient game={game} />;
}
