import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useDashboardLogic = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [companyNameQuery, setCompanyNameQuery] = useState('');
  const [companyToDelete, setCompanyToDelete] = useState('');
  const [ownerToDelete, setOwnerToDelete] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [companyByNameResult, setCompanyByNameResult] = useState(null);
  const [editingCompany, setEditingCompany] = useState('')
  const [editName, setEditedName] = useState('')
  const [editDescription, setEditedDescription] = useState('')

  const [companies, setCompanies] = useState([]);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddCompanyOwner, setShowAddCompanyOwner] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const showSnackbar = (message, severity) => {
  setSnackbarMessage(message);
  setSnackbarSeverity(severity);
  setSnackbarOpen(true);
};

// Handler to close snackbar
const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data.data);

    } catch (err) {
      alert('Error fetching companies');
    }
  };

  const handleAddCompanyOwner = async () => {
    try {
      await axios.post(
        'http://localhost:4000/api/admin/company-owners',
        {
          username,
          email,
          password,
          companyId: selectedCompanyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCompanies();
      alert('Company owner added');
    } catch (err) {
      alert('Error adding company owner');
    }
  };

const updateCompanyOrOwner = async (data) => {
  if (!data.companyId) {
    showSnackbar('Company ID is required', 'error');
    return { success: false, message: 'Company ID is required' };
  }

  if (data.password) {
    if (
      data.password.length < 8 ||
      !/[A-Z]/.test(data.password) ||
      !/[0-9]/.test(data.password)
    ) {
      showSnackbar(
        'Password must be at least 8 characters and include a capital letter and number',
        'error'
      );
      return { success: false, message: 'Password does not meet criteria' };
    }
  }

  try {
    const response = await axios.put(
      'http://localhost:4000/api/admin/company/update',
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      showSnackbar('Company and owner updated successfully', 'success');
      await fetchCompanies(); // Refresh list

      // Clear editing form state
      setEditingCompany('');
      setEditedName('');
      setEditedDescription('');
      setEmail('');
      setUsername('');
      setPassword('');

      return { success: true };
    } else {
      showSnackbar(response.data.message || 'Update failed', 'error');
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error or server unreachable';
    showSnackbar(message, 'error');
    return { success: false, message };
  }
};


const fetchCompanyByName = async () => {
  if (!token) {
    showSnackbar('No user found!', 'warning');
    return;
  }

  if (!companyNameQuery) {
    showSnackbar('Please enter a company name', 'info');
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:4000/api/admin/company-name/${companyNameQuery}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = response?.data?.data;

    if (response.data.success && data) {
      const normalizedResult = {
        ...data,
        owner: data.owner?.username || '',
        email: data.owner?.email || '',
      };
      setCompanyByNameResult(normalizedResult);
    } else {
      showSnackbar('There is no company with this name', 'error');
      setCompanyByNameResult(null);
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      showSnackbar('There is no company with this name', 'error');
    } else {
      showSnackbar('Error occurred while fetching company.', 'error');
    }
    setCompanyByNameResult(null);
  }
};
 

  const deleteCompanyByName = async (companyName) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/name/${encodeURIComponent(companyName)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Company deleted successfully");
      fetchCompanies();
    } catch (err) {
      alert("Failed to delete company");
      console.error(err);
    }
  };

  const deleteOwnerByUsername = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/user/company-owners/${ownerToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Company owner deleted');
    } catch (err) {
      alert('Error deleting company owner');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    companyNameQuery,
    setCompanyNameQuery,
    selectedCompanyId,
    setSelectedCompanyId,
    companyByNameResult,
    companies,
    showAddCompany,
    setShowAddCompany,
    showAddCompanyOwner,
    setShowAddCompanyOwner,
    fetchCompanies,
    fetchCompanyByName,
    handleAddCompanyOwner,
    deleteCompanyByName,
    companyToDelete,
    setCompanyToDelete,
    deleteOwnerByUsername,
    ownerToDelete,
    setOwnerToDelete,
    handleLogout,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    showSnackbar,
    setEditingCompany,
    setEditedName,
    setEditedDescription,
    updateCompanyOrOwner
  };
};
