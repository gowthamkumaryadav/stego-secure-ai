import { useState } from "react";

export default function Contact() {
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Contact Us
        </h1>

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Your Email"
        />

        <textarea
          className="w-full p-2 mb-3 border rounded"
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Send Message
        </button>

      </div>
    </div>
  );
}