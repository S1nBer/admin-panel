import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginRequest, clearError } from '../../store/slices/authSlice';
import type { RootState } from '../../store/types';
import { useHistory } from 'react-router-dom';
import styles from './LoginPage.module.css';

const { Title } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }, [isAuthenticated, history]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onFinish = (values: { email: string; password: string }) => {
    dispatch(loginRequest(values));
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={2} className={styles.cardTitle}>
          Админ-панель
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className={styles.alert}
            onClose={handleCloseError}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{
            email: 'test@test.ru',
            password: 'khro2ij3n2730',
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.submitButton}
              block
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
