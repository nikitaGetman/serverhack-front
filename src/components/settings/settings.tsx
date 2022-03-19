import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { Space, Button, Collapse, Form, Modal, Checkbox, Input, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './settings.scss';

const { Panel } = Collapse;

type Props = {
  visible?: boolean;
  search?: string;
  onClose?: () => void;
  onSubmit?: (search: string) => void;
};
export const SettingsModal: FC<Props> = memo(({ search, visible, onClose, onSubmit }) => {
  const [_search, setSearch] = useState(search);
  const handleInput = (e: any) => setSearch(e.target.value);
  useEffect(() => {
    setSearch(search);
  }, [search, setSearch]);

  const handleSave = () => {
    if (!_search) return;
    onSubmit && onSubmit(_search);
    handleClose();
  };
  const handleReset = () => {
    onClose && onClose();
  };
  const handleClose = () => {
    onClose && onClose();
  };

  const searchModule = useMemo(
    () => (
      <>
        <Form.Item label="Адрес объекта" tooltip="Искать поставщиков для объекта по адресу" wrapperCol={{ span: 10 }}>
          <Input />
        </Form.Item>
        <Form.Item label="Мин. количество поставщиков" tooltip="Влияет на скорость поиска" labelCol={{ span: 17 }}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="Мин. количество «надёжных» поставщиков"
          tooltip="Влияет на скорость поиска"
          labelCol={{ span: 17 }}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item valuePropName="checked">
          <Checkbox>Искать только действующих поставщиков</Checkbox>
        </Form.Item>
        <Form.Item valuePropName="checked" className="settings__checkbox">
          <Checkbox>Искать только производителей</Checkbox>
        </Form.Item>
      </>
    ),
    []
  );
  const scoringModule = useMemo(
    () => (
      <>
        <Form.Item label="Уставной капитал, не менее" labelCol={{ span: 12 }}>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Лет работы, не менее" labelCol={{ span: 12 }}>
          <InputNumber min={0} />
        </Form.Item>
      </>
    ),
    []
  );

  return (
    <Modal title="Настройки поиска поставщиков" visible={visible} onCancel={handleClose} footer={null}>
      <Form onFinish={handleSave} layout="horizontal" labelWrap size="small" labelAlign="left" requiredMark={false}>
        <Form.Item label="Номенклатура" name="search" required>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input placeholder="Номенклатура для поиска" name="search" value={_search} onInput={handleInput} />
            <Upload accept=".xsl,.xlsx,.csv">
              или <Button icon={<UploadOutlined />}>Загрузить в формате xls, csv</Button>
            </Upload>
          </Space>
        </Form.Item>

        <Collapse ghost className="settings" expandIconPosition="left" defaultActiveKey={['1', '2']}>
          <Panel header="Модуль поиска" key="1">
            {searchModule}
          </Panel>
          <Panel header="Модуль скоринга «надёжного» поставщика" key="2">
            {scoringModule}
          </Panel>
          {/* <Panel header="Технические настройки" key="3"></Panel> */}
        </Collapse>

        <Form.Item noStyle>
          <Space className="settings__footer">
            <Button size="middle" onClick={handleReset} type="ghost" htmlType="reset">
              Сбросить
            </Button>
            <Button size="middle" type="primary" htmlType="submit">
              Добавить
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
});
