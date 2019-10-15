/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const uploadCheck = `mutation UploadCheck($meta: String, $date: String!, $img: String!) {
  uploadCheck(meta: $meta, date: $date, img: $img) {
    id
    meta
    date
    img
  }
}
`;
export const createChecksTable = `mutation CreateChecksTable($input: CreateChecksTableInput!) {
  createChecksTable(input: $input) {
    id
  }
}
`;
export const updateChecksTable = `mutation UpdateChecksTable($input: UpdateChecksTableInput!) {
  updateChecksTable(input: $input) {
    id
  }
}
`;
export const deleteChecksTable = `mutation DeleteChecksTable($input: DeleteChecksTableInput!) {
  deleteChecksTable(input: $input) {
    id
  }
}
`;
