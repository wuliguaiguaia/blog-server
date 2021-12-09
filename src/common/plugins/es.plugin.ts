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
const search = async ({ from, size, words, sort }) => {
  return await client.search({
    index,
    type,
    from,
    size,
    body: {
      sort,
      query: {
        bool: {
          must: { match: { deleted: 0 } },
          should: [
            {
              match: {
                title: words,
              },
            },
            // {
            //   match: {
            //     'content?.content': words,
            //   },
            // },
          ],
        },
        // match: {
        //   title: {
        //     query: words,
        //     // operator: 'and' /* 提高精度 */,
        //     minimum_should_match: '30%' /* 控制精度 */,
        //   },
        //   // content: words,
        // },
      },
      highlight: {
        fields: {
          // title: { type: 'plain' },
        },
      },
      // 'content.content': 'words',
    },
  });
};

export default client;
export { insert, update, remove, search, get };
