import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { getTaskbyCaseId, submitTaskResponse } from '../../services/cases';

const PublicTaskForm = () => {
  const { caseId } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const caseType = queryParams.get('caseType');

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskbyCaseId(caseId);
        setQuestions(response);
      } catch (error) {
        message.error(error.message || 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      fetchTask();
    } else {
      setLoading(false);
    }
  }, [caseId]);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      // Map through the questions and prepare answers
      const answers = questions.map((question, index) => ({
        ...question,
        answer: values[`answer_${index}`] || '',
      }));

      const res = {
        caseId: caseId,
        answers,
      }
      await submitTaskResponse(res, caseType);

      message.success('Response submitted successfully!');
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Questions Not Found</h2>
          <p>The requested questions could not be found or is no longer available.</p>
          <Button type="primary" onClick={() => navigate('/')} className="mt-4">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-6 space-y-6"
          >
            {questions?.map((question, index) => (
              <div key={question.id || index} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{question.taskTitle}</h3>
                {question.description && (
                  <p className="text-gray-600 mb-4">{question.description}</p>
                )}
                <Form.Item
                  name={`answer_${index}`}
                  label="Your Answer"
                  rules={[
                    { message: 'This field is required' },
                  ]}
                  className="mb-0"
                >
                  <Input
                    placeholder="Type your answer here..."
                    className="w-full"
                  />
                </Form.Item>
              </div>
            ))}

            <div className="flex justify-end space-x-4 mt-8">
              <Button
                type="default"
                onClick={() => window.history.back()}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default PublicTaskForm;

