import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api";

type RequestItem = {
  _id: string;
  title: string;
  description?: string;
  status: string;
};

export default function Requests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const approvableStatuses = ["IN_PROGRESS", "SUBMITTED"];
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchUser();
  }, []);

  const fetchRequests = async () => {
    const res = await api.get("/requests");
    setRequests(Array.isArray(res.data) ? res.data : []);
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      console.log("User data", res.data);
      setUserRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch user");
    }
  };

  const updateStatus = async (
    id: string,
    nextStatus: string,
    comment?: string,
  ) => {
    try {
      await api.patch(`/requests/${id}/status`, {
        status: nextStatus,
        comment,
      });

      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const createRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post("/requests", {
        title,
        description,
      });
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Failed to create request");
      return;
    }

    fetchRequests();
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {userRole === "USER" && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Create New Request
              </h3>

              <form onSubmit={createRequest} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
  hover:bg-indigo-700 transition"
                >
                  Create Request
                </button>
              </form>
            </div>
          </>
        )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Requests</h2>

        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-800">{req.title}</h4>

              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {req.status}
              </span>
            </div>

            {/* USER can submit draft */}
            {userRole === "USER" && req.status === "DRAFT" && (
              <button
                onClick={() => updateStatus(req._id, "SUBMITTED")}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg 
  hover:bg-indigo-700 transition text-sm"
              >
                Submit
              </button>
            )}

            {/* ADMIN can move submitted to in progress */}
            {userRole === "ADMIN" && req.status === "SUBMITTED" && (
              <button
                onClick={() => updateStatus(req._id, "IN_PROGRESS")}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg 
  hover:bg-indigo-700 transition text-sm"
              >
                Move to In Progress
              </button>
            )}

            {/* ADMIN can approve or reject in progress */}
            {userRole === "ADMIN" && req.status === "IN_PROGRESS" && (
              <>
                <button
                  onClick={() =>
                    updateStatus(req._id, "APPROVED", "Approved via UI")
                  }
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg 
  hover:bg-indigo-700 transition text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    const reason = prompt("Enter rejection reason:");
                    if (reason) {
                      updateStatus(req._id, "REJECTED", reason);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg 
hover:bg-red-700 transition text-sm ml-2"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        ))}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg 
    hover:bg-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
