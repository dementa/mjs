'use client';

import { useState, useEffect } from 'react';
import {
  UserPlus,
  FileText,
  ClipboardList,
  CheckCircle,
  Clock,
  UserCheck,
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  BookAlert,
  Info
} from 'lucide-react';
import SectionHeader from '@/components/ui/sectionHeader';
import InterviewTable from '@/components/tables/InterviewTable';
import AdmissionTable from '@/components/tables/readyForAdmissions';
import useModalStore from '@/store/modalStore';
import InterviewForm from './Data Models/newInterview';


const AdmissionSystem = () => {

  const [intervieweeList, setIntervieweeList] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [pendingInterviewList, setPendingInterviewList] = useState([])
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAdmissionStatus, setFilterAdmissionStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('interview'); // interview, ready, registered
  const [newCandidate, setNewCandidate] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    previousSchool: '',
    interviewDate: new Date().toISOString().split('T')[0],
    level: '',
    subject: '',
    interviewScore: 0,
    status: 'pending',
    subjects: [],
    issuedBy: 'Head Teacher',
    background: '',
    interviewNotes: '',
    headTeacherNotes: '',
    classAssignment: ''
  });
  const { openModal } = useModalStore();

  //Interaction with backend (fetch interviews)
  useEffect(() => {
    fetch("https://mjs-backend-server.onrender.com/interviews")
      .then(res => res.json())
      .then(data => {
        //filter interview where status is pending.
        
        

        setIntervieweeList(data);
        console.log("Backend Response:", data);
      })
      .catch(err => console.error("Error fetching interviews:", err));
  }, []);

  useEffect(() => {
    console.log("Interviewee List Updated:", intervieweeList);
    const readyForAdmissions = intervieweeList.filter(c => c.status === 'completed');
    const pendingInterviews = intervieweeList.filter(p => p.status === "pending");

    setPendingInterviewList(pendingInterviews);
    setCandidates(readyForAdmissions);
    console.log("Ready for Admissions:", readyForAdmissions);
    console.log(`Pending Interviews:  ${pendingInterviewList}`);
  }, [intervieweeList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate({
      ...newCandidate,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCandidate) {
      setCandidates(candidates.map(c => c.id === editingCandidate.id ? { ...newCandidate, id: editingCandidate.id } : c));
    } else {
      const id = candidates.length ? Math.max(...candidates.map(c => c.id)) + 1 : 1;
      setCandidates([...candidates, { ...newCandidate, id }]);
    }
    setShowCandidateForm(false);
    setEditingCandidate(null);
    resetForm();
  };

  const resetForm = () => {
    setNewCandidate({
      firstName: '',
      lastName: '',
      otherNames: '',
      previousSchool: '',
      interviewDate: new Date().toISOString().split('T')[0],
      level: '',
      subject: '',
      interviewScore: 0,
      status: 'pending',
      subjects: [],
      issuedBy: 'Head Teacher',
      background: '',
      interviewNotes: '',
      headTeacherNotes: '',
      classAssignment: ''
    });
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setNewCandidate({ ...candidate });
    setShowCandidateForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      setCandidates(candidates.filter(candidate => candidate.id !== id));

      try {
        await fetch(`http//192.168.100.169:5000/interviews`, {
          method: 'DELETE'
        });
        alert("Candidate deleted successfully.");
        console.log(`Candidate with ID ${id} deleted successfully.`);
        window.location.reload();
      } catch (error) {
        alert("Error deleting candidate:");
        console.error("Error deleting candidate:", error);
      }
    }
  };

  const handleNewInterview = () => {
    openModal(<InterviewForm />);
  };

  const updateCandidate = (id, updates) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === id ? { ...candidate, ...updates } : candidate
    ));
  };

  const updateCandidateStatus = (id, status) => {
    updateCandidate(id, { status });
  };

  const moveToAdmissionQueue = (id) => {
    updateCandidate(id, { admissionStatus: 'ready' });
  };

  const completeAdmission = (id) => {
    updateCandidate(id, { admissionStatus: 'completed' });
  };

  const addCandidate = (newCand) => {
    const id = candidates.length ? Math.max(...candidates.map(c => c.id)) + 1 : 1;
    setCandidates([...candidates, { ...newCand, id, admissionStatus: 'pending', interviewScore: newCand.interviewScore || 0 }]);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
      case 'completed': return { text: 'Completed', color: 'bg-green-100 text-green-800' };
      case 'try':
      case 'ongoing': return { text: 'Ongoing', color: 'bg-yellow-100 text-yellow-800' };
      case 'repeat':
      case 'cancelled': return { text: 'Cancelled', color: 'bg-red-100 text-red-800' };
      default: return { text: 'Pending', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getAdmissionStatusLabel = (status) => {
    switch (status) {
      case 'ready': return { text: 'Ready for Admission', color: 'bg-gray-100 text-gray-800' };
      case 'completed': return { text: 'Fully Registered', color: 'bg-purple-100 text-purple-800' };
      default: return { text: 'Pending Interview', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Filter candidates based on active tab and filters
  const filteredCandidates = candidates.filter(candidate => {
    // Tab filtering
    if (activeTab === 'interview' && candidate.admissionStatus !== 'pending') return false;
    if (activeTab === 'ready' && candidate.admissionStatus !== 'ready') return false;
    if (activeTab === 'registered' && candidate.admissionStatus !== 'completed') return false;

    // Status filtering
    if (filterStatus !== 'all' && candidate.status !== filterStatus) return false;

    // Search filtering
    const fullName = `${candidate.firstName || ''} ${candidate.otherNames || ''} ${candidate.lastName || ''}`.trim();
    if (searchQuery && !fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !candidate.previousSchool.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });


  console.log(candidates);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:items-center md:flex-row justify-between mb-6">
          <div className='px-4 pt-4'>
            <SectionHeader title="Admission Management" subtitle="Manage student admissions efficiently" />
          </div>
          <div className='flex gap-2 justify-end mr-4'>
            <button
              onClick={() => handleNewInterview()}
              className="align-right flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              <BookAlert size={16} className="mr-2" />
              <p className='text-xs md:text-md'>Issue Interview</p>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="align-right flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              <UserPlus size={16} className="mr-2" />
              <p className='text-xs md:text-md'>New Candidate</p>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-2 text-xs">
          <div className="flex border-b">
            <Tab id="interview" title={"Interviews"} setActiveTab={setActiveTab} activeTab={activeTab} Icon={ClipboardList} candidates={intervieweeList} />
            <Tab id="ready" title={"Ready for Admission"} setActiveTab={setActiveTab} activeTab={activeTab} Icon={CheckCircle} candidates={candidates} />
            <Tab id="registered" title={"Fully Registered"} setActiveTab={setActiveTab} activeTab={activeTab} Icon={UserCheck} candidates={candidates} />
          </div>
        </div>


        {/* Interview List */}
        {activeTab === 'interview' && <InterviewTable Data={pendingInterviewList} />}
        {activeTab === 'ready' && <AdmissionTable Data={candidates} />}

      </div>
    </div>
  );
};

const CandidateRow = ({
  candidate,
  onEdit,
  onDelete,
  onStatusChange,
  onMoveToQueue,
  onCompleteAdmission,
  onUpdate,
  getStatusLabel,
  getAdmissionStatusLabel,
  activeTab
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [localScore, setLocalScore] = useState(candidate.interviewScore || 0);
  const statusInfo = getStatusLabel(candidate.status);
  const admissionStatusInfo = getAdmissionStatusLabel(candidate.admissionStatus);
  const fullName = `${candidate.firstName || ''} ${candidate.otherNames || ''} ${candidate.lastName || ''}`.trim();

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="font-medium text-gray-800">{fullName.charAt(0)}</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{fullName}</div>
              <div className="text-sm text-gray-500">{candidate.interviewDate}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {candidate.previousSchool}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {candidate.interviewScore ? (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.interviewScore >= 50 ? 'bg-green-100 text-green-800' :
              candidate.interviewScore >= 30 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
              {candidate.interviewScore}%
            </span>
          ) : (
            <span>Not Recorded Yet</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admissionStatusInfo.color}`}>
            {admissionStatusInfo.text}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(candidate); }}
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(candidate.id); }}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 size={16} />
            </button>
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </td>
      </tr>
      {showDetails && (
        <tr>
          <td colSpan="6" className="px-6 py-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Background Information</h4>
                <p className="text-sm text-gray-600">{candidate.background}</p>

                <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Head Teacher Notes</h4>
                <p className="text-sm text-gray-600">{candidate.headTeacherNotes}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Interview Notes</h4>
                <p className="text-sm text-gray-600">{candidate.interviewNotes}</p>

                <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Recommended Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.subjects.map((subject, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {subject}
                    </span>
                  ))}
                </div>

                <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Interview Score</h4>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={localScore}
                    onChange={(e) => setLocalScore(Number(e.target.value))}
                    min="0"
                    max="100"
                    className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                  <button
                    onClick={() => onUpdate(candidate.id, { interviewScore: localScore, status: 'completed' })}
                    className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Score
                  </button>
                </div>

                <div className="mt-4 flex space-x-2">
                  {activeTab === 'interview' && candidate.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onStatusChange(candidate.id, 'approved')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusChange(candidate.id, 'try')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        Needs Try
                      </button>
                      <button
                        onClick={() => onStatusChange(candidate.id, 'repeat')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                      >
                        Repeat
                      </button>
                    </>
                  )}

                  {activeTab === 'interview' && candidate.status !== 'pending' && (
                    <button
                      onClick={() => onMoveToQueue(candidate.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
                    >
                      Move to Admission Queue
                    </button>
                  )}

                  {activeTab === 'ready' && (
                    <button
                      onClick={() => onCompleteAdmission(candidate.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Complete Registration
                    </button>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const CandidateForm = ({ newCandidate, editingCandidate, handleInputChange, handleSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-red-400 bg-opacity-0 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg -mt-26 shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingCandidate ? 'Edit Candidate' : 'New Candidate'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1 text-lg">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newCandidate.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newCandidate.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Names</label>
              <input
                type="text"
                name="otherNames"
                value={newCandidate.otherNames}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
              <input
                type="text"
                name="previousSchool"
                value={newCandidate.previousSchool}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input
                type="text"
                name="level"
                value={newCandidate.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={newCandidate.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued By</label>
              <input
                type="text"
                name="issuedBy"
                value={newCandidate.issuedBy}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Information</label>
            <textarea
              name="background"
              value={newCandidate.background}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
              <input
                type="date"
                name="interviewDate"
                value={newCandidate.interviewDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Score</label>
              <input
                type="number"
                name="interviewScore"
                value={newCandidate.interviewScore}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Notes</label>
            <textarea
              name="interviewNotes"
              value={newCandidate.interviewNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Head Teacher Notes</label>
            <textarea
              name="headTeacherNotes"
              value={newCandidate.headTeacherNotes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Assignment</label>
              <input
                type="text"
                name="classAssignment"
                value={newCandidate.classAssignment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="e.g., Grade 10A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={newCandidate.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="try">Needs Try</option>
                <option value="repeat">Repeat</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
            >
              <Save size={18} className="mr-2" />
              {editingCandidate ? 'Update Candidate' : 'Create Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Tab = ({ id, title, setActiveTab, activeTab, Icon: Icon, candidates }) => {
  const count = candidates.filter(c => {
    if (id === 'interview') return c.status === 'pending' || c.status === undefined;
    if (id === 'ready') return c.status === 'completed';
    return false;
  }).length;

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative flex-row px-6 py-3 font-medium flex items-center ${activeTab === id ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-500 hover:text-gray-700'}`}
    >
      <Icon size={18} className="mr-2" />
      <p>{title}</p>
      <span className="ml-2 bg-grey-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
        {count}
      </span>
    </button>
  )
}

const AdmissionProcessForm = ({ onClose, onAdd }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showInterviewPrompt, setShowInterviewPrompt] = useState(true);
  const [interviewDecision, setInterviewDecision] = useState(null);
  const [step, setStep] = useState(1); // For multi-step direct admission

  // Form states
  const [interviewData, setInterviewData] = useState({
    fullName: '',
    previousSchool: '',
    interviewDate: new Date().toISOString().split('T')[0],
    level: '',
    subject: '',
    interviewScore: 0,
    status: 'pending',
    subjects: [],
    issuedBy: 'Head Teacher',
  });

  const [studentBio, setStudentBio] = useState({
    fullName: '',
    gender: '',
    level: '',
    // Add more bio fields as needed
  });

  const [parentDetails, setParentDetails] = useState({
    parentName: '',
    contact: '',
    // Add more fields as needed
  });

  const [photos, setPhotos] = useState({
    childPhoto: null,
    parentPhoto: null,
  });

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleInterviewChange = (e) => {
    setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
  };

  const handleBioChange = (e) => {
    setStudentBio({ ...studentBio, [e.target.name]: e.target.value });
  };

  const handleParentChange = (e) => {
    setParentDetails({ ...parentDetails, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhotos({ ...photos, [e.target.name]: e.target.files[0] });
  };

  const handleInterviewSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    console.log('Interview Data Submitted:', interviewData);
    const fullNameParts = interviewData.fullName.trim().split(' ');
    const newInterviewee = {
      firstName: fullNameParts[0] || '',
      lastName: fullNameParts.slice(-1)[0] || '',
      otherNames: fullNameParts.slice(1, -1).join(' ') || '',
      previousSchool: interviewData.previousSchool,
      level: interviewData.level,
      subject: interviewData.subject,
      interviewDate: interviewData.interviewDate,
      issuedBy: interviewData.issuedBy,
      status: 'pending',
    };
    onAdd(newInterviewee);
    onClose();
  };

  const handleDirectSubmit = (e) => {
    e.preventDefault();
    console.log('Direct Admission Submitted:', { studentBio, parentDetails, photos });
    const fullNameParts = studentBio.fullName.trim().split(' ');
    const newDirect = {
      firstName: fullNameParts[0] || '',
      lastName: fullNameParts.slice(-1)[0] || '',
      otherNames: fullNameParts.slice(1, -1).join(' ') || '',
      previousSchool: '',
      level: studentBio.level,
      subject: '',
      interviewDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Head Teacher',
      status: 'completed',
      admissionStatus: 'ready',
      gender: studentBio.gender,
      parentName: parentDetails.parentName,
      contact: parentDetails.contact,
      // Photos not stored in state for now
    };
    onAdd(newDirect);
    onClose();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderContent = () => {
    if (showInterviewPrompt) {
      return (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">Admission Process</h2>
          <p className="mb-4 text-gray-600">Do you want to give an interview paper to the candidate?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setInterviewDecision(true);
                setShowInterviewPrompt(false);
              }}
              className="bg-[#b91c1c] text-white px-4 py-2 rounded hover:bg-[#dc2626]"
            >
              Yes
            </button>
            <button
              onClick={() => {
                setInterviewDecision(false);
                setShowInterviewPrompt(false);
              }}
              className="bg-[#374151] text-white px-4 py-2 rounded hover:bg-[#4b5563]"
            >
              No
            </button>
          </div>
        </div>
      );
    }

    if (interviewDecision) {
      // Interview Form
      return (
        <form onSubmit={handleInterviewSubmit} className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">Interview Paper Details</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Candidate's Full Name</label>
            <input
              type="text"
              name="fullName"
              value={interviewData.fullName}
              onChange={handleInterviewChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Previous School</label>
            <input
              type="text"
              name="previousSchool"
              value={interviewData.previousSchool}
              onChange={handleInterviewChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subject</label>
            <select
              name="subject"
              value={interviewData.subject}
              onChange={handleInterviewChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value=''>Select Subject</option>
              <option value="Math">Math</option>
              <option value="Eng">Eng</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#b91c1c] text-white px-4 py-2 rounded hover:bg-[#dc2626]">
              Submit
            </button>
          </div>
        </form>
      );
    } else {
      // Direct Admission Multi-Step Form
      return (
        <form onSubmit={handleDirectSubmit} className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#374151]">Direct Admission - Step {step}/3</h2>

          {step === 1 && (
            <div>
              <h3 className="text-md font-medium mb-2 text-gray-700">Student's Bio</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={studentBio.fullName}
                  onChange={handleBioChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={studentBio.gender}
                  onChange={handleBioChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value=''>Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Level</label>
                <select
                  name="level"
                  value={studentBio.level}
                  onChange={handleBioChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value=''>Select Level</option>
                  <option value="Pre B">Pre B</option>
                  <option value="Pre C">Pre C</option>
                  <option value="Level 1">Level 1</option>
                  <option value="Level 2">Level 2</option>
                  <option value="Level 3">Level 3</option>
                  <option value="Level 4">Level 4</option>
                  <option value="Level 5">Level 5</option>
                  <option value="Level 6">Level 6</option>
                  <option value="Level 7">Level 7</option>
                </select>
              </div>
              {/* Add more bio fields as needed */}
              <div className="flex justify-end">
                <button type="button" onClick={nextStep} className="bg-[#b91c1c] text-white px-4 py-2 rounded hover:bg-[#dc2626]">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-md font-medium mb-2 text-gray-700">Parents/Guardian Details</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Parent/Guardian Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={parentDetails.parentName}
                  onChange={handleParentChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={parentDetails.contact}
                  onChange={handleParentChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              {/* Add more parent fields as needed */}
              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="bg-[#374151] text-white px-4 py-2 rounded hover:bg-[#4b5563]">
                  Previous
                </button>
                <button type="button" onClick={nextStep} className="bg-[#b91c1c] text-white px-4 py-2 rounded hover:bg-[#dc2626]">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-md font-medium mb-2 text-gray-700">Passport Photos</h3>
              <div className="mb-4">
                <label className="block text-gray-700">Child's Passport Photo</label>
                <input
                  type="file"
                  name="childPhoto"
                  onChange={handlePhotoChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Parent/Guardian's Passport Photo</label>
                <input
                  type="file"
                  name="parentPhoto"
                  onChange={handlePhotoChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="bg-[#374151] text-white px-4 py-2 rounded hover:bg-[#4b5563]">
                  Previous
                </button>
                <button type="submit" className="bg-[#b91c1c] text-white px-4 py-2 rounded hover:bg-[#dc2626]">
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-40 h-[80vh] top-20">
      {/* Background Overlay */}
      <div className="absolute bg-black opacity-50 z-10 w-full h-full"></div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#b91c1c]"></div>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 inset-1 bottom-0 flex items-center justify-center p-4 h-fit w-full relative z-20">
            <div className="bg-white rounded-lg opacity-100 shadow-xl w-full h-full max-w-2xl max-h-screen overflow-y-auto">
              {renderContent()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#374151] hover:text-[#b91c1c] z-20"
          >
            <X size={20} />
          </button>
        </>
      )}
    </div>
  );
};


export default AdmissionSystem;  