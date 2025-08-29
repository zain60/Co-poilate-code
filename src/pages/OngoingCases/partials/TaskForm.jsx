import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addTaskToCase, editTask } from "../../../services/cases";
import { message } from "antd";
const { TextArea } = Input;
const { Option } = Select;

export const TaskForm = ({
  caseId,
  form,
  initialValues,
  isEdit = false,
  onCancel,
  onSubmit,
}) => {
  const [fileList, setFileList] = useState([]);
  const [markedForDeletion, setMarkedForDeletion] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form and file states
  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setMarkedForDeletion({});
  };

  useEffect(() => {
    if ((!isEdit)) form.resetFields();
  }, [])

  const taskId = isEdit ? initialValues?.id : null;

  useEffect(() => {
    if (isEdit && initialValues) {
      form.setFieldsValue({
        taskTitle: initialValues.taskTitle || '',
        status: initialValues.status || 'Pending',
        description: initialValues.description || '',
      });

      const files = initialValues.files || [];
      const filesArray = Array.isArray(files) ? files : [files];

      const formattedFiles = filesArray
        .filter(file => file)
        .map(file => ({
          uid: file.uid || `file-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name || 'file',
          status: 'done',
          url: file.url || file,
          thumbUrl: file.url || file,
          type: file.type || 'image/png',
          ...file
        }));

      setFileList(formattedFiles);
    } else {
      form.resetFields();
      setFileList([]);
    }
    return () => {
      form.resetFields();
      setFileList([]);
    };
  }, [isEdit, initialValues, form]);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemove = (file) => {
    setMarkedForDeletion(prev => ({
      ...prev,
      [file.uid]: !prev[file.uid] // Toggle deletion mark
    }));
    return false; // Prevent default remove behavior
  };

  const handlePreview = async (file) => {
    if (file.url || file.preview) {
      window.open(file.url || file.preview, '_blank');
    } else if (file.originFileObj) {
      try {
        const preview = await getBase64(file.originFileObj);
        window.open(preview, '_blank');
      } catch (error) {
        console.error('Error generating preview:', error);
        message.error('Could not preview file');
      }
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Process files for submission
      const newFiles = [];

      // Process each file in the fileList, excluding those marked for deletion
      for (const file of fileList) {
        if (markedForDeletion[file.uid]) continue; // Skip files marked for deletion

        if (file.originFileObj) {
          // This is a newly uploaded file
          const base64 = await convertFileToBase64(file.originFileObj);
          newFiles.push({
            name: file.name,
            url: base64,
            type: file.type
          });
        } else if (file.url) {
          // This is an existing file
          newFiles.push({
            name: file.name || 'file',
            url: file.url,
            type: file.type
          });
        }
      }

      const payload = {
        taskTitle: values.taskTitle,
        status: values.status,
        description: values.description,
        caseId: caseId,
        files: newFiles,
      };

      await handleAddSubmit(payload);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const statusOptions = [
    { value: "In Progress", label: "In Progress" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
  ];

  const handleAddSubmit = async (values) => {
    try {
      if (!isEdit) {
        const response = await addTaskToCase(values);
        message.success(response?.message || "Task created successfully");
        if (onSubmit) {
          onSubmit(response?.task);
        }
      } else {
        const response = await editTask(values, taskId);
        message.success(response?.message || "Task updated successfully");
        if (onSubmit) {
          onSubmit(response?.task);
        }
      }

      // Reset form after successful submission
      resetForm();

    } catch (err) {
      message.error(err?.message || "Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const getFilteredFileList = () => {
    return fileList.filter(file => !markedForDeletion[file.uid]);
  };

  return (
    <>
      <style>{`
        .ant-modal-content {
          border-radius: 24px !important;
          width: 120%;
          margin: 0 auto;
        }
      `}</style>
      <div className="pb-7">
        <h6 className="font-600 text-blue-39">{isEdit ? "Edit Task" : "Add a new task"}</h6>
        <p className="fs-14 fw-400 text-blue-85 mt-2">
          Effortlessly manage your to-do list: {isEdit ? "Edit the task details" : "add a new task."}
        </p>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className="task-form edit-personal-info-form gap-y-3 flex flex-col"
        requiredMark={false}
      >
        <Form.Item
          name="taskTitle"
          label="Task Title"
          rules={[{ required: true, message: "Please enter task title" }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            {statusOptions.map((option) => {
              let dotColor = "#2563EB"; // In Progress (darker blue)
              if (option.value === "Pending") dotColor = "#F59E42"; // Darker orange
              if (option.value === "Completed") dotColor = "#16A34A"; // Darker green
              return (
                <Option key={option.value} value={option.value}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: dotColor,
                        marginRight: 12,
                      }}
                    />
                    <span>{option.label}</span>
                  </span>
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item name="description" label="Description">
          <TextArea
            placeholder="Enter task description"
            rows={8}
            className="!rounded-xl !border !border-[#D1D5DB] !bg-white !p-4 !text-base !shadow-none"
            style={{ minHeight: '180px', resize: 'vertical' }}
          />
        </Form.Item>

        {/* Files */}
        <div className="mb-6 bg-[#F9FAFB] border border-[#F2F4F7] rounded-lg p-4">
          <label className="block text-[18px] font-medium text-gray-700 mb-2">
            Files
          </label>
          <Upload
            multiple={true}
            fileList={getFilteredFileList().map(file => ({
              ...file,
              className: markedForDeletion[file.uid] ? 'deleting' : ''
            }))}
            onRemove={handleRemove}
            onPreview={handlePreview}
            itemRender={(originNode, file) => {
              return (
                <div className={markedForDeletion[file.uid] ? 'deleting' : ''}>
                  {originNode}
                  {markedForDeletion[file.uid] && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '8px'
                    }}>
                      Will be deleted
                    </div>
                  )}
                </div>
              );
            }}
            onChange={({ fileList: newFileList }) => {
              // Get the current file list without marked for deletion
              const currentFiles = fileList.filter(f => !markedForDeletion[f.uid]);

              // Find newly added files
              const newFiles = newFileList.filter(
                newFile => !currentFiles.some(f => f.uid === newFile.uid)
              );

              // Add new files to the file list
              const updatedFileList = [
                ...currentFiles,
                ...newFiles.map(file => ({
                  ...file,
                  uid: file.uid || `file-${Math.random().toString(36).substr(2, 9)}`,
                }))
              ];

              setFileList(updatedFileList);
            }}
            beforeUpload={() => false}
            listType="picture-card"
            className="file-upload"
            accept="image/*,.pdf,.doc,.docx"
          >
            {fileList?.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Add File</div>
              </div>
            )}
          </Upload>
          <style jsx global>{`
            .ant-upload-list-picture-card .ant-upload-list-item {
              border: 1px solid #d9d9d9;
              border-radius: 8px;
              position: relative;
              transition: opacity 0.3s;
            }
            .ant-upload-list-picture-card .ant-upload-list-item.deleting {
              opacity: 0.5;
              border: 1px dashed #ff4d4f;
            }
            .ant-upload-list-picture-card .ant-upload-list-item-thumbnail,
            .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
              object-fit: contain !important;
            }
            .ant-upload-list-picture-card .ant-upload-list-item-actions .anticon-eye,
            .ant-upload-list-picture-card .ant-upload-list-item-actions .anticon-delete {
              color: rgba(255, 255, 255, 0.85);
              font-size: 16px;
            }
            .ant-upload-list-picture-card .ant-upload-list-item-actions .anticon-eye:hover,
            .ant-upload-list-picture-card .ant-upload-list-item-actions .anticon-delete:hover {
              color: #fff;
            }
          `}</style>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between gap-4">
          <Button size="large" className="w-full" onClick={onCancel}>
            {isEdit ? "Close" : "Cancel"}
          </Button>
          <Button
            type="primary"
            size="large"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {isEdit ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </Form>
    </>
  );
};
