import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../layout/AuthenticatedLayout'
import { Icons } from '../../components/svg/Icons'
import ActionModal from '../../components/ui/ActionModal'
import { ArchiveModal } from '../../components/shared/ArchiveModal';
import CopyLinkModal from '../../components/common/CopyLinkModal';
import { getAllIntakes, getAllarchiveCase, acceptCase, getTaskbyCaseId } from '../../services/cases';
import { ArchiveActionMenu } from './ArchiveActionMenu';
import { useNavigate } from 'react-router-dom';
import { CustomModal } from '../../components/ui/CustomModal';
import { TaskForm } from '../OngoingCases/partials/TaskForm';
import { DeleteTaskModal } from '../../components/shared/DeleteTaskModal';
import TranscriptDownload from '../../components/common/TranscriptDownload';
import { useSelector } from 'react-redux';
import { message } from "antd";

import { Form } from "antd";
const dropdownAnimation = `
  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
  }
`;

// Utility to format phone numbers with country code, e.g. +1 (603) 555-0123
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  // Assume US-style numbers, but keep country code if present
  let country = '';
  let number = cleaned;
  if (cleaned.length > 10) {
    country = '+' + cleaned.slice(0, cleaned.length - 10);
    number = cleaned.slice(-10);
  }

  const match = number.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${country} (${match[1]}) ${match[2]}-${match[3]}`;
  }
  return country ? `${country} ${number}` : number;
}

// Utility to get status dot color: red if archived, green if all questions completed, else orange
function getStatusDotColor(questions = [], isArchived = false) {
  if (isArchived) return '#EF4444'; // red for archived items
  if (!questions.length) return '#F59E42'; // orange if no questions
  const allCompleted = questions.every(q => q.status === 'Completed');
  return allCompleted ? '#22C55E' : '#F59E42'; // green : orange
}

const Home = () => {
  const [cases, setCases] = useState([]);
  const [isCopyLinkModalOpen, setIsCopyLinkModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("new");

  const [archivedCases, setArchivedCases] = useState([]);
  const [selectedCase, setselectedCase] = useState(cases[0]);
  const [filteredCases, setFilteredCases] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  const navigate = useNavigate();
  const [addForm] = Form.useForm();

  const [isTranscriptDownloadModalOpen, setIsTranscriptDownloadModalOpen] = useState(false);
  const [transcriptToDownload, setTranscriptToDownload] = useState('');

  const [tasks, setTasks] = useState([]);

  const user = useSelector((state) => state.auth.user);


  useEffect(() => {
    // Set current page in localStorage on component mount
    localStorage.setItem('currentPage', 'intake');

    fetchAllIntakes();
    fetchArchivedCases();
  }, []);

  const fetchAllIntakes = () => {
    return getAllIntakes()
      .then((response) => {
        const formattedCases = response?.intakeCases?.map((item) => ({
          ...item,
          phoneNumber: formatPhoneNumber(item.phoneNumber),
          initials: item.fullName?.split(' ').map((name) => name.charAt(0).toUpperCase()).join(''),
        })) || [];
        setCases(formattedCases);
        return formattedCases;
      })
      .catch((err) => {
        return [];
      });
  };

  const fetchArchivedCases = () => {
    return getAllarchiveCase(user?.id)
      .then((response) => {
        const archivedCases = (response || []).map((item) => {
          const intake = { ...item.intake }
          return {
            ...intake,
            id: item.id,
            phoneNumber: formatPhoneNumber(intake.phoneNumber),
            initials: intake.fullName?.split(' ').map((name) => name.charAt(0).toUpperCase()).join(''),
          };
        });
        setArchivedCases(archivedCases);
        return archivedCases;
      })
      .catch((err) => {
        return [];
      });
  };

  useEffect(() => {
    if (selectedCase) {
      getTaskbyCaseId(selectedCase?.id)
        .then((response) => {
          setTasks(response);
        })
        .catch((err) => {
          message.error(err.message || "Error fetching tasks");
        });
    }
  }, [selectedCase]);

  // Track which questions are open
  const [openQuestions, setOpenQuestions] = useState({});
  const toggleTask = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCaseSelect = (caseItem) => {
    setselectedCase(caseItem);
    setOpenQuestions({});
  };

  // Add state for modals
  const [deleteQuestionModalVisible, setDeleteQuestionModalVisible] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [contactInfoModalVisible, setContactInfoModalVisible] = useState(false);

  const handleDeleteQuestion = (questionId) => {
    setQuestionToDelete(questionId);
    setDeleteQuestionModalVisible(true);
  };

  // Add function to handle actual question deletion after confirmation
  const deleteTaskSuccess = (selectedTaskId) => {
    if (!selectedTaskId) return;
    setTasks(prevTasks => prevTasks.filter(task => task.id !== selectedTaskId));

    setDeleteQuestionModalVisible(false);
    setQuestionToDelete(null);
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredCases((activeTab === "new" ? cases : archivedCases)?.filter(
        (contact) =>
          contact.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    } else {
      setFilteredCases(activeTab === "new" ? cases : archivedCases)
    }
  }, [cases, archivedCases, searchQuery, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");

    setselectedCase(null);
    setOpenQuestions({});
  };

  const [acceptModalVisible, setAcceptModalVisible] = useState(false);

  const confirmAcceptClient = async () => {
    try {
      const handleAcceptCase = (caseId) => {
        const model = {
          caseId: caseId,
          attorneyId: user?.id,
        };

        acceptCase(model)
          .then((response) => {
            message.success(response?.message || "Case accepted successfully");
            setCases(prevCases =>
              prevCases.map(c =>
                c.id === caseId ? { ...c, status: 'accepted' } : c
              )
            );
            setAcceptModalVisible(true);
            setTimeout(() => {
              setAcceptModalVisible(false);
              navigate('/ongoing-cases');
            }, 1000);
          })
          .catch((err) => {
            message.error(err?.message || "Failed to accept case");
          });
      };
      handleAcceptCase(selectedCase.id);
    } catch (error) {
      message.error(error?.message || "Error accepting client");
    }
  };

  const [openArchiveModal, setOpenArchiveModal] = useState(false);

  const handleArchiveSuccess = (archivedCase) => {
    setCases(prevCases => prevCases.filter(c => c.id !== archivedCase.id));
    setArchivedCases(prevArchived => [
      {
        ...archivedCase,
        phoneNumber: formatPhoneNumber(archivedCase.phoneNumber),
        initials: archivedCase.fullName?.split(' ').map((name) => name.charAt(0).toUpperCase()).join(''),
      },
      ...prevArchived
    ]);
    setOpenArchiveModal(false);
    setActiveTab("archived");
    setselectedCase(null);
    setOpenQuestions({})
  };

  const handleCaseMoveToNewSuccess = () => {
    setCases(prevCases => [...prevCases, selectedCase]);
    setArchivedCases(prevArchived => prevArchived.filter(c => c.id !== selectedCase.id));

    setActiveTab("new");
    setselectedCase(null);
    setOpenQuestions({})
  };

  const handleCaseDeleteSuccess = (selectedCaseId) => {
    if (!selectedCase) return;
    setArchivedCases(prevArchived => prevArchived.filter(c => c.id !== selectedCase.id));
    setOpenQuestions({});

    setTimeout(() => {
      setActiveTab("archived");
      setselectedCase(null);
      setOpenQuestions({})
    }, 1000);
  }

  const [selectedEditTask, setSelectedEditTask] = useState({});

  const handleTaskSave = (task = null) => {
    setSelectedEditTask({
      id: task?.id,
      taskTitle: task?.taskTitle,
      status: task?.status,
      description: task?.description,
      files: task?.files,
    });
    setTaskModalVisible(true);
  };

  const handleTaskCancel = () => {
    addForm.resetFields();
    setTaskModalVisible(false);
  };

  const handleTaskSaveSubmit = (updatedTask) => {
    setSearchQuery('');
    setTasks(prevTasks => {
      // If task exists, update it, otherwise prepend the new task
      const taskExists = prevTasks.some(task => task.id === updatedTask.id);
      if (taskExists) {
        return prevTasks.map(task =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      } else {
        return [updatedTask, ...prevTasks];
      }
    });
    handleTaskCancel();
  };

  return (
    <AuthenticatedLayout>
      <style>{dropdownAnimation}</style>
      <div className='flex justify-between items-center gap-2'>
        <p className='fs-20 fw-600 text-blue-39'>Intake</p>
        <div className="flex items-center gap-1.5">
          <p className='fs-14 fw-400 text-blue-85'>Home</p>
          <Icons.ArrowRightIcon />
          <p className='fs-14 fw-400 text-blue-39'>Intake</p>
        </div>
      </div>
      {/* ----------------------------------------------------------------------------- */}
      <div className="content-card-bg flex flex-col items-start relative mt-6">
        <div className="cases-tabs-container">
          <div className="inline-flex items-start gap-1 p-0.5 relative flex-[0_0_auto] bg-[#f2f3f6] rounded-lg">
            <div
              className={`new-cases-btn cursor-pointer inline-flex h-10 items-center justify-center gap-2 px-4 py-2.5 relative flex-[0_0_auto] ${activeTab === "new" ? "bg-white rounded-md shadow-[0px_1px_2px_#1018280d]" : "bg-transparent"
                }`}
              onClick={() => handleTabChange("new")}
            >
              <div className={`relative w-fit mt-[-1.00px] [font-family:'Outfit',Helvetica] font-medium ${activeTab === "new" ? "text-[#0f1728]" : "text-[#667084]"
                } text-sm tracking-[0] leading-5 whitespace-nowrap`}>
                New Cases
              </div>

              <div className={`mt-[-1.00px] mb-[-1.00px] inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] rounded-[999px] ${activeTab === "new" ? "bg-[#ECF3FF]" : "bg-white"
                }`}>
                <div className={`relative w-fit mt-[-1.00px] font-medium text-xs text-center leading-[18px] whitespace-nowrap [font-family:'Outfit',Helvetica] tracking-[0] ${activeTab === "new" ? "text-[#465FFF]" : "text-[#667085]"
                  }`}>
                  {cases?.length}
                </div>
              </div>
            </div>

            <div
              className={`archived-btn cursor-pointer inline-flex h-10 items-center justify-center gap-2 px-4 py-2.5 relative flex-[0_0_auto] ${activeTab === "archived" ? "bg-white rounded-md shadow-[0px_1px_2px_#1018280d]" : "bg-transparent"
                }`}
              onClick={() => handleTabChange("archived")}
            >
              <div className={`relative w-fit mt-[-1.00px] [font-family:'Outfit',Helvetica] font-medium ${activeTab === "archived" ? "text-[#0f1728]" : "text-[#667084]"
                } text-sm tracking-[0] leading-5 whitespace-nowrap`}>
                Archived
              </div>

              <div className={`mt-[-1.00px] mb-[-1.00px] inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] rounded-[999px] ${activeTab === "archived" ? "bg-[#ECF3FF]" : "bg-white"
                }`}>
                <div className={`relative w-fit mt-[-1.00px] font-medium text-xs text-center leading-[18px] whitespace-nowrap [font-family:'Outfit',Helvetica] tracking-[0] ${activeTab === "archived" ? "text-[#465FFF]" : "text-[#667085]"
                  }`}>
                  {archivedCases?.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -----------------CONTENT WRAPPER DIV------------------------------------------------------------ */}
        <div className="content-wrapper-div">
          <div className="contact-list-main-div">
            <div className="flex flex-col w-[264px] items-start gap-1.5 relative flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 px-4 py-2 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg overflow-hidden border border-solid border-[#cfd4dc] shadow-[0px_1px_2px_#1018280d]">
                  <div className="flex items-center gap-2 relative flex-1 grow">
                    <div className="relative w-5 h-5">
                      <img
                        className="absolute w-[17px] h-[17px] top-0.5 left-0.5"
                        alt="Icon"
                        src="https://c.animaapp.com/m8ta5gibWvtvPM/img/icon-3.svg"
                      />
                    </div>

                    <input
                      className="relative flex-1 mt-[-1.00px] font-normal text-[#98a1b2] text-sm leading-5 [font-family:'Outfit',Helvetica] tracking-[0] [background:transparent] border-[none] p-0 focus:outline-none focus:ring-0 focus:border-transparent"
                      placeholder="Search..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* -----------------CONTACT LIST  ----------------------------- */}
            </div>

            {/* ---------------CONTACT LIST  -----------------------------  */}
            <div className="h-[720px] gap-1 px-5 py-0 flex flex-col items-start relative self-stretch w-full">
              {filteredCases?.map((contact, index) => {
                // Generate pretty pastel background and readable text color from initials or name
                function getColorPairFromString(str) {
                  let hash = 0;
                  for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  const pastel = `hsl(${hash % 360}, 70%, 90%)`;
                  const text = `hsl(${hash % 360}, 70%, 30%)`;
                  return { bgColor: pastel, textColor: text };
                }
                const { bgColor, textColor } = getColorPairFromString(contact.initials || contact.fullName || '');
                return (
                  <div
                    key={index}
                    className={`contact-list-item flex flex-col items-start gap-[50px] p-3 relative self-stretch w-full flex-[0_0_auto] rounded-lg transition-all duration-300 hover:bg-[var(--Card-Secondary-Background,#F2F4F7)] hover:rounded-[var(--Utilities-Border-Radius-LG,8px)] cursor-pointer ${selectedCase && selectedCase.phoneNumber === contact.phoneNumber ? 'active bg-[var(--Card-Secondary-Background,#F2F4F7)] rounded-[var(--Utilities-Border-Radius-LG,8px)]' : ''}`}
                    onClick={() => handleCaseSelect(contact)}
                  >
                    <div className="flex items-center gap-3 relative self-stretch w-full flex-[0_0_auto]">
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-full"
                        style={{ backgroundColor: contact.bgColor || bgColor }}
                      >
                        <span
                          className="font-semibold text-base"
                          style={{ color: contact.textColor || textColor }}
                        >
                          {contact.initials}
                        </span>
                      </div>

                      <div className="flex flex-col items-start justify-center gap-0.5 relative flex-1 grow">
                        <div className="relative contact-name">{contact.fullName}</div>
                        <div className="relative contact-phone fs-12 fw-400 text-gray-500">{contact.phoneNumber}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]">
            <div className="contact-detail-div flex flex-col w-[828px] h-[800px] items-center relative bg-white border-r [border-right-style:solid] border-b [border-bottom-style:solid] border-[#e4e7ec]">
              <div className="flex h-16 items-center gap-4 px-6 py-5 relative self-stretch w-full border-b [border-bottom-style:solid] border-[#e4e7ec]">
                {/* Status dot: green if all questions completed, else orange */}
                <div
                  className="relative w-5 h-5 rounded-[10px]"
                  style={{ backgroundColor: selectedCase ? getStatusDotColor(selectedCase?.questions || [], activeTab === 'archived') : 'grey' }}
                />

                <div className="flex flex-col items-start gap-1 relative flex-1 grow mt-[-11.00px] mb-[-11.00px]">
                  <div className="self-stretch relative mt-[-1.00px] fs-14 fw-500 text-blue-39">
                    {selectedCase ? selectedCase.fullName : "No contact selected"}
                  </div>

                  <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                    <div className="w-fit whitespace-nowrap relative mt-[-1.00px] fs-12 fw-400 text-blue-85">
                      {selectedCase ? selectedCase.phoneNumber : ""}
                    </div>

                    {/* Only show "Transferred Call" text in New Cases tab */}
                    {selectedCase && activeTab === "new" && (
                      <div className="w-fit whitespace-nowrap relative mt-[-1.00px] fs-12 fw-400 text-primary">
                        Transferred Call
                      </div>
                    )}
                  </div>
                </div>

                {/* Show action buttons for New Cases tab */}
                {selectedCase && activeTab === "new" && (
                  <div className="flex-center relative flex-[0_0_auto] mt-[-8.00px] mb-[-8.00px]">
                    <div className="flex-center relative flex-[0_0_auto] overflow-hidden bg--btn">
                      <div className="relative w-6 h-6"
                        onClick={() => {
                          const currentUrl = window.location.href;
                          setTranscriptToDownload(`${currentUrl}/share/${selectedCase?.id}`); // Replace with your actual link generation logic
                          setIsTranscriptDownloadModalOpen(true);
                        }}>
                        <Icons.downloadIcon />
                      </div>
                    </div>

                    <div
                      className="case-move-btn relative flex-[0_0_auto] overflow-hidden bg--btn cursor-pointer"
                      onClick={() => {
                        setOpenArchiveModal(true);
                      }}

                    >
                      <div className="relative w-6 h-6">
                        <Icons.DeleteIcon />
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm accept-btn"
                      onClick={confirmAcceptClient}
                    >
                      Accept
                    </button>
                  </div>
                )}

                {/* Show vertical ellipsis menu for Archive tab */}
                {selectedCase && activeTab === "archived" && (
                  <div
                    className="flex-center relative flex-[0_0_auto] mt-[-8.00px] mb-[-8.00px] cursor-pointer"
                  >
                    <ArchiveActionMenu onMoveSuccess={handleCaseMoveToNewSuccess} onDeleteSuccess={handleCaseDeleteSuccess} selectedCase={selectedCase} />
                  </div>
                )}
              </div>

              <div className="flex flex-col h-[688px] items-start gap-6 p-6 relative self-stretch w-full bg-white overflow-hidden overflow-y-scroll">
                <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] whitespace-nowrap fs-16 fw-500 text-blue-39">
                      Intake
                    </div>
                  </div>

                  {/* Only show the Intake action icons in New Cases tab */}
                  {activeTab === "new" && selectedCase && Object.keys(selectedCase).length > 0 && (
                    <div className="flex w-24 items-center justify-between relative">
                      <div className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]">
                        <div
                          className="flex p-2.5 self-stretch w-full bg-white rounded-lg items-center justify-center gap-2 relative flex-[0_0_auto] overflow-hidden border-0 border-none cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            // In a real app, you would generate the actual link here
                            setIsCopyLinkModalOpen(true);
                          }}
                        >
                          <div className="relative w-5 h-5">
                            <img
                              className="absolute w-[15px] h-[15px] top-[3px] left-[3px]"
                              alt="Copy Link"
                              src="https://c.animaapp.com/m8ta5gibWvtvPM/img/icon-14.svg"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="inline-flex p-2.5 bg-[#ecf3ff] rounded-[999px] items-center justify-center gap-2 relative flex-[0_0_auto] overflow-hidden border-0 border-none">
                        <div
                          className="relative w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setTaskModalVisible(true)}
                        >
                          <img
                            className="absolute w-3 h-3 top-1 left-1"
                            alt="Contact Info"
                            src="https://c.animaapp.com/m8ta5gibWvtvPM/img/icon-5.svg"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ------------------------------------------------------------- */}
                {selectedCase && tasks?.map((item) => (
                  <div key={item.id} className="flex items-center gap-5 p-5 w-full relative bg-white rounded-xl border border-solid border-[#e4e7ec] shadow-shadows-shadow-sm">
                    <div className="flex items-center gap-4 relative flex-1 grow">
                      <div className="items-start gap-3 flex-1 grow flex relative">
                        <div className={`cursor-pointer ${openQuestions[item.id] ? 'hidden' : ''}`} onClick={() => toggleTask(item.id)}>
                          <Icons.QuestionIconRIght />
                        </div>
                        <div className={`cursor-pointer ${openQuestions[item.id] ? '' : 'hidden'}`} onClick={() => toggleTask(item.id)}>
                          <Icons.QuestionDropDown />
                        </div>
                        <div className="flex flex-col items-start justify-center gap-1 relative flex-1 grow">
                          <div className="items-center gap-2.5 self-stretch w-full flex-[0_0_auto] flex relative">
                            <p className="cursor-pointer relative w-fit text-base font-medium text-gray-600 leading-6"
                              onClick={() => toggleTask(item.id)}>
                              {item.taskTitle}
                            </p>
                          </div>

                          <div className={`dropdown-content items-center justify-center gap-2.5 self-stretch w-full flex-[0_0_auto] flex relative ${openQuestions[item.id] ? 'animate-slideDown' : 'hidden'}`}>
                            <p className="relative flex-1 text-sm font-normal text-gray-900 leading-6">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Only show status badges in New Cases tab */}
                    {activeTab === "new" && (
                      <div
                        className={`inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] rounded-[999px] ${item.status === "Completed"
                          ? "bg-[#ECFDF3]"
                          : "bg-[#FFFAEB]"
                          }`}
                      >
                        <div
                          className={`relative w-fit status-tag ${item.status === "Completed"
                            ? "text-[#039855]"
                            : "text-[#F59E42]"
                            }`}
                        >
                          {item.status}
                        </div>
                      </div>
                    )}

                    {/* Only show edit and delete icons in New Cases tab */}
                    {activeTab === "new" && (
                      <>
                        <div className="relative w-6 h-6 cursor-pointer" onClick={() => handleTaskSave(item)}>
                          <Icons.EditIcon />
                        </div>

                        <div
                          className="relative w-6 h-6 cursor-pointer delete-question-btn"
                          onClick={() => handleDeleteQuestion(item.id)}
                        >
                          <Icons.DelBoxIcon />
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {/* ------------------------------------------------------------- */}
              </div>
            </div>
          </div>
        </div>
        {/* -----------------CONTENT WRAPPER DIV------------------------------------------------------------ */}
      </div>
      {/* Contact Info Modal */}
      <ActionModal
        open={contactInfoModalVisible}
        onCancel={() => setContactInfoModalVisible(false)}
        title="Contact Information"
        okText="Close"
        onOk={() => setContactInfoModalVisible(false)}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium"
              style={{
                backgroundColor: selectedCase?.bgColor || '#f3f4f6',
                color: selectedCase?.textColor || '#6b7280'
              }}
            >
              {selectedCase?.initials || '?'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCase?.fullName || 'Unknown Contact'}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedCase?.phoneNumber || 'No phone number'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <span className="text-sm text-gray-900">
                {selectedCase?.email || 'No email provided'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className="text-sm text-gray-900">
                {selectedCase?.status || 'Active'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-500">Last Contacted:</span>
              <span className="text-sm text-gray-900">
                {selectedCase?.lastContacted ? new Date(selectedCase.lastContacted).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </ActionModal>

      {/* ----------------------------------------------------------------------------- */}

      <DeleteTaskModal
        selectedtask={questionToDelete}
        open={deleteQuestionModalVisible}
        onClose={() => setDeleteQuestionModalVisible(false)}
        onDeleteSuccess={deleteTaskSuccess}
      />

      {/* Accept confirmation modal */}
      <ActionModal
        open={acceptModalVisible}
        onCancel={() => setAcceptModalVisible(false)}
        onConfirm={confirmAcceptClient}
        title="Client Accepted"
        content="Congratulations! You've successfully accepted the client."
        showButtons={false}
        icon={
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45.8187 9.13404C51.494 -3.04468 68.506 -3.04468 74.1813 9.13404C77.3505 15.9347 84.7459 19.563 91.9408 17.8471C104.826 14.7743 115.432 28.3245 109.625 40.4382C106.382 47.2026 108.208 55.3554 114.011 60.0163C124.403 68.3633 120.617 85.2601 107.7 88.187C100.486 89.8214 95.3686 96.3594 95.4096 103.887C95.4831 117.369 80.1559 124.889 69.8558 116.425C64.1042 111.698 55.8958 111.698 50.1442 116.425C39.8441 124.889 24.5169 117.369 24.5903 103.887C24.6314 96.3594 19.5136 89.8214 12.3004 88.187C-0.61705 85.2601 -4.40257 68.3633 5.98913 60.0163C11.7919 55.3554 13.6184 47.2026 10.3754 40.4382C4.56763 28.3245 15.1744 14.7743 28.0592 17.8471C35.2541 19.563 42.6495 15.9347 45.8187 9.13404Z" fill="#ECFDF3" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M46.9375 60C46.9375 52.785 52.7864 46.9361 60.0014 46.9361C67.2164 46.9361 73.0653 52.785 73.0653 60C73.0653 67.215 67.2164 73.0639 60.0014 73.0639C52.7864 73.0639 46.9375 67.215 46.9375 60ZM60.0014 43.9361C51.1296 43.9361 43.9375 51.1281 43.9375 60C43.9375 68.8719 51.1296 76.0639 60.0014 76.0639C68.8733 76.0639 76.0653 68.8719 76.0653 60C76.0653 51.1281 68.8733 43.9361 60.0014 43.9361ZM65.7855 58.0571C66.3713 57.4713 66.3713 56.5215 65.7855 55.9358C65.1997 55.35 64.25 55.35 63.6642 55.9358L58.7177 60.8823L56.3387 58.5032C55.7529 57.9174 54.8031 57.9174 54.2173 58.5032C53.6316 59.089 53.6316 60.0388 54.2173 60.6245L57.657 64.0642C57.9383 64.3455 58.3199 64.5036 58.7177 64.5036C59.1155 64.5036 59.4971 64.3455 59.7784 64.0642L65.7855 58.0571Z" fill="#039855" />
          </svg>
        }
      />

      {/* Add/Edit Task Modal */}
      {taskModalVisible && (
        <CustomModal open={taskModalVisible} onClose={handleTaskCancel}>
          <TaskForm
            key={selectedEditTask ? 'edit' : 'add'}
            caseId={selectedCase?.id}
            form={addForm}
            onSubmit={handleTaskSaveSubmit}
            onCancel={handleTaskCancel}
            isEdit={Object.keys(selectedEditTask).length > 0}
            initialValues={selectedEditTask || {}}
          />
        </CustomModal>
      )}

      {/* Archive case Modal */}
      <ArchiveModal
        isOpen={openArchiveModal}
        onClose={() => {
          setOpenArchiveModal(false);
        }}
        onArchiveSucess={handleArchiveSuccess}
        caseItem={selectedCase}
      />

      <CopyLinkModal
        isOpen={isCopyLinkModalOpen}
        onClose={() => setIsCopyLinkModalOpen(false)}
        caseId={selectedCase?.id}
      />

      <TranscriptDownload
        isOpen={isTranscriptDownloadModalOpen}
        onClose={() => setIsTranscriptDownloadModalOpen(false)}
        link={transcriptToDownload}
      />
    </AuthenticatedLayout>
  );
};

export default Home;
