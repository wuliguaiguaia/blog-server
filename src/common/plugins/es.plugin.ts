import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://localhost:9200' });

const index = 'articles3';
const type = 'alias_doc';

const insert = async (body) => {
  return await client.index({
    id: body.id,
    index,
    type,
    body,
  });
};
const update = async (body) => {
  console.log(body.id);

  return await client.update({
    id: body.id,
    index,
    type,
    body: {
      doc: body,
    },
  });
};
const remove = async ({ id }) => {
  return await client.delete({
    id,
    index,
    type,
  });
};
const get = async ({ id }) => {
  return await client.get({
    id,
    index,
    type,
  });
};
const search = async ({ from, size, body /* sort */ }) => {
  return await client.search({
    index,
    type,
    from,
    size,
    body,
  });
};

export default client;
export { insert, update, remove, search, get };
