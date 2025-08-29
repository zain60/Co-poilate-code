import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '../../layout/AuthenticatedLayout'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { deleteSingleCase, getAllarchiveCase } from '../../services/cases';
import { formatDate } from '../../helper/formateDate';
import { ArchiveActionMenu } from '../Dashboard/ArchiveActionMenu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Archive = () => {
    const navigate = useNavigate();
    // Add state to track which dropdown is open
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    // Add state for delete modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    // Add state for move modal
    const [moveModalOpen, setMoveModalOpen] = useState(false);
    const [itemToMove, setItemToMove] = useState(null);

    const user = useSelector((state) => state.auth.user);
    // Function to handle dropdown toggle
    const toggleDropdown = (index) => {
        if (openDropdownIndex === index) {
            setOpenDropdownIndex(null);
        } else {
            setOpenDropdownIndex(index);
        }
    };

    const [deleteData, setDeleteData] = useState({});

    // Function to open delete modal
    const handleDeleteClick = (item, index) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
        setOpenDropdownIndex(null); // Close dropdown after clicking

        setDeleteData(item)

    };

    // Function to open move modal
    const handleMoveClick = (item, index) => {
        setItemToMove(item);
        setMoveModalOpen(true);
        setOpenDropdownIndex(null); // Close dropdown after clicking
    };

    // Function to handle deletion confirmation
    const handleConfirmDelete = () => {
        // Implement actual deletion logic here
        deleteSingleCase(deleteData?.caseId)
            .then((response) => {
                setIsDeleteModalVisible(false);

                setDeleteModalOpen(false);
                setItemToDelete(null);
            })
            .catch((err) => {
                console.error("Error delete case:", err);
                setError("Failed to delete case data. Please try again later.");
            });
    };

    // Function to handle move confirmation
    const handleConfirmMove = () => {
        // Implement actual move logic here
        console.log('Moving item to ongoing cases:', itemToMove);
        setMoveModalOpen(false);
        setItemToMove(null);
    };

    const breadcrumbLinks = [
        { label: "Home", href: "/" },
        { label: "Archive" },
    ];

    // Sample data array for archive items
    const archiveItems = [
        {
            case: {
                fullName: "Robyn Washington",
                filesCount: 4,
                accidentDate: "04/01/24",
                caseStartDate: "01/26/25",
                status: "Archived"
            }
        },
        {
            case: {
                fullName: "John Smith",
                filesCount: 2,
                accidentDate: "03/15/24",
                caseStartDate: "03/20/24",
                status: "Archived"
            }
        },
        {
            case: {
                fullName: "Emma Johnson",
                filesCount: 6,
                accidentDate: "02/10/24",
                caseStartDate: "02/25/24",
                status: "Archived"
            }
        },
        {
            case: {
                fullName: "Emma Johnson",
                filesCount: 6,
                accidentDate: "02/10/24",
                caseStartDate: "02/25/24",
                status: "Archived"
            }
        },
    ];

    const [cases, setCases] = useState([]); // State to store cases
    const [error, setError] = useState(null); // State to store errors
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    // Fetch all cases when the component mounts
    useEffect(() => {
        localStorage.setItem('currentPage', 'archive');

        fetchAllArchivedCases();
    }, []);

    const fetchAllArchivedCases = () => {
        getAllarchiveCase(user?.id)
            .then((response) => {
                setCases(response);
            })
            .catch((err) => {
                message.error(err?.message);
                setError("Failed to fetch cases. Please try again later.");
            });
    };

    // Update the filtered cases based on the search query
    const filteredCases = cases.filter((item) =>
        item?.case?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCaseMoveToNewSuccess = () => {
        navigate("/ongoing-cases");
    };

    const handleCaseDeleteSuccess = (selectedCaseId) => {
        const newCases = cases.filter((currentCase) => currentCase?.id !== selectedCaseId);
        setCases(newCases);
    };

    return (
        <>
            <AuthenticatedLayout>
                <div className='lg:flex gap-2 justify-between mb-6'>
                    <p className='fs-20 fw-600 text-blue-39'>Archive</p>
                    <Breadcrumb links={breadcrumbLinks} />
                </div>

                <div className="content-card-bg p--24">
                    <div className="lg:flex xl:flex justify-between items-center border-b border-solid border-[#e4e7ec] pb-2.5 mb-6 relative">
                        <div className="flex flex-col w-full">
                            <h1 className="text-xl font-semibold text-gray-800">Cases</h1>
                        </div>

                        <div className="flex  md:flex-row flex-col justify-end gap-4 w-full">
                            <Input
                                placeholder="Search cases..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="md:max-w-sm w-full order-1 md:order-0 h-12"
                                size="large"
                                onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
                            />

                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[20px_20px] relative">
                        {filteredCases.map((item, index) => (
                            <div key={index} className="flex flex-col w-full items-center gap-2 p-2 relative bg-white rounded-2xl overflow-hidden border border-solid border-[#e4e7ec]">
                                <div className="flex flex-col items-start gap-3 p-4 relative flex-1 self-stretch w-full grow bg-[#f8f9fb] rounded-lg">
                                    <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                                        <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px]  whitespace-nowrap fs-20 fw-700 text-blue-39">
                                                {item?.case.fullName}
                                            </div>
                                        </div>

                                        <div className="flex-center relative flex-[0_0_auto] mt-[-8.00px] mb-[-8.00px] cursor-pointer">
                                            <ArchiveActionMenu onMoveSuccess={handleCaseMoveToNewSuccess} onDeleteSuccess={handleCaseDeleteSuccess} fromArchivedPage={true} selectedCase={item.case} />
                                        </div>
                                    </div>

                                    <div className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto]">
                                        <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px]  whitespace-nowrap fs-14 fw-400 text-blue-85">
                                                No of files:
                                            </div>

                                            <div className="relative w-fit mt-[-1.00px]  whitespace-nowrap fs-14 fw-500 text-gray-54">
                                                {item?.case.filesCount || 0}
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px]  whitespace-nowrap fs-14 fw-400 text-blue-85">
                                                Date of Accident:
                                            </div>

                                            <div className="relative w-fit mt-[-1.00px]  whitespace-nowrap fs-14 fw-500 text-gray-54">
                                                {formatDate(item?.case.dateOfAccident) || 0}
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                                            <div className="relative w-fit mt-[-1.00px]  whitespace-nowrap  fs-14 fw-400 text-blue-85">
                                                Case Started on:
                                            </div>

                                            <div className="relative w-fit mt-[-1.00px]  whitespace-nowrap fs-14 fw-500 text-gray-54">
                                                {formatDate(item.case?.startDate) || 'Not started yet'}
                                            </div>
                                        </div>

                                        <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                                            <div className="relative w-fit  whitespace-nowrap fs-14 fw-400 text-blue-85">
                                                Case Status:
                                            </div>

                                            <div className="inline-flex items-center justify-center px-2.5 py-0.5 relative flex-[0_0_auto] bg-[#98A2B3] rounded-[999px]">
                                                <div className="relative w-fit mt-[-1.00px]  text-white  text-center   whitespace-nowrap fs-14 fw-500">
                                                    Archived
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </AuthenticatedLayout>
        </>
    )
}
