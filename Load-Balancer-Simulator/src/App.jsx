import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SERVER_COUNT = 3;
const OVERLOAD_THRESHOLD = 6;

export default function App() {
  const createServers = () =>
    Array.from({ length: SERVER_COUNT }, (_, i) => ({
      id: i + 1,
      load: 0,
      handled: 0,
      active: true,
      overloaded: false,
      redistributing: false,
      cooldown: 0,
      message: "",
    }));

  const [rrServers, setRrServers] = useState(createServers());
  const [lcServers, setLcServers] = useState(createServers());
  const [running, setRunning] = useState(false);

  const scalingLock = useRef(false);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      generateTraffic();
      processCompletion();
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  // 🔥 SCALING
  const checkScaling = (servers, setServers) => {
    const allOverloaded = servers.every(
      (s) => s.load >= OVERLOAD_THRESHOLD
    );

    if (!allOverloaded) {
      scalingLock.current = false;
      return;
    }

    if (scalingLock.current) return;

    scalingLock.current = true;

    if (servers.length === 3) {
      setServers((prev) => [
        ...prev,
        {
          id: 4,
          load: 0,
          handled: 0,
          active: true,
          overloaded: false,
          redistributing: false,
          cooldown: 0,
          message: "🆕 Auto-created",
        },
      ]);
    } else if (servers.length === 4) {
      alert("🚨 All servers overloaded! Server creation limit exceeded.");
      setRunning(false);
    }
  };

  // 🔥 OVERLOAD HANDLING
  const handleOverload = (setServers, index) => {
    setServers((prev) => {
      const updated = prev.map((s) => ({ ...s }));
      const server = updated[index];

      if (!server.active) return prev;

      server.overloaded = true;
      server.redistributing = true;
      server.active = false;
      server.cooldown = 5;

      const excess = server.load - OVERLOAD_THRESHOLD;
      server.load = OVERLOAD_THRESHOLD;

      const receivers = updated.filter((s, i) => i !== index && s.active);

      if (receivers.length && excess > 0) {
        const share = Math.ceil(excess / receivers.length);

        receivers.forEach((r) => {
          r.load += share;
          r.handled += share;
          r.message = `⬅ From S${server.id} (+${share})`;
        });
      }

      const timer = setInterval(() => {
        setServers((prev2) => {
          const arr = [...prev2];
          const s = arr[index];

          if (s.cooldown > 1) {
            arr[index].cooldown -= 1;
          } else {
            clearInterval(timer);

            arr[index] = {
              ...s,
              cooldown: 0,
              active: true,
              overloaded: false,
              redistributing: false,
              message: "",
            };
          }

          return arr;
        });
      }, 1000);

      return updated;
    });
  };

  // 🔥 TRAFFIC (SMART CONTROL)
  const generateTraffic = () => {
    const base = rrServers.length === 4 ? 4 : 2;
    const requests = Math.floor(Math.random() * base) + base;

    for (let i = 0; i < requests; i++) {
      // ROUND ROBIN
      setRrServers((prev) => {
        let updated = [...prev];

        let index = updated.findIndex((s) => s.active);
        if (index === -1) index = 0;

        updated[index].load++;
        updated[index].handled++;

        if (updated[index].load > OVERLOAD_THRESHOLD) {
          handleOverload(setRrServers, index);
        }

        checkScaling(updated, setRrServers);
        return updated;
      });

      // LEAST CONNECTIONS
      setLcServers((prev) => {
        let updated = [...prev];

        const active = updated.filter((s) => s.active);
        const target = active.length
          ? active.reduce((min, s) => (s.load < min.load ? s : min))
          : updated[0];

        const index = updated.indexOf(target);

        updated[index].load++;
        updated[index].handled++;

        if (updated[index].load > OVERLOAD_THRESHOLD) {
          handleOverload(setLcServers, index);
        }

        checkScaling(updated, setLcServers);
        return updated;
      });
    }
  };

  // 🔥 COMPLETION
  const processCompletion = () => {
    const process = (setServers) => {
      setServers((prev) =>
        prev.map((s) => ({
          ...s,
          load:
            s.load > 0 && Math.random() < 0.5 ? s.load - 1 : s.load,
        }))
      );
    };

    process(setRrServers);
    process(setLcServers);
  };

  const reset = () => {
    setRunning(false);
    setRrServers(createServers());
    setLcServers(createServers());
    scalingLock.current = false;
  };

  const ServerCard = ({ server }) => (
    <div
      style={{
        ...styles.card,
        animation: server.overloaded
          ? "pulseRed 1s infinite"
          : server.redistributing
          ? "pulseGreen 1s infinite"
          : "none",
      }}
    >
      <h3>Server {server.id}</h3>

      <p>Load: {server.load}</p>
      <p>Handled: {server.handled}</p>

      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${Math.min(server.load * 10, 100)}%`,
            background: server.active ? "#22c55e" : "#6b7280",
          }}
        />
      </div>

      {!server.active && <p>⏸ STOPPED ({server.cooldown}s)</p>}
      {server.redistributing && <p>🔁 Redistributing...</p>}
      {!server.redistributing && server.message && <p>{server.message}</p>}
    </div>
  );

  const chartData = {
    labels: rrServers.map((s) => `Server ${s.id}`),
    datasets: [
      {
        label: "Round Robin",
        data: rrServers.map((s) => s.load),
        backgroundColor: "#3b82f6",
      },
      {
        label: "Least Connections",
        data: lcServers.map((s) => s.load),
        backgroundColor: "#22c55e",
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h1>⚖️ Load Balancer Simulator</h1>

      <div style={styles.buttons}>
        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div style={styles.layout}>
        <div style={styles.column}>
          <h2>Round Robin</h2>
          {rrServers.map((s) => (
            <ServerCard key={s.id} server={s} />
          ))}
        </div>

        <div style={styles.graphColumn}>
          <h2>Traffic Graph</h2>
          <Bar data={chartData} />
        </div>

        <div style={styles.column}>
          <h2>Least Connections</h2>
          {lcServers.map((s) => (
            <ServerCard key={s.id} server={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 🔥 STYLES + ANIMATIONS
const styles = {
  container: {
    padding: "20px",
    background: "#0f172a",
    color: "#fff",
    minHeight: "100vh",
    textAlign: "center",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "30px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  graphColumn: {
    width: "100%",
  },
  card: {
    background: "#1e293b",
    padding: "12px",
    margin: "10px",
    borderRadius: "10px",
    width: "180px",
    minHeight: "140px",
  },
  progressContainer: {
    background: "#334155",
    height: "8px",
    borderRadius: "5px",
    marginTop: "8px",
  },
  progressBar: {
    height: "100%",
  },
};

// 🔥 ADD KEYFRAMES
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes pulseRed {
  0% { box-shadow: 0 0 5px red; }
  50% { box-shadow: 0 0 20px red; }
  100% { box-shadow: 0 0 5px red; }
}`, styleSheet.cssRules.length);

styleSheet.insertRule(`
@keyframes pulseGreen {
  0% { box-shadow: 0 0 5px green; }
  50% { box-shadow: 0 0 20px green; }
  100% { box-shadow: 0 0 5px green; }
}`, styleSheet.cssRules.length);
