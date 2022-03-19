import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { getItems, getSuppliersByItemId, searchItem } from '../../api/api';
import useFetch from '../../hooks/useFetch';

import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
// import { DownOutlined } from '@ant-design/icons';
import { SettingOutlined, DownloadOutlined } from '@ant-design/icons';

import './dashboard.scss';
import { AddItemForm } from '../../components/add-item-form/add-item-form';
import { SuppliersList } from '../../components/suppliers-list/suppliers-list';
import { SettingsModal } from '../../components/settings/settings';

const empty = <span className="dashboard__empty-cell">В обработке...</span>;
const columns: ColumnsType<any> = [
  {
    title: 'Категория',
    dataIndex: 'category',
    key: 'category',
    width: '18%',
    className: 'dashboard__column--bold',
  },
  {
    title: 'Номенклатура',
    dataIndex: 'label',
    key: 'label',
    className: 'dashboard__column--bold',
  },
  {
    title: 'Активных поставщиков',
    dataIndex: 'activeSuppliers',
    key: 'activeSuppliers',
    width: '12%',
    align: 'right',
    className: 'dashboard__column--bold',
    render: (sup, record) => record.label && (sup ?? empty),
  },
  {
    title: 'Надежных поставщиков',
    dataIndex: 'reliableSuppliers',
    key: 'reliableSuppliers',
    width: '12%',
    align: 'right',
    className: 'dashboard__column--bold',
    render: (sup, record) => record.label && (sup ?? empty),
  },
  {
    title: 'Поставщиков без проверки',
    dataIndex: 'unverifiedSuppliers',
    key: 'unverifiedSuppliers',
    width: '12%',
    align: 'right',
    render: (sup, record) => record.label && (sup ?? empty),
  },
  {
    title: 'Ненадежных поставщиков',
    dataIndex: 'unreliableSupplier',
    key: 'unreliableSupplier',
    width: '12%',
    align: 'right',
    render: (sup, record) => record.label && (sup ?? empty),
  },
];

function download(filename: string, text: string = '') {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export const DashboardPage: FC = () => {
  const fetchItemsRequest = useFetch(getItems);
  const searchItemRequest = useFetch(searchItem);
  const fetchSuppliersRequest = useFetch(getSuppliersByItemId);

  const [rawData, setRawData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isSuppliersListVisible, setIsSuppliersListVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const formatItemsResponse = useCallback(
    (response) => {
      if (!response || !response.categories) {
        setData([]);
        setRawData([]);
        return;
      }

      const { categories } = response;

      const dataItems = categories.reduce((acc: any, category: any) => {
        const categoryItems = category.items.map((item: any) => ({ ...item, key: item.id, category: category.title }));
        const categoryRowItem = {
          key: `${category.id}-category`,
          label: '',
          category: category.title,
          children: categoryItems,
        };

        acc.push(categoryRowItem);
        return acc;
      }, []);

      setRawData(categories);
      setData(dataItems);
    },
    [setData, setRawData]
  );

  useEffect(() => {
    fetchItemsRequest.fetch().then(formatItemsResponse);
    // eslint-disable-next-line
  }, []);

  const handleRowItemClick = useCallback(
    (id: any) => {
      setIsSuppliersListVisible(true);
      fetchSuppliersRequest.fetch({ id }).then((res) => {
        setSuppliers(res);
      });
    },
    [setSuppliers, fetchSuppliersRequest]
  );
  const handleSuppliersListClose = useCallback(() => {
    setIsSuppliersListVisible(false);
  }, [setIsSuppliersListVisible]);

  const handleAddItemSubmit = useCallback(
    (search: string) => {
      if (!search) return;

      searchItemRequest.fetch({ search }).then((res) => {
        formatItemsResponse(res);
      });
    },
    [searchItemRequest, formatItemsResponse]
  );
  const handleItemSelect = useCallback(
    (item) => {
      setSelectedItem(item || '');
    },
    [setSelectedItem]
  );
  const openSettingsModal = useCallback(() => {
    setIsSettingsVisible(true);
  }, [setIsSettingsVisible]);
  const handleSettingsModalClose = useCallback(() => {
    setIsSettingsVisible(false);
  }, [setIsSettingsVisible]);

  const filteredData = useMemo(() => {
    if (!selectedItem) return data;

    const item = data.find(({ children }: any) => children.find(({ label }: any) => label === selectedItem));
    return [item];
  }, [selectedItem, data]);

  const handleAddItem = useCallback(
    (search: string) => {
      setSearch(search);
      openSettingsModal();
    },
    [setSearch, openSettingsModal]
  );

  const onSelectChange = useCallback(
    (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    [setSelectedRowKeys]
  );
  const downloadSuppliers = useCallback(() => {
    download('data.xlsx');
  }, []);

  const footer = useCallback(
    () => (
      <Space>
        <div>Выгрузить данные по поставщикам</div>
        <Button size="middle" type="primary" icon={<DownloadOutlined />} onClick={downloadSuppliers}>
          Загрузить
        </Button>
      </Space>
    ),
    [downloadSuppliers]
  );

  return (
    <div className="dashboard">
      <div className="dashboard__form-wrapper">
        <AddItemForm
          onAdd={handleAddItem}
          onSelect={handleItemSelect}
          options={rawData}
          loading={searchItemRequest.isLoading}
        />
        <Button
          className="dashboard__settings-button"
          type="primary"
          icon={<SettingOutlined />}
          onClick={openSettingsModal}
        >
          Настройки
        </Button>
      </div>
      <SettingsModal
        visible={isSettingsVisible}
        onClose={handleSettingsModalClose}
        onSubmit={handleAddItemSubmit}
        search={search}
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ position: [] }}
        scroll={{ y: '75vh' }}
        bordered
        size="small"
        loading={fetchItemsRequest.isLoading || searchItemRequest.isLoading}
        rowClassName={(record) => (!record.label ? 'dashboard__row--category' : '')}
        onRow={(record, rowIndex) => ({
          onClick: () => {
            if (record.label) {
              handleRowItemClick(record.id);
            }
          },
        })}
        expandable={{
          defaultExpandAllRows: true,
          showExpandColumn: true,
          expandRowByClick: true,
          rowExpandable: (record) => !record.label,
        }}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange, checkStrictly: false }}
        footer={selectedRowKeys.length ? footer : undefined}
        className="dashboard__table"
      />

      <SuppliersList
        visible={isSuppliersListVisible}
        onClose={handleSuppliersListClose}
        suppliers={suppliers}
        loading={fetchSuppliersRequest.isLoading}
      />
    </div>
  );
};
