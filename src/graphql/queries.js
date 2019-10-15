/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChecks = `query GetChecks {
  getChecks {
    id
    meta
    date
    img
  }
}
`;
export const getChecksTable = `query GetChecksTable($id: Int!) {
  getChecksTable(id: $id) {
    id
  }
}
`;
export const listChecksTables = `query ListChecksTables(
  $filter: TableChecksTableFilterInput
  $limit: Int
  $nextToken: String
) {
  listChecksTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
    }
    nextToken
  }
}
`;
