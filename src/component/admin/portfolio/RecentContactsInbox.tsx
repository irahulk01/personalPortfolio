"use client";

import { useState, useMemo } from 'react';
import { FiFilter, FiTrash2, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

interface RecentContactsInboxProps {
  contacts: any[];
  onDeleteContact: (id: string) => void;
  onToggleStatus: (id: string, currentStatus?: string) => void;
}

export default function RecentContactsInbox({
  contacts,
  onDeleteContact,
  onToggleStatus,
}: RecentContactsInboxProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const itemsPerPage = 4;

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      c.email?.toLowerCase().includes(filterText.toLowerCase()) ||
      c.phoneNumber?.includes(filterText)
    );
  }, [contacts, filterText]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, currentPage]);

  return (
    <div className="bg-[#21222d] rounded-3xl p-6 flex flex-col shadow-xl border border-[#2b2b36] justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="font-semibold text-lg text-white">Recent Contacts Inbox</span>
            <p className="text-xs text-[#87888c] mt-0.5">{contacts.length} Total Inquiries Received</p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#171821] px-3 py-1.5 rounded-xl border border-[#2b2b36]">
            <FiFilter className="text-[#87888c] text-xs" />
            <input
              type="text"
              placeholder="Filter contacts..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-white text-xs outline-none w-32 placeholder-[#87888c]"
            />
          </div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2b2b36] text-[#87888c] text-xs font-medium uppercase tracking-wider">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Phone</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b2b36]/30">
              {paginatedContacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-[#2b2b36]/30 transition-colors text-sm">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#a8a5ff] text-[#171821] flex items-center justify-center font-bold text-xs">
                        {contact.name ? contact.name.substring(0, 2).toUpperCase() : '??'}
                      </div>
                      <span className="text-white font-medium">{contact.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-[#87888c] text-xs">
                    {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-2 text-white text-xs">
                    <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
                  </td>
                  <td className="py-3 px-2 text-[#87888c] text-xs">{contact.phoneNumber}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => onToggleStatus(contact._id, contact.status)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                        contact.status === 'Contacted' 
                          ? 'bg-[#a8a5ff]/15 text-[#a8a5ff] hover:bg-[#a8a5ff]/25' 
                          : 'bg-[#ff9f43]/15 text-[#ff9f43] hover:bg-[#ff9f43]/25'
                      }`}
                      title="Click to toggle status"
                    >
                      {contact.status === 'Contacted' && <FiCheckCircle className="text-xs" />}
                      {contact.status || 'New'}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => onDeleteContact(contact._id)}
                      className="p-2 rounded-lg text-[#87888c] hover:text-[#ff9f43] hover:bg-white/5 transition-all"
                      title="Delete contact"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedContacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#87888c] text-xs">No contacts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2b2b36]/40 mt-4 text-xs text-[#87888c]">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#171821] hover:bg-[#2b2b36] disabled:opacity-40 disabled:hover:bg-[#171821] transition-all"
          >
            <FiChevronLeft className="text-base" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-[#171821] hover:bg-[#2b2b36] disabled:opacity-40 disabled:hover:bg-[#171821] transition-all"
          >
            <FiChevronRight className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
