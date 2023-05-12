export type SinglePrayerType = {
  name: string;
  prayer: string;
};

export type RecordsFromAirtable = {
  id: string;
  fields: {
    Name: string;
    Prayer: string;
    Amount: number;
    CreatedAt: string;
    Coming: boolean;
  };
}[];
