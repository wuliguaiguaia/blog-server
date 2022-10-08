import { Client } from '@elastic/elasticsearch';
import * as config from 'config';

const client = new Client({
  node: `${config.get('elasticSearch.host')}:${config.get(
    'elasticSearch.port',
  )}`,
});

const index = 'blog_articles';

const insert = async (body) => {
  return client.index({
    id: body.id,
    index,
    body,
  });
};
const update = async (body) => {
  return client.update({
    id: body.id,
    index,
    body: {
      doc: body,
    },
  });
};
const remove = async ({ id }) => {
  return client.delete({
    id,
    index,
  });
};
const get = async ({ id }) => {
  return client.get({
    id,
    index,
  });
};
interface IPropSearch {
  from?: number;
  size?: number;
  body: any;
}
const search = async ({ from, size, body }: IPropSearch) => {
  if (from || size) {
    return client.search({
      index,
      from,
      size,
      body,
    });
  } else {
    return client.search({
      index,
      body,
    });
  }
};

export default client;
export { insert, update, remove, search, get };
