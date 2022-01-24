import { Client } from '@elastic/elasticsearch';
import * as config from 'config';

const client = new Client({
  node: `${config.get('elasticSearch.host')}:${config.get(
    'elasticSearch.port',
  )}`,
});

const index = 'blog_articles';
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
interface IPropSearch {
  from?: number;
  size?: number;
  body: any;
}
const search = async ({ from, size, body }: IPropSearch) => {
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
