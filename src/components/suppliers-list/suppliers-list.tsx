import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { Checkbox, Drawer, Empty, Select, Space, Spin } from 'antd';
import './suppliers-list.scss';

const { Option } = Select;

type Props = {
  visible: boolean;
  onClose: () => void;
  suppliers?: any;
  loading?: boolean;
};
export const SuppliersList: FC<Props> = memo(({ onClose, visible, suppliers, loading }) => {
  const [filter, setFilter] = useState('');
  const [type, setType] = useState('');
  const filteredSuppliers = useMemo(() => {
    if (!filter && !type) return suppliers;

    return suppliers;
  }, [suppliers, filter, type]);

  const handleChangeFIlter = useCallback(
    (value) => {
      setFilter(value);
    },
    [setFilter]
  );
  const handleTypeChange = useCallback(
    (e) => {
      setType(e.target.checked ? 'direct' : '');
    },
    [setType]
  );

  return (
    <Drawer title="Поставщики" placement="right" onClose={onClose} visible={visible} width="30vw">
      {loading && <Spin />}
      {!suppliers.length && !loading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

      <div className="suppliers-list__filter">
        <div className="suppliers-list__row">
          <Select placeholder="Учредитель.." className="suppliers-list__select" allowClear>
            <Option value="rus">Российский</Option>
            <Option value="out">Зарубежный</Option>
          </Select>

          <Select
            onChange={handleChangeFIlter}
            placeholder="Сортировать по.."
            className="suppliers-list__select"
            allowClear
          >
            <Option value="reliability">Сперва надежные</Option>
          </Select>
        </div>

        <Checkbox onChange={handleTypeChange}>Только прямые поставщики</Checkbox>
      </div>

      {filteredSuppliers.map((supplier: any, index: number) => (
        <SupplierCard {...supplier} key={index} />
      ))}
    </Drawer>
  );
});

const SupplierCard: FC = ({ name, inn, contacts, status, capitalization, created_at, debet, credit }: any) => {
  return (
    <div className="supplier">
      {name && (
        <div className="supplier__row">
          <div className="supplier__value supplier__name">{name}</div>
        </div>
      )}
      {inn && (
        <div className="supplier__row">
          <div className="supplier__label">ИНН:</div>
          <div className="supplier__value">{inn}</div>
        </div>
      )}

      <div className="supplier__row">
        <div className="supplier__label">Контакты:</div>
        <div className="supplier__value">{contacts || '-'}</div>
      </div>

      {status && (
        <div className="supplier__row">
          <div className="supplier__label">Статус:</div>
          <div className="supplier__value">{status}</div>
        </div>
      )}
      {capitalization && (
        <div className="supplier__row">
          <div className="supplier__label">Капитализация:</div>
          <div className="supplier__value">{capitalization}</div>
        </div>
      )}
      {created_at && (
        <div className="supplier__row">
          <div className="supplier__label">Дата создания:</div>
          <div className="supplier__value">{created_at}</div>
        </div>
      )}
      {debet && (
        <div className="supplier__row">
          <div className="supplier__label">Дебиторская задолженность:</div>
          <div className="supplier__value">{debet}</div>
        </div>
      )}
      {credit && (
        <div className="supplier__row">
          <div className="supplier__label">Кредиторская задолженность:</div>
          <div className="supplier__value">{credit}</div>
        </div>
      )}
    </div>
  );
};
