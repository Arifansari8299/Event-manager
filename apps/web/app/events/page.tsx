"use client";
import { useEffect, useState } from "react";

type Event = {
  id: number;
  name: string;
  date: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  //Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  //Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    const newEvent: Event = {
      id: Date.now(),
      name,
      date,
    };

    setEvents([...events, newEvent]);
    setName("");
    setDate("");
  };

  const handleDelete = (id: number) => {
    const updated = events.filter((ev) => ev.id !== id);
        setEvents(updated);
  };

  //Filter events based on search text
  const filteredEvents = events.filter((ev) =>
    ev.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Event Manager</h1>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Event
        </button>
      </form>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg mt-6"
      />

      {/* Event List */}
      <ul className="mt-6 space-y-3">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-500">No matching events.</p>
        ) : (
          filteredEvents.map((ev) => (
            <li
              key={ev.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <span>
                {ev.name} – {ev.date}
              </span>
              <button
                onClick={() => handleDelete(ev.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
