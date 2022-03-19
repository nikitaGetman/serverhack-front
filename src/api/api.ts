import client from './client';

export function getItems() {
  return client.get('/items');
}

export function searchItem({ search }: { search: string }) {
  return client.get('/item', { params: { search } });
}

export function getSuppliersByItemId({ id }: { id: number }) {
  return client.get('/suppliers', { params: { item: id } });
}
