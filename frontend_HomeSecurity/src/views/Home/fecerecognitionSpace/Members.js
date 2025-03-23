import React, { useState, useEffect } from 'react';
import { useSettings } from 'context/SettingsContext'; // Adjust the path as needed
import MemberDropdown from 'components/Dropdowns/MemberDropdown';
import { Link } from 'react-router-dom';

const Members = () => {
  const { settings } = useSettings(); // Assuming settings contain raspberryURL
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Use the raspberryURL from context
  const raspberryURL = settings.raspberryPiURL; // Adjust according to your context

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${raspberryURL}/members`);
        const { membersData } = await response.json();

        if (Array.isArray(membersData)) {
          setMembers(membersData);
        } else {
          console.error('Unexpected data format:', membersData);
          setMembers([]);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      }
    };

    fetchMembers();
  }, [raspberryURL]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const toggleStatus = (id) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id
          ? { ...member, status: getNextStatus(member.status) }
          : member
      )
    );
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Active':
        return 'Suspended';
      case 'Suspended':
        return 'Inactive';
      case 'Inactive':
        return 'Active';
      default:
        return 'Active';
    }
  };

  const paginatedMembers = members.slice(startIndex, endIndex);

  return (
    <div className="w-full mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
      <header className="flex items-center justify-between pb-6">
        <h2 className="font-semibold text-moon-dark">View Members</h2>
        <Link to="/home/face_recognition/registerNewMember">
          <button className="ml-10 rounded-md bg-moon-light-blue px-4 py-2 text-sm font-semibold text-white focus:outline-none hover:bg-blue-700">
            ADD Member
          </button>
        </Link>
      </header>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-moon-light-blue text-left text-xs font-semibold uppercase tracking-widest text-white">
              <tr>
                <th className="px-5 py-3">Member ID</th>
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Date Added</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Operation</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-nowrap">{member.id}</p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`${raspberryURL}/${member.Dataset[0]}`}
                          alt={member.name}
                        />
                        <p className="ml-3 whitespace-nowrap">{member.name}</p>
                      </div>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-nowrap">{member.role}</p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <p className="whitespace-nowrap">{member.dateAdded}</p>
                    </td>
                    <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                      <button
                        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ${
                          member.status === 'Active'
                            ? 'bg-green-200 text-green-900'
                            : member.status === 'Suspended'
                            ? 'bg-yellow-200 text-yellow-900'
                            : 'bg-red-200 text-red-900'
                        }`}
                        onClick={() => toggleStatus(member.id)}
                      >
                        {member.status}
                      </button>
                    </td>
                    <td className="border-b text-center border-gray-200 bg-white px-5 py-5 text-sm">
                      <MemberDropdown memberId={member.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-5">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center border-t bg-moon-light px-5 py-5 sm:flex-row sm:justify-between">
          <span className="text-xs text-moon-dark sm:text-sm">
            Showing {startIndex + 1} to {Math.min(endIndex, members.length)} of {members.length} Members
          </span>
          <div className="mt-2 inline-flex sm:mt-0">
            <button
              onClick={handlePrevPage}
              className="mr-2 h-12 w-12 rounded-full border text-sm font-semibold text-moon-dark transition duration-150 hover:bg-gray-100"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={handleNextPage}
              className="h-12 w-12 rounded-full border text-sm font-semibold text-moon-dark transition duration-150 hover:bg-gray-100"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
