import React, { useState, useEffect } from 'react';
import EyeClosedIcon from '../assets/eye-closed.svg';
import EyeOpenIcon from '../assets/eye.svg';
import CopyIcon from "../assets/copy.svg";
import DeleteIcon from "../assets/delete.svg";
import EditIcon from "../assets/edit.svg";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

const Hero = () => {
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [passwordArray, setPasswordArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    website: '',
    username: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);

  const getPassword = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First try to get from localStorage
      const localPasswords = localStorage.getItem("passwords");
      if (localPasswords) {
        setPasswordArray(JSON.parse(localPasswords));
        setIsLoading(false);
        return;
      }

      // If no local data, try the API
      const response = await fetch("https://localhost:3000/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const savedPasswords = await response.json();
      setPasswordArray(savedPasswords);
      
      // Save to localStorage for future use
      localStorage.setItem("passwords", JSON.stringify(savedPasswords));
    } catch (err) {
      setError("Failed to load passwords. Using empty list.");
      console.error("Error fetching passwords:", err);
      setPasswordArray([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPassword();
  }, []);

  const toggleEyeIcon = () => {
    setIsEyeOpen(!isEyeOpen);
  };

  const togglePasswordVisibility = (rowIndex) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.info("Copied to clipboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      toast.error("Failed to copy to clipboard", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Failed to copy:", err);
    }
  };

  const validateData = () => {
    if (!data.website || !data.username || !data.password) {
      toast.error("Please fill all fields", {
        position: "top-right",
      });
      return false;
    }
    return true;
  };

  const savePassword = () => {
    if (!validateData()) return;

    try {
      const newPasswordArray = editingId
        ? passwordArray.map(item => 
            item.id === editingId ? { ...data, id: editingId } : item
          )
        : [...passwordArray, { ...data, id: uuidv4() }];

      setPasswordArray(newPasswordArray);
      localStorage.setItem("passwords", JSON.stringify(newPasswordArray));
      setData({ website: '', username: '', password: '' });
      setEditingId(null);
      
      toast.success(editingId ? "Password updated!" : "Password saved!", {
        position: "top-right",
      });
    } catch (err) {
      toast.error("Failed to save password", {
        position: "top-right",
      });
      console.error("Error saving password:", err);
    }
  };

  const deletePassword = (id) => {
    try {
      const newPasswordArray = passwordArray.filter(item => item.id !== id);
      setPasswordArray(newPasswordArray);
      localStorage.setItem("passwords", JSON.stringify(newPasswordArray));

      toast.info("Credentials deleted", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to delete credentials", {
        position: "top-right",
      });
      console.error("Error deleting password:", err);
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(item => item.id === id);
    if (passwordToEdit) {
      setData(passwordToEdit);
      setEditingId(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    savePassword();
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    toast.error(error);
  }

  return (
    <div className="container mx-auto mt-50 px-4">
      <form className="max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {editingId ? 'Edit Password' : 'Save your Password'}
        </h1>
        <div className="space-y-4">
          <div className="form-group">
            <h2 className="text-sm font-medium text-gray-700 mb-1 transform transition-all duration-200 hover:translate-x-1">Add your website</h2>
            <input 
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 transform hover:-translate-y-0.5" 
              name="website" 
              type="url" 
              placeholder="Enter your website URL" 
              value={data.website} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <h2 className="text-sm font-medium text-gray-700 mb-1 transform transition-all duration-200 hover:translate-x-1">Add your username</h2>
            <input 
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 transform hover:-translate-y-0.5" 
              name="username" 
              type="email" 
              placeholder="Enter your email" 
              value={data.username} 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <h2 className="text-sm font-medium text-gray-700 mb-1 transform transition-all duration-200 hover:translate-x-1">Add your password</h2>
            <div className="relative">
              <input 
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 transform hover:-translate-y-0.5" 
                name="password" 
                type={isEyeOpen ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={data.password} 
                onChange={handleChange}
                required 
              />
              <img 
                src={isEyeOpen ? EyeOpenIcon : EyeClosedIcon} 
                alt="toggle password visibility" 
                className="w-5 h-5 absolute right-2 top-3 cursor-pointer" 
                onClick={toggleEyeIcon} 
              />
            </div>
          </div>
          <button 
            className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-95" 
            type="submit" 
            onClick={handleSubmit}
          >
            {editingId ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>

      <ToastContainer />

      <div className="container mx-auto mt-10 bg-white rounded-xl shadow-lg p-6 max-w-7xl">
        <h2 className="text-center font-bold text-2xl mb-10 w-full relative inline-block mx-auto">
          <span className="after:content-[''] after:block after:w-1/2 after:h-1 after:bg-blue-500 after:mx-auto after:mt-2 after:rounded-full">
            Saved Credentials
          </span>
        </h2>

        <div className="flex justify-between">
          {passwordArray.length === 0 ? (
            <div className="text-center text-gray-500 w-full font-semibold text-xl py-10 animate-pulse">
              No passwords added yet
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg shadow">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Sr. No</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Website</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Password</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passwordArray.map((item, index) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex justify-between items-center">
                          <span>{item.website}</span>
                          <img 
                            className="cursor-pointer opacity-20 hover:opacity-100 transition-opacity ml-2" 
                            src={CopyIcon} 
                            alt="copy website" 
                            onClick={() => copyToClipboard(item.website)} 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex justify-between items-center">
                          <span>{item.username}</span>
                          <img 
                            className="cursor-pointer opacity-20 hover:opacity-100 transition-opacity ml-2" 
                            src={CopyIcon} 
                            alt="copy username" 
                            onClick={() => copyToClipboard(item.username)} 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono bg-gray-50 rounded-md mx-2">
                        <div className="flex justify-between items-center">
                          <span>{visiblePasswords[index] ? item.password : "••••••••"}</span>
                          <div className="flex items-center">
                            <img 
                              className="cursor-pointer opacity-20 hover:opacity-100 transition-opacity mr-2" 
                              src={CopyIcon} 
                              alt="copy password" 
                              onClick={() => copyToClipboard(item.password)} 
                            />
                            <img 
                              className="w-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" 
                              src={visiblePasswords[index] ? EyeOpenIcon : EyeClosedIcon} 
                              alt="toggle password visibility" 
                              onClick={() => togglePasswordVisibility(index)} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono bg-gray-50 rounded-md mx-2">
                        <div className="flex justify-between w-[80%]">
                          <img 
                            className="cursor-pointer hover:scale-110 drop-shadow-md transition-all ease-in-out duration-300 opacity-80 hover:opacity-100" 
                            src={EditIcon} 
                            alt="Edit" 
                            onClick={() => editPassword(item.id)} 
                          />
                          <img 
                            className="cursor-pointer hover:scale-110 drop-shadow-md transition-all ease-in-out duration-300 opacity-80 hover:opacity-100" 
                            src={DeleteIcon} 
                            alt="delete" 
                            onClick={() => deletePassword(item.id)} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;