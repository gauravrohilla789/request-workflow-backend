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
    <div>
      {userRole === "USER" && (
        <>
          <h3>Create New Request</h3>
          <form onSubmit={createRequest}>
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit">Create Request</button>
          </form>
        </>
      )}

      <h2>Requests</h2>
      {requests.map((req) => (
        <div key={req._id} style={{ border: "1px solid gray", margin: 8 }}>
          <p>
            <b>{req.title}</b>
          </p>
          <p>Status: {req.status}</p>
          {/* USER can submit draft */}
          {userRole === "USER" && req.status === "DRAFT" && (
            <button onClick={() => updateStatus(req._id, "SUBMITTED")}>
              Submit
            </button>
          )}

          {/* ADMIN can move submitted to in progress */}
          {userRole === "ADMIN" && req.status === "SUBMITTED" && (
            <button onClick={() => updateStatus(req._id, "IN_PROGRESS")}>
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
              >
                Reject
              </button>
            </>
          )}
        </div>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
