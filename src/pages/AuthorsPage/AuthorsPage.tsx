import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Space, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RootState } from '../../store';
import {
  fetchAuthorsRequest,
  addAuthorRequest,
  editAuthorRequest,
  deleteAuthorRequest,
} from '../../store/slices/authorsSlice';
import type { Author, AuthorFormData } from '../../api/types';
import styles from './AuthorsPage.module.css';

const AuthorsPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state: RootState) => state.authors);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAuthorsRequest());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingAuthor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    form.setFieldsValue({
      name: author.name,
      lastName: author.lastName,
      secondName: author.secondName,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteAuthorRequest(id));
  };

  const handleSubmit = (values: AuthorFormData) => {
    if (editingAuthor) {
      dispatch(
        editAuthorRequest({
          id: editingAuthor.id,
          data: values,
        }),
      );
    } else {
      dispatch(addAuthorRequest(values));
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingAuthor(null);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Фамилия', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Отчество', dataIndex: 'secondName', key: 'secondName' },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_text: unknown, record: Author) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Ред.
          </Button>
          <Popconfirm title="Удалить автора?" onConfirm={() => handleDelete(record.id)}>
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
        <h2>Авторы</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить автора
        </Button>
      </div>

      <Table dataSource={list} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={editingAuthor ? 'Редактировать автора' : 'Добавить автора'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingAuthor(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Фамилия"
            rules={[{ required: true, message: 'Введите фамилию' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="secondName" label="Отчество">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingAuthor ? 'Сохранить' : 'Создать'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthorsPage;
