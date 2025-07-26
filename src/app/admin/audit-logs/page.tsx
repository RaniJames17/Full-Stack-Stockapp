"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuditLog {
  _id: string;
  actorId: string;
  action: string;
  targetUserId?: string;
  details: {
    previousRole?: string;
    newRole?: string;
    userEmail?: string;
    deletedUserEmail?: string;
    deletedUserRole?: string;
    timestamp: string;
    [key: string]: unknown;
  };
  timestamp: string;
  actor: {
    email: string;
    name?: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export default function AuditLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    action: "",
    startDate: "",
    endDate: "",
    page: 1
  });

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "admin") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  // Fetch audit logs
  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const searchParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: "20"
      });

      if (filters.action) searchParams.append("action", filters.action);
      if (filters.startDate) searchParams.append("startDate", filters.startDate);
      if (filters.endDate) searchParams.append("endDate", filters.endDate);

      const response = await fetch(`/api/admin/audit-logs?${searchParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch audit logs");
      }

      setLogs(data.data.logs);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchAuditLogs();
    }
  }, [session, fetchAuditLogs]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : Number(value) // Reset to page 1 when changing filters
    }));
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      startDate: "",
      endDate: "",
      page: 1
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "UPDATE_ROLE":
        return "bg-blue-100 text-blue-800";
      case "DELETE_USER":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDetails = (action: string, details: AuditLog['details']) => {
    switch (action) {
      case "UPDATE_ROLE":
        return `${details.previousRole} → ${details.newRole} (${details.userEmail})`;
      case "DELETE_USER":
        return `Deleted ${details.deletedUserEmail} (${details.deletedUserRole})`;
      default:
        return JSON.stringify(details);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <div className="text-sm text-gray-500">
            {pagination && `${pagination.totalCount} total entries`}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Action
              </label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="">All Actions</option>
                <option value="UPDATE_ROLE">Role Updates</option>
                <option value="DELETE_USER">User Deletions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading audit logs...</div>
          </div>
        ) : (
          <>
            {/* Audit Logs Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No audit logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.actor.name || log.actor.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {formatDetails(log.action, log.details)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange("page", pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFilterChange("page", pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
