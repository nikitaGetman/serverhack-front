import { Button, AutoComplete, Cascader, Input } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import './add-item-form.scss';

const renderTitle = (title: string) => <span>{title}</span>;
const renderItem = (title: string, count?: number | null) => ({
  value: title,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {title}
      {count && <span>Поставщиков {count}</span>}
    </div>
  ),
});

type Props = {
  onAdd: (search: string) => void;
  onSelect: (item: any) => void;
  loading?: boolean;
  options: any[];
};
export const AddItemForm: FC<Props> = ({ onAdd, onSelect, options, loading = false }) => {
  const [validOptions, setValidOptions] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const newOptions = options.reduce((acc, category) => {
      const children = category.items.map(({ id, label, activeSuppliers }: any) => ({
        ...renderItem(label, activeSuppliers),
      }));
      const catOption = {
        value: category.title,
        title: category.title,
        label: renderTitle(category.title),
        options: children,
      };

      return [...acc, catOption];
    }, []);

    setValidOptions(newOptions);
  }, [options, setValidOptions]);

  const handleChange = useCallback(
    (select: any) => {
      onSelect(select);
    },
    [onSelect]
  );
  const handleClear = useCallback(() => {
    onSelect('');
  }, [onSelect]);
  const handleSearch = useCallback(
    (value) => {
      setSearch(value);
    },
    [setSearch]
  );
  const handleAdd = useCallback(() => {
    onAdd(search);
  }, [onAdd, search]);
  const notFoundContent = useMemo(
    () => (
      <div className="add-item-form__empty">
        <span className="add-item-form__empty-text">Не найдено</span>
        <Button icon={<PlusOutlined />} onClick={handleAdd} className="add-item-form__button" loading={loading}>
          Добавить номенклатуру
        </Button>
      </div>
    ),
    [handleAdd, loading]
  );

  return (
    <div className="add-item-form">
      <AutoComplete
        className="add-item-form__search"
        dropdownClassName="add-item-form__search-dropdown"
        options={validOptions}
        onClear={handleClear}
        onSelect={handleChange}
        onSearch={handleSearch}
        filterOption={(inputValue, option) => option!.value.toLowerCase().includes(inputValue.toLowerCase())}
        notFoundContent={notFoundContent}
        placeholder="Поиск по названию номенклатуры"
        allowClear
      />
    </div>
  );
};
