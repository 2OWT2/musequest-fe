import QuestBoard from "@/components/quest-board";
import demoWorld from "@/lib/demo-world.json";
import type { World } from "@/lib/world";

export default function Home() {
  return (
    <QuestBoard
      initialWorld={demoWorld as World}
      connected={process.env.MUSEQUEST_DATA_MODE === "api"}
    />
  );
}
