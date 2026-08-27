import { useHistory } from 'react-router-dom';
import { Card, Row, Col, Typography } from 'antd';
import { FileTextOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import styles from './DashboardPage.module.css';

interface DashboardCard {
  title: string;
  icon: React.ReactNode;
  description: string;
  path: string;
  cardClass: string;
}

const { Title } = Typography;

const DashboardPage = () => {
  const history = useHistory();

  const cards: DashboardCard[] = [
    {
      title: 'Посты',
      icon: <FileTextOutlined className={styles.cardIcon} />,
      description: 'Управление постами',
      path: '/posts',
      cardClass: styles.cardPosts,
    },
    {
      title: 'Авторы',
      icon: <UserOutlined className={styles.cardIcon} />,
      description: 'Управление авторами',
      path: '/authors',
      cardClass: styles.cardAuthors,
    },
    {
      title: 'Теги',
      icon: <TagOutlined className={styles.cardIcon} />,
      description: 'Управление тегами',
      path: '/tags',
      cardClass: styles.cardTags,
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>
        Админ-панель
      </Title>

      <Row gutter={[24, 24]} className={styles.grid}>
        {cards.map((card) => (
          <Col key={card.path} xs={24} sm={12} md={8}>
            <Card
              hoverable
              className={`${styles.card} ${card.cardClass}`}
              onClick={() => history.push(card.path)}
            >
              <div className={styles.cardBody}>
                <div className={styles.cardIcon}>{card.icon}</div>
                <Title level={3} className={styles.cardTitle}>
                  {card.title}
                </Title>
                <div className={styles.cardDescription}>{card.description}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardPage;
