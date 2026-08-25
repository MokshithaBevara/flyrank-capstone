import ChatCoach from "../components/ChatCoach";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Habit Tracker Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Chat with your AI habit coach for tips on building and sticking to habits.
      </p>
      <ChatCoach />
    </div>
  );
}