import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Spin,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { TablePaginationConfig } from 'antd/es/table/interface';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RootState } from '../../store/types';
import {
  fetchPostsRequest,
  fetchPostDetailRequest,
  deletePostRequest,
  clearError,
  clearSelectedPost,
  addPostRequest,
  editPostRequest,
} from '../../store/slices/postsSlice';
import dayjs from 'dayjs';
import styles from './PostsPage.module.css';
import type { Post, PostFormValues } from '../../api/types';
import { fetchAuthorsRequest } from '../../store/slices/authorsSlice';
import { fetchTagsRequest } from '../../store/slices/tagsSlice';

const { Option } = Select;

const PostsPage = () => {
  const dispatch = useDispatch();
  const { posts, loading, pagination, error, selectedPost } = useSelector(
    (state: RootState) => state.posts,
  );
  const { list: authors } = useSelector((state: RootState) => state.authors);
  const { list: tags } = useSelector((state: RootState) => state.tags);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const fileList = useMemo(() => {
    // Если редактируем и есть картинка — показываем её
    if (selectedPost?.previewPicture && editingPostId !== null) {
      return [
        {
          uid: '-1',
          name: selectedPost.previewPicture.name,
          status: 'done' as const,
          url: selectedPost.previewPicture.url,
        },
      ];
    }
    // Иначе показываем то, что загрузил пользователь
    return uploadFiles;
  }, [selectedPost, editingPostId, uploadFiles]);

  useEffect(() => {
    dispatch(fetchPostsRequest({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAuthorsRequest());
    dispatch(fetchTagsRequest());
  }, [dispatch]);

  // Показываем ошибку если есть
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Загружаем детали поста при открытии модалки на редактирование
  useEffect(() => {
    if (editingPostId !== null) {
      dispatch(fetchPostDetailRequest(editingPostId));
    }
  }, [editingPostId, dispatch]);

  // Когда детали загружены — заполняем форму
  useEffect(() => {
    if (selectedPost && editingPostId !== null) {
      console.log('🔥 selectedPost:', selectedPost);
      form.setFieldsValue({
        title: selectedPost.title,
        code: selectedPost.code,
        authorId: selectedPost.author.id,
        tagIds: selectedPost.tags?.map((tag) => tag.id) || [],
        text: selectedPost.text,
      });
    }
  }, [selectedPost, form, editingPostId]);

  const handleAdd = () => {
    setEditingPostId(null);
    dispatch(clearSelectedPost());
    form.resetFields();
    setUploadFiles([]);
    setIsModalVisible(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingPostId(null);
    dispatch(clearSelectedPost());
    form.resetFields();
    setUploadFiles([]);
  };

  const handleFormSubmit = (values: PostFormValues) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('code', values.code);
    formData.append('authorId', String(values.authorId));
    formData.append('text', values.text);

    if (values.tagIds && values.tagIds.length > 0) {
      values.tagIds.forEach((tagId) => {
        formData.append('tagIds[]', String(tagId));
      });
    }

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('previewPicture', fileList[0].originFileObj);
    }

    if (editingPostId) {
      dispatch(
        editPostRequest({
          id: editingPostId,
          data: values,
        }),
      );
    } else {
      dispatch(addPostRequest(formData));
    }

    handleModalCancel();
  };

  const handleDelete = (id: number) => {
    dispatch(deletePostRequest(id));
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    dispatch(
      fetchPostsRequest({
        page: pagination.current || 1,
        limit: pagination.pageSize || 10,
      }),
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Заголовок',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'Автор',
      dataIndex: 'authorName',
      key: 'authorName',
    },
    {
      title: 'Теги',
      dataIndex: 'tagNames',
      key: 'tagNames',
      render: (tagNames: string[]) => tagNames?.join(', ') || '-',
    },
    {
      title: 'Обновлён',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Post) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Ред.
          </Button>
          <Popconfirm
            title="Удалить пост?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Уд.
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && posts.length === 0) {
    return (
      <div className={styles.loaderWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Посты</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить пост
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          dataSource={posts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Всего ${total} постов`,
          }}
          onChange={handleTableChange}
        />
      </div>

      <Modal
        title={editingPostId ? 'Редактировать пост' : 'Добавить пост'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={700}
        className={styles.modalForm}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="title"
            label="Заголовок"
            rules={[{ required: true, message: 'Введите заголовок' }]}
          >
            <Input placeholder="Заголовок поста" />
          </Form.Item>

          <Form.Item name="code" label="Код" rules={[{ required: true, message: 'Введите код' }]}>
            <Input placeholder="Уникальный код" />
          </Form.Item>

          <Form.Item
            name="authorId"
            label="Автор"
            rules={[{ required: true, message: 'Выберите автора' }]}
          >
            <Select placeholder="Выберите автора" loading={!authors.length}>
              {authors.map((author) => (
                <Option key={author.id} value={author.id}>
                  {author.name} {author.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tagIds" label="Теги">
            <Select mode="multiple" placeholder="Выберите теги" loading={!tags.length}>
              {tags.map((tag) => (
                <Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="text"
            label="Текст"
            rules={[{ required: true, message: 'Введите текст' }]}
          >
            <Input.TextArea rows={6} placeholder="Содержание поста" />
          </Form.Item>

          <Form.Item
            name="previewPicture"
            label="Превью"
            rules={[
              {
                required: !editingPostId,
                message: 'Загрузите изображение',
              },
            ]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: newFileList }) => {
                setUploadFiles(newFileList);
              }}
              onRemove={() => {
                setUploadFiles([]);
              }}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div className={styles.uploadText}>Загрузить</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPostId ? 'Сохранить' : 'Создать'}
              </Button>
              <Button onClick={handleModalCancel}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostsPage;
