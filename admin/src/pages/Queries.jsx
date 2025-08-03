import React from "react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

const Queries = () => {
  const { queries, atoken, fetchQueries, backendUrl } =
    useContext(AdminContext);

  const [responses, setResponses] = useState({});

  useEffect(() => {
    fetchQueries();
  }, [atoken]);

  const handleSendResponse = async (query) => {
    const responseText = responses[query._id];

    if (!responseText || responseText.trim() === "") {
      toast.error("Response cannot be empty");
      return;
    }

    try {
      const id = query._id;
      const response = await axios.post(
        `${backendUrl}/api/admin/queries/response/${id}`,
        { response: responseText },
        {
          headers: { atoken },
        }
      );

      if (response.data.success) {
        toast.success("Response sent successfully");
        fetchQueries();
        setResponses((prev) => ({ ...prev, [id]: "" })); // Clear response for that query
      } else {
        toast.error(response.data.message || "Failed to send response");
      }
    } catch (error) {
      console.error("Error sending response: ", error);
      toast.error(error.message || "Failed to send response");
    }
  };

  return (
    <div>
      {queries.length > 0 ? (
        <div className="p-6">
          {queries.map((query) => (
            <div
              key={query._id}
              className={`border   border-gray-200 rounded-lg p-4 mb-4 shadow-sm ${
                query.isResponded ? "bg-green-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <p>
                  <span className="font-medium">Name:</span> {query.name}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {query.phone}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(query.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-gray-800 mb-3">
                <span className="font-medium">Message:</span> {query.message}
              </div>

              {!query.isResponded && (
                <div>
                  <span className="font-medium">Response:</span>
                  <textarea
                    value={responses[query._id] || ""}
                    onChange={(e) =>
                      setResponses({
                        ...responses,
                        [query._id]: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    placeholder="Type your response here..."
                  ></textarea>
                </div>
              )}

              {query.isResponded && (
                <div>
                  <span className="font-medium">Previous Response:</span>{" "}
                  <b>{query.response}</b>
                </div>
              )}

              {query.isResponded ? (
                <p className="text-green-600 mt-2">Response sent</p>
              ) : (
                <button
                  onClick={() => handleSendResponse(query)}
                  className="px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
                  disabled={
                    !responses[query._id] || responses[query._id].trim() === ""
                  }
                >
                  Send Response
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="p-6 text-gray-500">No queries found.</p>
      )}
    </div>
  );
};

export default Queries;
