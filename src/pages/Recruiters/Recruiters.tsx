import { useEffect, useMemo, useState } from "react";
import { fetchAllContacts } from "../../api/contactApi";

type Recruiter = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  createdAt: string;
};

export default function Recruiters() {
  const [data, setData] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    fetchAllContacts()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    return data
      .filter((r) =>
        [r.name, r.email, r.phoneNumber]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortDesc
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [data, search, sortDesc]);

  if (loading) {
    return <p className="text-center mt-10">Loading recruiters…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">
          Recruiters Who Want to Connect
        </h2>

        <input
          type="text"
          placeholder="Search name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm w-full md:w-72"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Message</th>
              <th
                className="p-3 text-left cursor-pointer select-none"
                onClick={() => setSortDesc((s) => !s)}
              >
                Date {sortDesc ? "↓" : "↑"}
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No recruiters found
                </td>
              </tr>
            ) : (
              filteredData.map((r) => (
                <tr
                  key={r._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.phoneNumber}</td>
                  <td className="p-3 max-w-sm truncate" title={r.description}>
                    {r.description || "-"}
                  </td>
                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}