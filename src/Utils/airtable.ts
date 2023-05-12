import Airtable, { FieldSet } from "airtable";
import { SortParameter } from "airtable/lib/query_params";
import axios from "axios";

export const nutLogAccessToken =
  "patMllvb955vW5dNU.6fb1ff3518c4d356e34c5a0d3a5351055c1d3cebcc506bb7e24cc66a7d70bc88";
export const apikey = "keyRwwLZXvBXBhvqN";
export const nutLogBaseId = "appHShpQYSOMxhvPQ";

export const getRecords = (
  tableName: string,
  options?: {
    sort?: SortParameter<FieldSet>[];
  }
) => {
  const base = new Airtable({ apiKey: apikey }).base(nutLogBaseId);
  return base(tableName)
    .select({
      view: "Grid view",
      ...options,
    })
    .all();
};

export type CreateRecordPayload = {
  googleUserId: string;
  googleUserName: string;
  airtableTableId: string;
  googleUserEmail: string;
};

export const createRecord = (
  tableName: string,
  payload: CreateRecordPayload | Record<string, any>
) => {
  const base = new Airtable({ apiKey: apikey }).base(nutLogBaseId);
  return base(tableName).create([
    {
      fields: payload,
    },
  ]);
};

export type CreateTablePayload = {
  baseId?: string;
  tableData: {
    name: string;
    description?: string;
    fields: {
      description?: string;
      name: string;
      type:
        | "singleLineText"
        | "email"
        | "url"
        | "multilineText"
        | "number"
        | "percent"
        | "currency"
        | "singleSelect"
        | "multipleSelects"
        | "singleCollaborator"
        | "multipleCollaborators"
        | "multipleRecordLinks"
        | "date"
        | "dateTime"
        | "phoneNumber"
        | "multipleAttachments"
        | "checkbox"
        | "formula"
        | "createdTime"
        | "rollup"
        | "count"
        | "lookup"
        | "multipleLookupValues"
        | "autoNumber"
        | "barcode"
        | "rating"
        | "richText"
        | "duration"
        | "lastModifiedTime"
        | "button"
        | "createdBy"
        | "lastModifiedBy"
        | "externalSyncSource";
      options?: Record<any, any>;
    }[];
  };
};

export const createTable = (payload?: CreateTablePayload) => {
  const url = `https://api.airtable.com/v0/meta/bases/${nutLogBaseId}/tables`;
  return axios({
    url,
    method: "post",
    headers: {
      Authorization: `Bearer ${nutLogAccessToken}`,
    },
    data: payload?.tableData,
  });
};
