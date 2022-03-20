import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { Button, Checkbox, Drawer, Empty, Select, Space, Spin, Tag } from 'antd';
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

  const uniqueSuppliers = useMemo(() => {
    return suppliers.reduce((acc: any, supplier: any) => {
      if (acc.find((s: any) => s.inn === supplier.inn)) return acc;

      return [...acc, supplier];
    }, []);
  }, [suppliers]);
  const filteredSuppliers = useMemo(() => {
    if (!filter && !type) return uniqueSuppliers;

    return uniqueSuppliers;
  }, [uniqueSuppliers, filter, type]);

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

      {!loading && (
        <>
          {!suppliers.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

          {filteredSuppliers.map((supplier: any, index: number) => (
            <SupplierCard {...supplier} key={index} />
          ))}
        </>
      )}
    </Drawer>
  );
});

const SupplierCard: FC = ({ name, inn, contacts, status, capitalization, created_at, debet, credit, ...rest }: any) => {
  const date = useMemo(() => new Date(parseInt(created_at)).toLocaleDateString(), [created_at]);

  console.log(rest);

  const getReviews = useCallback(() => {
    const query = `${name} ИНН ${inn} отзывы`;
    window.open(`https://yandex.ru/search/?text=${query}`, '_blank');
    // eslint-disable-next-line
  }, []);

  return (
    <div className="supplier">
      <div className="supplier__status">
        {status === 'ACTIVE' && <Tag color="green">Действующая</Tag>}
        {status === 'LIQUIDATING' && <Tag color="volcano">Ликвидируется</Tag>}
        {status === 'LIQUIDATED' && <Tag color="volcano">Ликвидирована</Tag>}
        {status === 'BANKRUPT' && <Tag color="volcano">Банкротство</Tag>}
        {status === 'REORGANIZING' && <Tag color="volcano">Реорганизация</Tag>}
      </div>

      {name && <div className="supplier__name">{name}</div>}
      {inn && (
        <div className="supplier__row">
          <div className="supplier__label">ИНН:</div>
          <div className="supplier__value">{inn}</div>
        </div>
      )}

      {created_at && (
        <div className="supplier__row">
          <div className="supplier__label">Дата создания:</div>
          <div className="supplier__value">{date}</div>
        </div>
      )}

      {contacts && (
        <div className="supplier__row">
          <div className="supplier__label">Контакты:</div>
          <div className="supplier__value">{contacts}</div>
        </div>
      )}

      {capitalization && (
        <div className="supplier__row">
          <div className="supplier__label">Капитализация:</div>
          <div className="supplier__value">{capitalization}</div>
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

      <Button type="link" size="small" onClick={getReviews} className="supplier__reviews">
        Смотреть отзывы
      </Button>
    </div>
  );
};
