import { useMemo, useState } from "react";
import {
  Download,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import type { StudentAccount } from "../../context/AuthContext";

interface StudentManagementPanelProps {
  students: StudentAccount[];
  onSetSuspended: (email: string, suspended: boolean) => void;
  onDelete: (email: string) => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function escapeCsvCell(value: string): string {
  const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

/**
 * StudentManagementPanel renders the directory of registered student accounts,
 * providing filtering, searching, CSV export, and account suspension/deletion controls.
 */
export default function StudentManagementPanel({
  students,
  onSetSuspended,
  onDelete,
}: StudentManagementPanelProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StudentAccount["status"]>("all");
  const [exportError, setExportError] = useState("");

  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase();
    return [...students]
      .filter((student) => statusFilter === "all" || student.status === statusFilter)
      .filter(
        (student) =>
          !search ||
          student.name.toLowerCase().includes(search) ||
          student.email.toLowerCase().includes(search)
      )
      .sort((left, right) => right.lastLoginAt.localeCompare(left.lastLoginAt));
  }, [query, statusFilter, students]);

  const activeCount = students.filter((student) => student.status === "active").length;
  const suspendedCount = students.length - activeCount;

  const exportStudents = () => {
    try {
      const rows = [
        ["Name", "Email", "Status", "Joined", "Last login"],
        ...filteredStudents.map((student) => [
          student.name,
          student.email,
          student.status,
          student.joinedAt,
          student.lastLoginAt,
        ]),
      ];
      const csv = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setExportError("");
    } catch {
      setExportError("Could not export the student list.");
    }
  };

  const confirmDelete = (student: StudentAccount) => {
    const confirmed = window.confirm(
      `Delete ${student.name} (${student.email})? They will no longer be able to sign in on this browser.`
    );
    if (confirmed) onDelete(student.email);
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Registered students", value: students.length, icon: Users },
          { label: "Active accounts", value: activeCount, icon: UserRound },
          { label: "Suspended accounts", value: suspendedCount, icon: ShieldOff },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3.5 rounded-xl border border-[#292929] bg-[#161616] p-4 sm:p-5 transition-colors duration-200 hover:border-[#383838]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#2c2118] text-[#ff994f]">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="m-0 text-xs font-medium text-[#888]">{label}</p>
              <p className="m-0 mt-1 font-['Space_Grotesk'] text-xl font-semibold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Directory Section */}
      <section className="overflow-hidden rounded-xl border border-[#292929] bg-[#161616]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#292929] px-5 py-4">
          <div>
            <h2 className="m-0 text-sm font-semibold text-white">Student directory</h2>
            <p className="mb-0 mt-0.5 text-xs text-[#888]">
              Review accounts, recent sign-ins, and chat access.
            </p>
          </div>
          <button
            type="button"
            onClick={exportStudents}
            disabled={filteredStudents.length === 0}
            className="flex h-9 items-center gap-2 rounded-lg border border-[#343434] px-3 text-xs font-medium text-[#bbb] transition-colors duration-200 hover:border-[#ff7a1a] hover:bg-[#1a1a1a] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[#343434] bg-[#111] px-3 text-[#777] transition-colors duration-200 focus-within:border-[#ff7a1a]">
            <Search size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or email..."
              aria-label="Search students by name or email"
              className="h-10 w-full bg-transparent text-xs text-white outline-none placeholder:text-[#666]"
            />
          </label>
          <label className="sr-only" htmlFor="student-status-filter">Filter students by status</label>
          <select
            id="student-status-filter"
            value={statusFilter}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setStatusFilter(value === "active" || value === "suspended" ? value : "all");
            }}
            className="h-10 rounded-lg border border-[#343434] bg-[#111] px-3 text-xs text-[#ddd] outline-none transition-colors duration-200 focus:border-[#ff7a1a]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {exportError && (
          <p role="alert" className="mx-5 mb-3 text-xs font-medium text-[#ff9c8b]">
            {exportError}
          </p>
        )}

        {/* Table / Empty State */}
        {filteredStudents.length === 0 ? (
          <p className="px-5 py-12 text-center text-xs text-[#888]">
            {students.length === 0
              ? "No student accounts have logged in on this browser yet."
              : "No students match these filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 border-collapse text-left">
              <thead className="bg-[#121212] text-[10px] uppercase tracking-wider text-[#777]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Student</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Joined</th>
                  <th scope="col" className="px-4 py-3 font-medium">Last login</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929]">
                {filteredStudents.map((student) => (
                  <tr key={student.email} className="transition-colors duration-200 hover:bg-[#1b1b1b]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#28333a] text-xs font-semibold text-[#b6e5f3]">
                          {student.name
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase())
                            .join("")}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-white">
                            {student.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-[#888]">
                            {student.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          student.status === "active"
                            ? "bg-[#183324] text-[#8de0ad]"
                            : "bg-[#35211a] text-[#ffad8b]"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {student.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#aaa]">
                      {formatDate(student.joinedAt)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#aaa]">
                      {formatDate(student.lastLoginAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            onSetSuspended(student.email, student.status === "active")
                          }
                          aria-label={`${student.status === "active" ? "Suspend" : "Restore"} ${student.name}`}
                          title={student.status === "active" ? "Suspend account" : "Restore account"}
                          className="grid h-8 w-8 place-items-center rounded-lg text-[#aaa] transition-colors duration-200 hover:bg-[#302219] hover:text-[#ff994f]"
                        >
                          {student.status === "active" ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(student)}
                          aria-label={`Delete ${student.name}`}
                          title="Delete account"
                          className="grid h-8 w-8 place-items-center rounded-lg text-[#888] transition-colors duration-200 hover:bg-[#35211a] hover:text-[#ff9c8b]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Note */}
        <div className="border-t border-[#292929] px-5 py-3 text-xs text-[#777]">
          {filteredStudents.length} of {students.length} student accounts · Suspension and deletion
          apply to this browser’s demo data only.
        </div>
      </section>
    </div>
  );
}