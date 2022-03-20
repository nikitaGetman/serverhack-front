import { Card, Col, Divider, Modal, Row, Space, Statistic as StatisticBlock, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, useState } from 'react';
import { getStatistic } from '../../api/api';
import useFetch from '../../hooks/useFetch';
import { PieChart } from 'react-minimal-pie-chart';

import './statistic.scss';

type Props = {
  visible: boolean;
  onCLose: () => void;
};
export const Statistic: FC<Props> = ({ visible, onCLose }) => {
  const statRequest = useFetch(getStatistic);
  const [statData, setStatData] = useState<any>({});

  useEffect(() => {
    if (visible)
      statRequest.fetch().then((res) => {
        console.log(res);
        setStatData(res);
      });
    // eslint-disable-next-line
  }, [visible]);

  const columns: ColumnsType<any> = [
    {
      title: 'Категория',
      dataIndex: 'title',
    },
    {
      title: 'Надежных поставщиков',
      dataIndex: 'suppliers',
      width: '10%',
      align: 'center',
    },
  ];

  const data = [
    { key: 1, title: 'Болты', suppliers: 1 },
    { key: 2, title: 'Манжеты', suppliers: 3 },
  ];

  return (
    <Modal
      title="Статистика по всем категориям"
      visible={visible}
      onCancel={onCLose}
      footer={null}
      width={'50vw'}
      className="statistic"
    >
      <Space direction="vertical" size={12}>
        <Row gutter={12}>
          <Col span={12}>
            <Card>
              <StatisticBlock
                title="Номенклатурных позиций в базе"
                loading={statRequest.isLoading}
                value={statData?.items_count || '-'}
                valueStyle={{ color: '#389e0d' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <StatisticBlock
                title="Найдено URL по номенклатурам"
                loading={statRequest.isLoading}
                value={statData?.urls_count || '-'}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Card>
              <StatisticBlock
                title="Сайтов поставщиков"
                loading={statRequest.isLoading}
                value={statData?.direct_suppliers || '-'}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <StatisticBlock
                title="Площадок / маркетплейсов"
                loading={statRequest.isLoading}
                value={statData?.markeplaces || '-'}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <StatisticBlock
                title="Нерелевантных сайтов"
                loading={statRequest.isLoading}
                value={statData?.trash_urls || '-'}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Card>
              <StatisticBlock
                title="Поставщиков найдено"
                loading={statRequest.isLoading}
                value={statData?.suppliers || '-'}
                valueStyle={{ color: '#389e0d' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <StatisticBlock
                title="Надежных поставщиков"
                loading={statRequest.isLoading}
                value={statData?.suppliers_active || '-'}
                valueStyle={{ color: '#389e0d' }}
              />
            </Card>
          </Col>
        </Row>

        <div className="statistic__chart">
          <PieChart
            data={[
              { title: 'Активных поставщиков', value: statData?.suppliers_active || 0, color: '#E38627' },
              {
                title: 'В процессе ликвидации / ликвидированные',
                value: statData?.suppliers - statData?.suppliers_active || 0,
                color: '#C13C37',
              },
            ]}
          />

          <div>
            <div className="statistic__chart-legend">
              <div className="statistic__round" style={{ backgroundColor: '#E38627' }}></div>Активных поставщиков
            </div>
            <div className="statistic__chart-legend">
              <div className="statistic__round" style={{ backgroundColor: '#C13C37' }}></div>В процессе ликвидации /
              ликвидированные
            </div>
          </div>
        </div>

        <div className="statistic__table-header">Категории с низкой долей «надёжных» поставщиков</div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ position: [] }}
          bordered
          loading={statRequest.isLoading}
        />
      </Space>
    </Modal>
  );
};
