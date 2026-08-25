async function getHealthData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch health data");
  }
  return res.json();
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Health Check</h1>
      <p>Status: OK</p>
      <p>Sample fetched data:</p>
      <pre style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}