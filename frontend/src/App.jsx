
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load events");
      }

      // Supports APIs that return either an array or an object containing events.
      const list = Array.isArray(data)
        ? data
        : data.events || data.data || [];

      setEvents(list);
    } catch (err) {
      setError(
        "Could not load events. Check that your backend is running and the events API is correct."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMyRegistrations(currentToken = token) {
    try {
      const response = await fetch(`${API_URL}/registrations/user`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMyRegistrations(data.registrations || []);
      }
    } catch {
      setMessage("Unable to load your registrations.");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      setToken(data.token);
      setLoggedInUser(data.user);
      setShowLogin(false);
      setPassword("");
      setMessage(`Welcome, ${data.user?.name || data.user?.email || "user"}!`);

      await loadMyRegistrations(data.token);
    }  catch (error) {
    console.error("Login error:", error);
    setMessage(`Login error: ${error.message}`);
}

  }

  async function registerForEvent(eventId) {
    if (!token) {
      setShowLogin(true);
      setMessage("Please log in before registering for an event.");
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();
      setMessage(data.message || (response.ok ? "Registration successful!" : "Registration failed"));

      if (response.ok) {
        await loadMyRegistrations();
      }
    } catch {
      setMessage("Cannot connect to the backend.");
    }
  }

  async function cancelRegistration(registrationId) {
    try {
      const response = await fetch(
        `${API_URL}/registrations/${registrationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setMessage(data.message || "Cancellation request completed.");

      if (response.ok) {
        await loadMyRegistrations();
      }
    } catch {
      setMessage("Cannot connect to the backend.");
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">EventHub</a>

        <nav>
          <a href="#events">Events</a>
          {token && <a href="#registrations">My Registrations</a>}

          {loggedInUser ? (
            <button
              className="login-button"
              onClick={() => {
                setToken("");
                setLoggedInUser(null);
                setMyRegistrations([]);
                setMessage("You have logged out.");
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="login-button"
              onClick={() => setShowLogin(!showLogin)}
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <main id="home">
        <section className="hero">
          <span className="eyebrow">YOUR NEXT EXPERIENCE STARTS HERE</span>
          <h1>Discover events.<br />Learn something new.</h1>
          <p>
            Explore workshops, connect with people, and reserve your place
            at events that inspire you.
          </p>
          <a className="primary-button" href="#events">Explore Events →</a>
        </section>

        {showLogin && (
          <section className="login-panel">
            <h2>Login to EventHub</h2>
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />

              <button className="primary-button" type="submit">Login</button>
            </form>
          </section>
        )}

        {message && <div className="notice">{message}</div>}

        <section id="events" className="content-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT'S HAPPENING</span>
              <h2>Upcoming Events</h2>
            </div>
            <button className="secondary-button" onClick={loadEvents}>
              Refresh Events
            </button>
          </div>

          {loading && <p>Loading events...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && events.length === 0 && (
            <p>No events found. Add an event through your backend API.</p>
          )}

          <div className="event-grid">
            {events.map((event) => (
              <article className="event-card" key={event._id || event.id}>
                <div className="event-banner">
                  <span>EVENT</span>
                  <span>✦</span>
                </div>

                <div className="event-body">
                  <p className="event-date">
                    {event.date
                      ? new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date to be announced"}
                  </p>

                  <h3>{event.name || event.title || "Untitled Event"}</h3>
                  <p className="event-description">
                    {event.description || "Join us for this exciting event."}
                  </p>

                  <p className="event-location">
                    📍 {event.location || "Location to be announced"}
                  </p>

                  <p className="event-capacity">
                    Capacity: {event.capacity ?? "Not specified"}
                  </p>

                  <button
                    className="register-button"
                    onClick={() => registerForEvent(event._id || event.id)}
                  >
                    Register for Event →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {token && (
          <section id="registrations" className="content-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR BOOKINGS</span>
                <h2>My Registrations</h2>
              </div>
              <button
                className="secondary-button"
                onClick={() => loadMyRegistrations()}
              >
                Refresh
              </button>
            </div>

            {myRegistrations.length === 0 ? (
              <p>You don't have any registrations yet.</p>
            ) : (
              <div className="registration-list">
                {myRegistrations.map((registration) => (
                  <div
                    className="registration-item"
                    key={registration._id}
                  >
                    <div>
                      <h3>
                        {registration.event?.name || "Event"}
                      </h3>
                      <p>Status: {registration.status}</p>
                      <p>
                        {registration.event?.date
                          ? new Date(registration.event.date).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    {registration.status === "REGISTERED" && (
                      <button
                        className="cancel-button"
                        onClick={() => cancelRegistration(registration._id)}
                      >
                        Cancel Registration
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <strong>EventHub</strong>
        <p>Discover events. Build skills. Make connections.</p>
        <p>Event Registration System · React + Node.js + MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
