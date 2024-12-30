import React, { useState } from "react";
import logout from "../utils/logout";
import {
  LockClosedIcon,
  CloudArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  UserCircleIcon
} from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, name: "Passport.pdf", tags: ["important"], encrypted: true },
    { id: 2, name: "Resume.docx", tags: ["career"], encrypted: true },
    { id: 3, name: "Invoice.png", tags: ["finance"], encrypted: true },
  ]);

  const toggleAccountDropdown = () => setIsAccountDropdownOpen(!isAccountDropdownOpen);

  const handleLogout = () => {
    logout();
    setUserName("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:5000/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      if (response.ok) {
        const newDocument = await response.json();
        setDocuments([...documents, newDocument]);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <nav className="bg-blue-600 text-white dark:bg-gray-800 p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mx-auto">Personal Document Vault</h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center">
            <UserCircleIcon className="w-8 h-8 text-gray-300" />
            <span className="ml-2">{userName}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <button
            onClick={toggleAccountDropdown}
            className="flex justify-between items-center w-full text-left font-semibold text-lg"
          >
            <span>Account</span>
            {isAccountDropdownOpen ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </button>

          {isAccountDropdownOpen && (
            <div className="mt-4 space-y-3">
              <a
                href="/profile-settings"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Profile Settings
              </a>
              <a
                href="/security"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Security
              </a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Uploaded Documents
            </h2>
            <p className="text-3xl font-bold text-blue-500">{documents.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Storage Used
            </h2>
            <p className="text-3xl font-bold text-green-500">120 MB</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Encryption Status
            </h2>
            <p className="text-3xl font-bold text-red-500 flex items-center">
              <LockClosedIcon className="w-6 h-6 inline-block mr-2" />
              Secure
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            Upload a New Document
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileSelect}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={() => handleUpload(selectedFile)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center"
            >
              <CloudArrowUpIcon className="w-6 h-6 inline-block mr-2" /> Upload
            </button>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-4 py-2 w-full shadow">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full outline-none bg-transparent text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Security Preferences</h3>
              <div className="text-gray-600 dark:text-gray-400">Two-Factor Authentication</div>
              <div className="text-gray-600 dark:text-gray-400">Auto-lock Timer</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Storage Settings</h3>
              <div className="text-gray-600 dark:text-gray-400">Auto-backup Options</div>
              <div className="text-gray-600 dark:text-gray-400">Cleanup Old Files</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            Your Documents
          </h2>
          {documents.length > 0 ? (
            <ul>
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-none"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tags: {doc.tags.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-500 flex items-center">
                      <LockClosedIcon className="w-5 h-5 mr-1" />
                      Encrypted
                    </span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No documents uploaded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
