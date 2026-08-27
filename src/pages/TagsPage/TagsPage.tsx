import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RootState } from '../../store';
import {
  fetchTagsRequest,
  addTagRequest,
  deleteTagRequest,
  editTagRequest,
} from '../../store/slices/tagsSlice';
import type { Tag } from '../../api/types';
import styles from './TagsPage.module.css';

const TagsPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state: RootState) => state.tags);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchTagsRequest());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    form.setFieldsValue(tag);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTagRequest(id));
  };

  const handleSubmit = (values: { name: string }) => {
    if (editingTag) {
      dispatch(
        editTagRequest({
          id: editingTag.id,
          data: values,
        }),
      );
    } else {
      dispatch(addTagRequest(values));
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingTag(null);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Tag) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Ред.
          </Button>
          <Popconfirm title="Удалить тег?" onConfirm={() => handleDelete(record.id)}>
            <Button danger size="small" icon={<DeleteOutlined />}>
              Уд.
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Теги</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить тег
        </Button>
      </div>

      <Table dataSource={list} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={editingTag ? 'Редактировать тег' : 'Добавить тег'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingTag(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingTag ? 'Сохранить' : 'Создать'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagsPage;
