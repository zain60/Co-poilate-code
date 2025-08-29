import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import { Icons } from './svg/Icons';
import { CustomModal } from '../components/ui/CustomModal';
import { TaskForm } from '../../src/pages/OngoingCases/partials/TaskForm';
import { Form } from 'antd';
import { DeleteTaskModal } from '../../src/components/shared/DeleteTaskModal';
import { message } from 'antd';
import { getTaskbyCaseId } from '../services/cases';
import CopyLinkModal from '../components/common/CopyLinkModal';

export const TasksTabs = ({ caseItem }) => {
  const tabs = [
    { id: "all", label: "All Tasks", count: 0 },
    { id: "todo", label: "To do", count: 0 },
    { id: "client", label: "Client Data", count: 0 },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  const [openQuestions, setOpenQuestions] = useState({});
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteTaskModalVisible, setIsDeleteTaskModalVisible] = useState(false);
  const [isCopyLinkModalOpen, setIsCopyLinkModalOpen] = useState(false);

  const [taskData, setTaskData] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [clientTasks, setClientTasks] = useState([]);

  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
    setSelectedTask(null);
    addForm.resetFields();
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsAddModalVisible(true);
    addForm.setFieldsValue(task);
  };

  const handleAddCancel = () => {
    addForm.resetFields();
    setIsAddModalVisible(false);
  };

  const handleAddSubmit = async (task) => {
    try {
      if (selectedTask) {
        setTaskData(prevTasks =>
          prevTasks.map(t => t.id === selectedTask.id ? { ...task, id: selectedTask.id } : t)
        );
        if (selectedTask.answer.length === 0) {
          setTodoTasks(prevTasks => prevTasks.map(t => t.id === selectedTask.id ? { ...task, id: selectedTask.id } : t));
        } else {
          setClientTasks(prevTasks => prevTasks.map(t => t.id === selectedTask.id ? { ...task, id: selectedTask.id } : t));
        }
      } else {
        setTaskData(prevTasks => [task, ...prevTasks]);
        setTodoTasks(prevTasks => [task, ...prevTasks]);
      }

      setIsAddModalVisible(false);
      addForm.resetFields();
      setSelectedTask(null);
    } catch (error) {
      message.error(error.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setIsDeleteTaskModalVisible(true);
  };

  const handleDeleteTaskSuccess = async () => {
    try {
      setTaskData(prevTasks => prevTasks.filter(t => t.id !== selectedTask.id));
      if (selectedTask.answer.length === 0) {
        setTodoTasks(prevTasks => prevTasks.filter(t => t.id !== selectedTask.id));
      } else {
        setClientTasks(prevTasks => prevTasks.filter(t => t.id !== selectedTask.id));
      }

      setIsDeleteTaskModalVisible(false);
      setSelectedTask(null);

      message.success('Task deleted successfully');
    } catch (error) {
      message.error(error.message || 'Failed to delete task');
    }
  };

  useEffect(() => {
    getTaskbyCaseId(caseItem?.id)
      .then((response) => {
        setTaskData(response);
        const todoTasks = response.filter((task) => task.answer?.length === 0 || task.answer === null);
        const clientTasks = response.filter((task) => task.answer?.length > 0 || task.answer !== null);
        setTodoTasks(todoTasks);
        setClientTasks(clientTasks);
      })
      .catch((err) => {
        message.error(err);
      });
  }, [caseItem]);

  return (
    <div className="bg-white rounded-xl shadow-sm mt-6">
      <div className="lg:flex xl:flex justify-between relative items-center p-6">
        <div className="relative bg-gray-100 p-1 rounded-lg">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.id
                  ? "text-gray-900 font-medium bg-white"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                <span
                  className={`inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full text-xs ${activeTab === tab.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {tab.id === "all" ? taskData?.length : tab.id === "todo" ? todoTasks?.length : clientTasks?.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex md:flex-row justify-between gap-4 mt-4 lg:mt-0 xl:mt-0">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={showAddModal}
            className="bg-blue-600 hover:bg-blue-700 h-11"
          >
            Add New Task
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between relative w-full p-6 border-t">
        <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-[#1d2838] text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] whitespace-nowrap [font-style:var(--text-md-medium-font-style)]">
            To do{" "}
            <span className={`inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full text-xs bg-gray-200 text-gray-600`}>
              {taskData.length}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between relative gap-x-4">
          <div className="flex p-2.5 w-full bg-white rounded-lg items-center justify-center gap-2 relative overflow-hidden border-0 border-none"
            onClick={() => setIsCopyLinkModalOpen(true)}
          >
            <img
              className="absolute w-[15px] h-[15px] top-[3px] left-[3px]"
              alt="Icon"
              src="https://c.animaapp.com/m8ta5gibWvtvPM/img/icon-14.svg"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.protocol}/${window.location.host}/tasks/${selectedCase?.id}?caseType=intake`);
              }}
            />
          </div>

          <Button
            type="primary"
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send Link
          </Button>
        </div>
      </div>

      <div className="flex flex-col h-fit items-start gap-3 p-6 relative self-stretch w-full bg-white overflow-hidden overflow-y-scroll">
        {(() => {
          const dataToShow = activeTab === 'all'
            ? taskData
            : activeTab === 'todo'
              ? todoTasks
              : clientTasks;
          return dataToShow?.map((item) => {
            item.files = item.files ? (typeof item.files === 'string' ? JSON.parse(item.files) : item.files) : [];
            return (
              <div key={item.id} className="flex items-center gap-5 p-5 w-full relative bg-white rounded-xl border border-solid border-[#e4e7ec] shadow-shadows-shadow-sm">
                <div className="flex items-center gap-4 relative flex-1 grow">
                  <div className="items-start gap-3 flex-1 grow flex relative">
                    <div
                      className={`cursor-pointer ${openQuestions[item.id] ? "hidden" : ""}`}
                      onClick={() => toggleQuestion(item.id)}
                    >
                      <Icons.QuestionIconRIght />
                    </div>
                    <div
                      className={`cursor-pointer ${openQuestions[item.id] ? "" : "hidden"}`}
                      onClick={() => toggleQuestion(item.id)}
                    >
                      <Icons.QuestionDropDown />
                    </div>
                    <div className="flex flex-col items-start justify-center gap-1 relative flex-1 grow">
                      <div className="items-center gap-2.5 self-stretch w-full flex-[0_0_auto] flex relative">
                        <p
                          className="text-question cursor-pointer relative w-fit"
                          onClick={() => toggleQuestion(item.id)}
                        >
                          {item.taskTitle}
                        </p>
                      </div>

                      <div
                        className={`dropdown-content items-center justify-center gap-2.5 self-stretch w-full flex-[0_0_auto] flex relative ${openQuestions[item.id] ? "animate-slideDown" : "hidden"}`}
                      >
                        <p className="relative flex-1 text">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] cursor-pointer rounded-[999px]`}
                  onClick={() => item.files && item.files.length > 0 && window.open(item.files, "_blank")}
                >
                  <div className="relative w-fit status-tag">
                    {item.files?.length > 0 ? <Icons.FileWithImageIcon /> : ""}
                  </div>
                </div>

                <div
                  className={`inline-flex items-center justify-center px-2 py-0.5 relative flex-[0_0_auto] rounded-[999px] ${item.status === "Completed" ? "bg-[#ECFDF3]" : "bg-[#FFFAEB]"}`}
                >
                  <div
                    className={`relative w-fit status-tag ${item.status === "Completed" ? "text-[#039855]" : "text-[#B54708]"}`}
                  >
                    {item.status}
                  </div>
                </div>

                <div
                  className="relative w-6 h-6 cursor-pointer"
                  onClick={() => handleEditTask(item)}
                >
                  <Icons.EditIcon />
                </div>

                <div
                  className="relative w-6 h-6 cursor-pointer"
                  onClick={() => handleDeleteTask(item)}
                >
                  <Icons.DelBoxIcon />
                </div>
              </div>
            );
          });
        })()}
      </div>

      <CustomModal open={isAddModalVisible} onClose={handleAddCancel}>
        <TaskForm
          caseId={caseItem?.id}
          form={addForm}
          onCancel={handleAddCancel}
          onSubmit={handleAddSubmit}
          isEdit={selectedTask}
          initialValues={selectedTask ? selectedTask : null}
        />
      </CustomModal>

      <DeleteTaskModal
        selectedTask={selectedTask}
        open={isDeleteTaskModalVisible}
        onClose={() => setIsDeleteTaskModalVisible(false)}
        onDeleteSuccess={handleDeleteTaskSuccess}
      />

      <CopyLinkModal
        isOpen={isCopyLinkModalOpen}
        onClose={() => setIsCopyLinkModalOpen(false)}
        caseId={caseItem?.id}
      />
    </div>
  );
};
