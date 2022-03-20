import client from './client';

export function getItems() {
  return client.get('/items');
}

export function searchItem({ search }: { search: string }) {
  return client.get('/item', { params: { search } });
}

export function getSuppliersByItemId({ id }: { id: number }) {
  return client.get('/suppliers', { params: { item: id } }).then((res) => {
    const suppliers = res.data;

    return {
      data: suppliers.reduce((acc: any, supplier: any) => {
        if (acc.find((s: any) => s.inn === supplier.inn)) return acc;

        return [...acc, supplier];
      }, []),
    };
  });
}

export function getStatistic() {
  return client.get('/statistics');
}
