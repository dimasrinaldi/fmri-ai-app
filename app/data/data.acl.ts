
//  daftar page dan fiturnya jika diperlukan access controlnya
const _data = [
  { id: "All", describe: "All features and scope like Root" },
  { id: "None", describe: "No features can be accessed" },

  { id: "Scope_Super", describe: "Show all data" },
  { id: "Scope_Client", describe: "Show only client data" },

  { id: "Feature_View", describe: "View all basic features" },
  {
    id: "Feature_Privileged", describe: `
      Access to advanced analyst features including mutation capabilities and shoe detection system. 
      This privileged access enables users to manage data editing status and perform shoe recognition analysis.
    `
  },

  { id: "Admin_View", describe: "View all basic Admin" },

] as const;

export type TAclId = (typeof _data)[number]["id"];
export type TAcl = {
  id: TAclId;
  describe: string;
};
export const dataAcl: TAcl[] = _data as any;
export const getDataAcl = (id: TAclId): TAcl => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};

